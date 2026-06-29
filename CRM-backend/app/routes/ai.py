from fastapi import APIRouter, Query, HTTPException
from app.db import get_db
from app.models.schemas import AIRequest
from app.config import settings
from google import genai
from google.genai import types
import json
import re

router = APIRouter()
if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
else:
    client = None

SYSTEM = "You are an expert CRM AI assistant. Return ONLY valid JSON with no markdown fences or explanation."

def call_gemini(prompt: str, system: str = SYSTEM) -> dict:
    if not client:
        return {"error": "Gemini API key is missing. Please configure GEMINI_API_KEY in .env"}
    
    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system
        )
    )
    raw = response.text
    clean = re.sub(r"```json\n?|\n?```", "", raw).strip()
    try:
        return json.loads(clean)
    except Exception:
        return {"raw": raw}


@router.post("")
def generate_insight(body: AIRequest):
    db = get_db()
    t = body.type
    d = body.data or {}

    if t == "pipeline_forecast":
        deals = db.table("deals").select("*, contact:contacts(name,company)").execute().data
        prompt = f"""Analyze this sales pipeline and forecast:
{json.dumps(deals, indent=2)}

Return JSON:
{{
  "forecast_30_days": number,
  "forecast_60_days": number,
  "forecast_90_days": number,
  "at_risk_deals": [{{"id":"string","title":"string","reason":"string"}}],
  "hot_deals": [{{"id":"string","title":"string","reason":"string"}}],
  "recommendations": ["string"],
  "win_probability_avg": number,
  "summary": "string"
}}"""

    elif t == "contact_score":
        contact_id = d.get("contact_id")
        if not contact_id:
            raise HTTPException(status_code=400, detail="contact_id required")
        contact = db.table("contacts").select("*, deals(*), events(*)").eq("id", contact_id).single().execute().data
        prompt = f"""Score this CRM contact for sales potential:
{json.dumps(contact, indent=2)}

Return JSON:
{{
  "score": number (0-100),
  "grade": "A"|"B"|"C"|"D",
  "engagement_level": "high"|"medium"|"low",
  "strengths": ["string"],
  "concerns": ["string"],
  "next_action": "string",
  "next_action_priority": "urgent"|"high"|"medium"|"low",
  "summary": "string"
}}"""

    elif t == "churn_risk":
        customers = db.table("contacts").select("*, deals(*), events(*)").eq("status", "customer").execute().data
        prompt = f"""Analyze churn risk for these CRM customers:
{json.dumps(customers, indent=2)}

Return JSON:
{{
  "high_risk": [{{"id":"string","name":"string","risk_score":number,"reason":"string"}}],
  "medium_risk": [{{"id":"string","name":"string","risk_score":number,"reason":"string"}}],
  "low_risk": [{{"id":"string","name":"string","risk_score":number}}],
  "overall_churn_rate_estimate": number,
  "recommendations": ["string"]
}}"""

    elif t == "deal_analysis":
        deal_id = d.get("deal_id")
        if not deal_id:
            raise HTTPException(status_code=400, detail="deal_id required")
        deal = db.table("deals").select("*, contact:contacts(*, events(*))").eq("id", deal_id).single().execute().data
        prompt = f"""Deeply analyze this CRM deal:
{json.dumps(deal, indent=2)}

Return JSON:
{{
  "win_probability": number (0-100),
  "deal_health": "healthy"|"at_risk"|"stalled"|"critical",
  "blockers": ["string"],
  "strengths": ["string"],
  "next_steps": ["string"],
  "estimated_close": "string",
  "recommended_discount": number,
  "summary": "string"
}}"""

    elif t == "email_draft":
        prompt = f"""Write a professional CRM sales email.
Contact: {d.get('contact_name')} at {d.get('contact_company')}
Purpose: {d.get('purpose', 'follow-up')}
Tone: {d.get('tone', 'professional')}

Return JSON:
{{
  "subject": "string",
  "body": "string (use \\n for newlines)",
  "call_to_action": "string",
  "follow_up_date": "string"
}}"""

    elif t == "general_chat":
        contacts_count = db.table("contacts").select("id", count="exact", head=True).execute().count or 0
        deals_data = db.table("deals").select("stage, value").execute().data or []
        context_summary = {
            "total_contacts": contacts_count,
            "total_deals": len(deals_data),
            "pipeline_value": sum(x["value"] or 0 for x in deals_data),
            "won_deals": sum(1 for x in deals_data if x["stage"] == "won"),
            **d.get("context", {}),
        }
        system = f"You are a helpful CRM AI assistant. CRM context: {json.dumps(context_summary)}. Answer helpfully. Return JSON: {{\"response\": \"your answer\", \"suggestions\": [\"question1\", \"question2\"]}}"
        result = call_gemini(d.get("message", "What insights do you have?"), system)
        return {"data": result, "error": None}

    else:
        raise HTTPException(status_code=400, detail=f"Unknown type: {t}")

    result = call_gemini(prompt)

    # Cache insight (non-chat)
    entity_id = d.get("contact_id") or d.get("deal_id") or None
    db.table("ai_insights").insert({
        "type": t,
        "entity_id": entity_id,
        "content": result,
    }).execute()

    return {"data": result, "error": None}


@router.get("")
def get_cached_insights(
    type: str = Query(""),
    entity_id: str = Query(""),
):
    db = get_db()
    query = db.table("ai_insights").select("*").order("generated_at", desc=True).limit(20)
    if type:
        query = query.eq("type", type)
    if entity_id:
        query = query.eq("entity_id", entity_id)
    result = query.execute()
    return {"data": result.data, "error": None}
