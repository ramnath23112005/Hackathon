# InternetOS

**AI-Powered Autonomous Internet Research Agent**

Live system: [https://hackathon-navy-eta.vercel.app](https://hackathon-navy-eta.vercel.app)

InternetOS combines live internet data (via Anakin Wire), AI reasoning (via Groq/OpenAI), and an autonomous agent execution layer to transform real-time internet signals into structured intelligence reports.

---

## Architecture

```
User → Vercel Frontend → Render Backend → Anakin Wire (internet data) → Groq LLM (analysis) → Intelligence Report
```

```
internetos/
├── frontend/              # Next.js 14 App Router (TypeScript + Tailwind)
│   ├── app/               # Pages and layout
│   ├── components/        # UI components (ChatPanel, AgentTimeline, IntelligencePanel, etc.)
│   │   ├── report/        # Report card components
│   │   └── ui/            # Base UI components
│   └── public/
├── backend/               # FastAPI (Python)
│   ├── core/              # Config, CORS, middleware, demo mode
│   ├── models/            # Pydantic schemas + agent state
│   ├── routes/            # API route handlers (chat, agent)
│   └── services/          # Business logic (wire, LLM, agent, chat)
└── README.md
```

---

## Deployed URLs

| Service | URL |
|---------|-----|
| Frontend | [https://hackathon-navy-eta.vercel.app](https://hackathon-navy-eta.vercel.app) |
| Backend | [https://hackathon-9a3r.onrender.com](https://hackathon-9a3r.onrender.com) |
| Health Check | [https://hackathon-9a3r.onrender.com/health](https://hackathon-9a3r.onrender.com/health) |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (returns status, version, demo mode) |
| POST | `/agent/run` | Start an agent research session |
| GET | `/agent/status/{session_id}` | Poll agent execution status |
| GET | `/agent/result/{session_id}` | Get final result (when complete) |
| POST | `/chat` | Direct chat (legacy) |

---

## Local Development

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment Guide

### Frontend (Vercel)

1. Push code to GitHub (Vercel auto-deploys from `main` branch)
2. Or deploy manually via Vercel CLI:
   ```bash
   cd frontend
   vercel --prod
   ```

**Environment Variables (Vercel):**

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://hackathon-9a3r.onrender.com` |

### Backend (Render)

1. Connect GitHub repo to Render
2. Create a **Web Service** with:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2`

**Environment Variables (Render):**

| Key | Value | Description |
|-----|-------|-------------|
| `CORS_ORIGINS` | `["http://localhost:3000","https://hackathon-navy-eta.vercel.app"]` | Allowed origins |
| `DEBUG` | `false` | Production mode |
| `LLM_ENABLED` | `true` | Enable AI analysis |
| `OPENAI_API_KEY` | `gsk_your_key` | Groq API key |
| `OPENAI_BASE_URL` | `https://api.groq.com/openai/v1` | Groq endpoint |
| `OPENAI_MODEL` | `llama-3.3-70b-versatile` | Model name |
| `OPENAI_TEMPERATURE` | `0.3` | Model temperature |
| `OPENAI_TIMEOUT` | `30` | LLM timeout |
| `OPENAI_MAX_RETRIES` | `2` | Retry count |
| `WIRE_API_KEY` | `ask_your_key` | Anakin Wire key |
| `WIRE_BASE_URL` | `https://api.anakin.io/v1` | Wire endpoint |
| `WIRE_TIMEOUT` | `30` | Wire timeout |
| `WIRE_ACTION_REDDIT` | `rt_search` | Reddit action ID |
| `WIRE_ACTION_NEWS` | `gn_search` | News action ID |
| `DEMO_MODE` | `false` | Set `true` for safe judging |

---

## Demo Mode

For live judging, set `DEMO_MODE=true` on the backend. This:

- Uses cached Wire responses (no internet dependency)
- Uses cached LLM responses (no API key dependency)
- Guarantees zero API failures during demo
- Returns consistent, polished results every time

When `DEMO_MODE=false`, the system uses live Wire and LLM APIs.

---

## Phases

| Phase | Description |
|-------|-------------|
| 1 | Full-stack foundation (Next.js + FastAPI) |
| 2 | Live internet data via Anakin Wire |
| 3 | AI reasoning + structured intelligence reports |
| 4 | Agent execution system (step-by-step visible reasoning) |
| 5 | Product UI polish (3-panel layout, Framer Motion, premium theme) |
| 6 | Production deployment (Vercel + Render, demo mode, hardening) |
