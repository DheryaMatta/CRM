from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import contacts, deals, events, analytics, ai, settings

app = FastAPI(title="CRM Backend API", version="1.0.0")

# Allow your Next.js frontend (localhost:3000 in dev, your domain in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://your-crm-domain.com", 
        "https://crm-pearl-two.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contacts.router, prefix="/api/contacts", tags=["Contacts"])
app.include_router(deals.router,    prefix="/api/deals",    tags=["Deals"])
app.include_router(events.router,   prefix="/api/events",   tags=["Events"])
app.include_router(analytics.router,prefix="/api/analytics",tags=["Analytics"])
app.include_router(ai.router,       prefix="/api/ai",       tags=["AI"])
app.include_router(settings.router, prefix="/api/settings", tags=["Settings"])

@app.get("/")
def root():
    return {"status": "CRM API is running"}
