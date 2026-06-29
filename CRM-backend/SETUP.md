# CRM Python Backend — Setup Guide

## Stack
- **Python** FastAPI — fast, modern, async-ready
- **Supabase** — cloud PostgreSQL (works on any device, free tier)
- **Claude AI** (Anthropic) — powers AI Insights
- **Uvicorn** — production ASGI server

---

## Step 1 — Clone / create the backend folder

Put this `crm-backend/` folder **next to** (not inside) your Next.js CRM project:

```
your-workspace/
  CRM/              ← your Next.js frontend
  crm-backend/      ← this Python backend
```

---

## Step 2 — Install Python dependencies

```bash
cd crm-backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## Step 3 — Set up Supabase (free cloud database)

1. Go to **https://supabase.com** → Sign up → New Project
2. Wait ~1 minute for it to spin up
3. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**
4. Go to **Settings → API** and copy:
   - Project URL → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 4 — Get Anthropic API Key

1. Go to **https://console.anthropic.com** → Sign up
2. **API Keys** → Create new key
3. Copy it → `ANTHROPIC_API_KEY`

---

## Step 5 — Create .env file

```bash
cp .env.example .env
# Then fill in your 4 keys
```

---

## Step 6 — Run the backend

```bash
uvicorn main:app --reload --port 8000
```

Backend is now live at **http://localhost:8000**

Visit **http://localhost:8000/docs** for interactive Swagger UI — test every endpoint in the browser!

---

## Step 7 — Connect your Next.js frontend

1. Copy `frontend-api-client.ts` → `CRM/src/lib/api.ts`
2. Add to your Next.js `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Use in your pages:
   ```tsx
   import { contactsAPI, dealsAPI, aiAPI, analyticsAPI } from '@/lib/api'

   // Dashboard
   const { data: stats } = await analyticsAPI.getDashboard()

   // Contacts page
   const { data: contacts } = await contactsAPI.list({ search: 'alice' })
   await contactsAPI.create({ name: 'John', email: 'john@co.com', status: 'lead', tags: [] })

   // Pipeline — move a card between stages
   await dealsAPI.updateStage(dealId, 'proposal')

   // Calendar
   const { data: events } = await eventsAPI.list({ start: '2026-06-01T00:00:00Z', end: '2026-06-30T23:59:59Z' })

   // AI Insights
   const forecast = await aiAPI.pipelineForecast()
   const score = await aiAPI.contactScore(contactId)
   const reply = await aiAPI.chat('Which deals close this month?')
   ```

---

## API Reference

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/contacts | List (search, status, page, limit) |
| POST | /api/contacts | Create |
| GET | /api/contacts/:id | Get + deals + events |
| PATCH | /api/contacts/:id | Update |
| DELETE | /api/contacts/:id | Delete |
| GET | /api/deals | List (stage, contact_id) |
| POST | /api/deals | Create |
| PATCH | /api/deals/:id | Update / move stage |
| DELETE | /api/deals/:id | Delete |
| GET | /api/events | List (start, end, contact_id, completed) |
| POST | /api/events | Create |
| PATCH | /api/events/:id | Update / mark complete |
| DELETE | /api/events/:id | Delete |
| GET | /api/analytics | All dashboard stats |
| POST | /api/ai | Generate AI insight |
| GET | /api/ai | Fetch cached insights |
| GET | /api/settings | Get settings |
| PATCH | /api/settings | Update settings |

### AI Types (POST /api/ai → `{ "type": "...", "data": {} }`)
| type | data needed | what it returns |
|------|-------------|-----------------|
| `pipeline_forecast` | — | 30/60/90-day revenue forecast + hot/at-risk deals |
| `contact_score` | `{ contact_id }` | Score 0-100, grade, next action |
| `churn_risk` | — | High/medium/low risk customers |
| `deal_analysis` | `{ deal_id }` | Win probability, blockers, next steps |
| `email_draft` | `{ contact_name, contact_company, purpose, tone }` | Subject + body |
| `general_chat` | `{ message }` | Conversational answer about your CRM |

---

## Deploy (sell to clients)

Each client = their own Supabase project + one Python backend deployment.

**Free options:**
- **Railway.app** — `railway up` (free tier, auto-deploys from git)
- **Render.com** — connect GitHub, free tier
- **Fly.io** — `fly deploy` (generous free tier)

**Per-client setup:**
1. Create new Supabase project → run `schema.sql`
2. Set their env vars
3. Deploy backend to Railway/Render
4. Set `NEXT_PUBLIC_API_URL` in their frontend deployment (Vercel)
