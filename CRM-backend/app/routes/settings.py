from fastapi import APIRouter
from app.db import get_db

router = APIRouter()

@router.get("")
def get_settings():
    db = get_db()
    rows = db.table("settings").select("*").execute().data or []
    settings_map = {row["key"]: row["value"] for row in rows}
    return {"data": settings_map, "error": None}

@router.patch("")
def update_settings(body: dict):
    db = get_db()
    upserts = [{"key": k, "value": v} for k, v in body.items()]
    result = db.table("settings").upsert(upserts, on_conflict="key").execute()
    return {"data": result.data, "error": None}
