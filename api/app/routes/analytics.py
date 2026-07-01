from fastapi import APIRouter
from app.db import get_db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("")
def get_analytics():
    db = get_db()

    contacts = db.table("contacts").select("id, status, created_at").execute().data or []
    deals    = db.table("deals").select("id, stage, value, close_date, created_at").execute().data or []
    recent_contacts = db.table("contacts").select("*").order("created_at", desc=True).limit(5).execute().data or []
    recent_deals    = db.table("deals").select("*, contact:contacts(id,name,company)").order("created_at", desc=True).limit(5).execute().data or []

    # Contacts by status
    statuses = ["lead", "prospect", "customer", "churned"]
    contacts_by_status = [{"status": s, "count": sum(1 for c in contacts if c["status"] == s)} for s in statuses]

    # Deals by stage
    stages = ["lead", "qualified", "proposal", "negotiation", "won", "lost"]
    deals_by_stage = [
        {
            "stage": s,
            "count": sum(1 for d in deals if d["stage"] == s),
            "value": sum(d["value"] or 0 for d in deals if d["stage"] == s),
        }
        for s in stages
    ]

    won_deals = [d for d in deals if d["stage"] == "won"]
    lost_count = sum(1 for d in deals if d["stage"] == "lost")
    total_revenue = sum(d["value"] or 0 for d in won_deals)
    conversion_rate = (
        round(len(won_deals) / (len(won_deals) + lost_count) * 100)
        if won_deals or lost_count else 0
    )

    # Monthly revenue — last 6 months
    monthly_revenue = []
    now = datetime.utcnow()
    for i in range(5, -1, -1):
        month_dt = now.replace(day=1) - timedelta(days=30 * i)
        label = month_dt.strftime("%b %Y")
        yr, mo = month_dt.year, month_dt.month
        rev = sum(
            d["value"] or 0
            for d in won_deals
            if d.get("close_date") and
               datetime.fromisoformat(d["close_date"]).year == yr and
               datetime.fromisoformat(d["close_date"]).month == mo
        )
        monthly_revenue.append({"month": label, "revenue": rev})

    return {
        "data": {
            "totalContacts": len(contacts),
            "totalDeals": len(deals),
            "totalRevenue": total_revenue,
            "wonDeals": len(won_deals),
            "conversionRate": conversion_rate,
            "recentContacts": recent_contacts,
            "recentDeals": recent_deals,
            "dealsByStage": deals_by_stage,
            "contactsByStatus": contacts_by_status,
            "monthlyRevenue": monthly_revenue,
        },
        "error": None,
    }
