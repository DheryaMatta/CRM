from fastapi import APIRouter, Query, HTTPException
from app.db import get_db
from app.models.schemas import ContactCreate, ContactUpdate

router = APIRouter()

@router.get("")
def list_contacts(
    search: str = Query(""),
    status: str = Query(""),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
):
    db = get_db()
    offset = (page - 1) * limit

    query = db.table("contacts").select("*", count="exact").order("created_at", desc=True)

    if search:
        query = query.or_(f"name.ilike.%{search}%,email.ilike.%{search}%,company.ilike.%{search}%")
    if status:
        query = query.eq("status", status)

    result = query.range(offset, offset + limit - 1).execute()
    return {"data": result.data, "count": result.count, "error": None}


@router.post("", status_code=201)
def create_contact(body: ContactCreate):
    db = get_db()
    payload = body.model_dump(exclude_none=True)
    result = db.table("contacts").insert(payload).execute()
    return {"data": result.data[0], "error": None}


@router.get("/{contact_id}")
def get_contact(contact_id: str):
    db = get_db()
    result = db.table("contacts").select("*, deals(*), events(*)").eq("id", contact_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"data": result.data, "error": None}


@router.patch("/{contact_id}")
def update_contact(contact_id: str, body: ContactUpdate):
    db = get_db()
    payload = body.model_dump(exclude_none=True)
    result = db.table("contacts").update(payload).eq("id", contact_id).execute()
    return {"data": result.data[0], "error": None}


@router.delete("/{contact_id}")
def delete_contact(contact_id: str):
    db = get_db()
    db.table("contacts").delete().eq("id", contact_id).execute()
    return {"data": {"id": contact_id}, "error": None}
