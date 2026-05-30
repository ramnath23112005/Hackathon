from fastapi import APIRouter, HTTPException

from models.agent_state import AGENT_STEPS, AgentState
from services.agent_service import get_state, start_agent

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/run")
async def agent_run(body: dict):
    query = body.get("message", "").strip()
    if not query:
        raise HTTPException(status_code=400, detail="message is required")
    session_id = await start_agent(query)
    return {"session_id": session_id, "steps": [s.model_dump() for s in AGENT_STEPS]}


@router.get("/status/{session_id}")
async def agent_status(session_id: str):
    state = get_state(session_id)
    if not state:
        raise HTTPException(status_code=404, detail="Session not found")
    return state.model_dump()
