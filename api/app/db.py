from supabase import create_client, Client
from app.config import settings

_db_client = None

# Admin client — bypasses RLS, use only in API routes (server-side)
def get_db() -> Client:
    global _db_client
    if _db_client is None:
        _db_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _db_client
