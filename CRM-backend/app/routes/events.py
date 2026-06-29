from fastapi import APIRouter, Query, HTTPException
from app.db import get_db
from app.models.schemas import EventCreate, EventUpdate

router = APIRouter()

@router.get("")
def list_events(
    start: str = Query(""),
    end: str = Query(""),
    contact_id: str = Query(""),
    completed: str = Query(""),
):
    db = get_db()
    query = (
        db.table("events")
        .select("*, contact:contacts(id,name,email), deal:deals(id,title)", count="exact")
        .order("start_time", desc=False)
    )

    if start:
        query = query.gte("start_time", start)
    if end:
        query = query.lte("start_time", end)
    if contact_id:
        query = query.eq("contact_id", contact_id)
    if completed != "":
        query = query.eq("completed", completed.lower() == "true")

    result = query.execute()
    return {"data": result.data, "count": result.count, "error": None}


@router.post("", status_code=201)
def create_event(body: EventCreate):
    db = get_db()
    payload = body.model_dump(exclude_none=True)
    # Serialize datetimes
    for field in ("start_time", "end_time"):
        if field in payload and payload[field]:
            payload[field] = payload[field].isoformat()
    result = db.table("events").insert(payload).execute()
    return {"data": result.data[0], "error": None}


@router.get("/{event_id}")
def get_event(event_id: str):
    db = get_db()
    result = db.table("events").select("*, contact:contacts(*), deal:deals(*)").eq("id", event_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"data": result.data, "error": None}


@router.patch("/{event_id}")
def update_event(event_id: str, body: EventUpdate):
    db = get_db()
    payload = body.model_dump(exclude_none=True)
    for field in ("start_time", "end_time"):
        if field in payload and payload[field]:
            payload[field] = payload[field].isoformat()
    result = db.table("events").update(payload).eq("id", event_id).execute()
    return {"data": result.data[0], "error": None}


@router.delete("/{event_id}")
def delete_event(event_id: str):
    db = get_db()
    db.table("events").delete().eq("id", event_id).execute()
    return {"data": {"id": event_id}, "error": None}
