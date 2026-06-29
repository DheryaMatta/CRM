from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
from datetime import datetime, date

# ── Contacts ──────────────────────────────────────────────────
ContactStatus = Literal["lead", "prospect", "customer", "churned"]

class ContactCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    status: ContactStatus = "lead"
    tags: List[str] = []
    notes: Optional[str] = None
    avatar_url: Optional[str] = None

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    status: Optional[ContactStatus] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    avatar_url: Optional[str] = None

# ── Deals ─────────────────────────────────────────────────────
DealStage = Literal["lead", "qualified", "proposal", "negotiation", "won", "lost"]

class DealCreate(BaseModel):
    title: str
    contact_id: Optional[str] = None
    stage: DealStage = "lead"
    value: float = 0
    probability: int = 0
    close_date: Optional[date] = None
    notes: Optional[str] = None

class DealUpdate(BaseModel):
    title: Optional[str] = None
    contact_id: Optional[str] = None
    stage: Optional[DealStage] = None
    value: Optional[float] = None
    probability: Optional[int] = None
    close_date: Optional[date] = None
    notes: Optional[str] = None

# ── Events ────────────────────────────────────────────────────
EventType = Literal["meeting", "call", "email", "task", "demo"]

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: EventType = "meeting"
    contact_id: Optional[str] = None
    deal_id: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    completed: bool = False

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[EventType] = None
    contact_id: Optional[str] = None
    deal_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    completed: Optional[bool] = None

# ── AI ────────────────────────────────────────────────────────
class AIRequest(BaseModel):
    type: str  # pipeline_forecast | contact_score | churn_risk | deal_analysis | email_draft | general_chat
    data: Optional[dict] = None

# ── Settings ──────────────────────────────────────────────────
class SettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    currency: Optional[str] = None
    pipeline_stages: Optional[List[str]] = None
    notifications_enabled: Optional[bool] = None
