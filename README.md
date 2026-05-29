# InternetOS

AI-Powered Autonomous Internet Research Agent.

## Structure

```
internetos/
├── frontend/          # Next.js App Router (TypeScript + Tailwind)
├── backend/           # FastAPI (Python)
│   ├── core/          # Config, CORS, middleware
│   ├── models/        # Pydantic request/response schemas
│   ├── routes/        # API route handlers
│   └── services/      # Business logic layer
└── README.md
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## API Endpoints

| Method | Path     | Description          |
|--------|----------|----------------------|
| GET    | /health  | Health check         |
| POST   | /chat    | Send a chat message  |

## Phase 1

Minimal full-stack scaffold with:
- Chat UI → POST /chat → dummy response
- Clean modular architecture
- CORS configured for local dev
