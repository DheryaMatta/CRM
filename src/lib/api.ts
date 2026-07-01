const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

async function fetchJSON<T = any>(url: string, options?: RequestInit): Promise<{ data: T | null; error: string | null; count?: number }> {
    try {
        const res = await fetch(`${BASE}${url}`, {
            headers: { "Content-Type": "application/json" },
            ...options,
        })
        const json = await res.json()
        if (!res.ok) return { data: null, error: json.detail || "Request failed" }
        return json
    } catch (err) {
        return { data: null, error: String(err) }
    }
}

// ── Contacts ───────────────────────────────────────────────
export const contactsAPI = {
    list: (p?: { search?: string; status?: string; page?: number; limit?: number }) => {
        const q = new URLSearchParams(p as Record<string, string>).toString()
        return fetchJSON(`/api/contacts${q ? "?" + q : ""}`)
    },
    get: (id: string) => fetchJSON(`/api/contacts/${id}`),
    create: (body: object) => fetchJSON("/api/contacts", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: object) => fetchJSON(`/api/contacts/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (id: string) => fetchJSON(`/api/contacts/${id}`, { method: "DELETE" }),
}

// ── Deals ──────────────────────────────────────────────────
export const dealsAPI = {
    list: (p?: { stage?: string; contact_id?: string }) => {
        const q = new URLSearchParams(p as Record<string, string>).toString()
        return fetchJSON(`/api/deals${q ? "?" + q : ""}`)
    },
    get: (id: string) => fetchJSON(`/api/deals/${id}`),
    create: (body: object) => fetchJSON("/api/deals", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: object) => fetchJSON(`/api/deals/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    updateStage: (id: string, stage: string) => fetchJSON(`/api/deals/${id}`, { method: "PATCH", body: JSON.stringify({ stage }) }),
    delete: (id: string) => fetchJSON(`/api/deals/${id}`, { method: "DELETE" }),
}

// ── Events / Calendar ──────────────────────────────────────
export const eventsAPI = {
    list: (p?: { start?: string; end?: string; contact_id?: string; completed?: string }) => {
        const q = new URLSearchParams(p as Record<string, string>).toString()
        return fetchJSON(`/api/events${q ? "?" + q : ""}`)
    },
    get: (id: string) => fetchJSON(`/api/events/${id}`),
    create: (body: object) => fetchJSON("/api/events", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: object) => fetchJSON(`/api/events/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    complete: (id: string) => fetchJSON(`/api/events/${id}`, { method: "PATCH", body: JSON.stringify({ completed: true }) }),
    delete: (id: string) => fetchJSON(`/api/events/${id}`, { method: "DELETE" }),
}

// ── Analytics ──────────────────────────────────────────────
export const analyticsAPI = {
    getDashboard: () => fetchJSON("/api/analytics"),
}

// ── AI Insights ────────────────────────────────────────────
export const aiAPI = {
    pipelineForecast: () =>
        fetchJSON("/api/ai", { method: "POST", body: JSON.stringify({ type: "pipeline_forecast" }) }),
    contactScore: (contact_id: string) =>
        fetchJSON("/api/ai", { method: "POST", body: JSON.stringify({ type: "contact_score", data: { contact_id } }) }),
    churnRisk: () =>
        fetchJSON("/api/ai", { method: "POST", body: JSON.stringify({ type: "churn_risk" }) }),
    dealAnalysis: (deal_id: string) =>
        fetchJSON("/api/ai", { method: "POST", body: JSON.stringify({ type: "deal_analysis", data: { deal_id } }) }),
    emailDraft: (params: { contact_name: string; contact_company: string; purpose: string; tone?: string }) =>
        fetchJSON("/api/ai", { method: "POST", body: JSON.stringify({ type: "email_draft", data: params }) }),
    chat: (message: string, context?: object) =>
        fetchJSON("/api/ai", { method: "POST", body: JSON.stringify({ type: "general_chat", data: { message, context } }) }),
    getCached: (type?: string, entity_id?: string) => {
        const q = new URLSearchParams({ ...(type ? { type } : {}), ...(entity_id ? { entity_id } : {}) }).toString()
        return fetchJSON(`/api/ai${q ? "?" + q : ""}`)
    },
}

// ── Settings ───────────────────────────────────────────────
export const settingsAPI = {
    get: () => fetchJSON("/api/settings"),
    update: (body: object) => fetchJSON("/api/settings", { method: "PATCH", body: JSON.stringify(body) }),
}
