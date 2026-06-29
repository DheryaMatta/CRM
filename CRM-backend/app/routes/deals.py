from fastapi import APIRouter, Query, HTTPException
from app.db import get_db
from app.models.schemas import DealCreate, DealUpdate

router = APIRouter()

@router.get("")
def list_deals(
    stage: str = Query(""),
    contact_id: str = Query(""),
):
    db = get_db()
    query = db.table("deals").select("*, contact:contacts(id,name,email,company)", count="exact").order("created_at", desc=True)

    if stage:
        query = query.eq("stage", stage)
    if contact_id:
        query = query.eq("contact_id", contact_id)

    result = query.execute()
    return {"data": result.data, "count": result.count, "error": None}


@router.post("", status_code=201)
def create_deal(body: DealCreate):
    db = get_db()
    payload = body.model_dump(exclude_none=True)
    # Serialize date to string if present
    if "close_date" in payload and payload["close_date"]:
        payload["close_date"] = str(payload["close_date"])
    result = db.table("deals").insert(payload).execute()
    return {"data": result.data[0], "error": None}


@router.get("/{deal_id}")
def get_deal(deal_id: str):
    db = get_db()
    result = db.table("deals").select("*, contact:contacts(*), events(*)").eq("id", deal_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Deal not found")
    return {"data": result.data, "error": None}


@router.patch("/{deal_id}")
def update_deal(deal_id: str, body: DealUpdate):
    db = get_db()
    payload = body.model_dump(exclude_none=True)
    if "close_date" in payload and payload["close_date"]:
        payload["close_date"] = str(payload["close_date"])
    result = db.table("deals").update(payload).eq("id", deal_id).execute()
    return {"data": result.data[0], "error": None}


@router.delete("/{deal_id}")
def delete_deal(deal_id: str):
    db = get_db()
    db.table("deals").delete().eq("id", deal_id).execute()
    return {"data": {"id": deal_id}, "error": None}
