import asyncio
import uuid
from datetime import datetime, timezone
from typing import Any

from core.config import settings
from core.logger import setup_logger
from models.agent_state import AGENT_STEPS, AgentState
from services.llm_service import generate_intelligence
from services.wire_service import query_internet

logger = setup_logger("agent_service")

_sessions: dict[str, AgentState] = {}


def _update_state(session_id: str, step: AgentStep, action: str = "") -> None:
    state = _sessions.get(session_id)
    if not state:
        return
    state.step = step.step
    state.status = "running"
    state.current_action = action or step.label
    state.progress = step.progress
    if step.label not in state.logs:
        state.logs.append(step.label)


def create_session(query: str) -> str:
    session_id = str(uuid.uuid4())
    state = AgentState(
        session_id=session_id,
        query=query,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    _sessions[session_id] = state
    return session_id


def get_state(session_id: str) -> AgentState | None:
    return _sessions.get(session_id)


async def run_agent(session_id: str, query: str) -> None:
    state = _sessions.get(session_id)
    if not state:
        logger.warning("Session %s not found", session_id)
        return

    try:
        s1 = AGENT_STEPS[0]
        _update_state(session_id, s1, f"Analyzing query: '{query[:80]}{'...' if len(query) > 80 else ''}'")
        await asyncio.sleep(0.6)

        s2 = AGENT_STEPS[1]
        focus = _plan_search_focus(query)
        _update_state(session_id, s2, focus)
        await asyncio.sleep(0.4)

        s3 = AGENT_STEPS[3]
        _update_state(session_id, s3)
        await asyncio.sleep(0.2)

        s4 = AGENT_STEPS[2]
        _update_state(session_id, s4, "Searching Reddit, News, and Web sources...")
        wire_result = await query_internet(query)
        await asyncio.sleep(0.3)

        s5 = AGENT_STEPS[4]
        normalized = wire_result.get("normalized", {})
        results_count = len(normalized.get("results", []))
        sources_count = len(normalized.get("sources", []))
        _update_state(session_id, s5, f"Processed {results_count} results across {sources_count} sources")
        await asyncio.sleep(0.3)

        s6 = AGENT_STEPS[5]
        _update_state(session_id, s6, "Running deep reasoning on collected data...")
        intelligence = await generate_intelligence(query, normalized)
        await asyncio.sleep(0.3)

        s7 = AGENT_STEPS[6]
        _update_state(session_id, s7, "Structuring intelligence report...")

        sources_list = [
            {"source": s.get("source", ""), "error": s.get("error"), "count": s.get("count", 0)}
            for s in normalized.get("sources", [])
        ]

        result = {
            "query": query,
            "sources": sources_list,
            "data": {
                "summary_context": normalized.get("summary_context", ""),
                "key_entities": normalized.get("key_entities", []),
                "trends": normalized.get("trends", []),
                "sources": sources_list,
                "results": normalized.get("results", []),
            },
            "intelligence": intelligence.model_dump() if intelligence else None,
        }

        s8 = AGENT_STEPS[7]
        state = _sessions[session_id]
        state.step = s8.step
        state.status = "completed"
        state.current_action = s8.label
        state.progress = s8.progress
        state.logs.append(s8.label)
        state.result = result

        logger.info("Agent %s completed successfully", session_id)

    except Exception as e:
        logger.error("Agent %s failed: %s", session_id, str(e))
        state = _sessions.get(session_id)
        if state:
            state.step = "failed"
            state.status = "failed"
            state.error = str(e)
            state.logs.append(f"Failed: {str(e)[:120]}")
            state.progress = 0


def _plan_search_focus(query: str) -> str:
    query_lower = query.lower()
    if any(w in query_lower for w in ["reddit", "reddit", "r/"]):
        return "Prioritizing Reddit discussions"
    if any(w in query_lower for w in ["news", "latest", "update", "today", "breaking"]):
        return "Prioritizing news sources"
    if any(w in query_lower for w in ["top", "best", "startup", "company", "product"]):
        return "Searching across Reddit, News, and Web for rankings and reviews"
    if any(w in query_lower for w in ["price", "stock", "market", "crypto", "bitcoin"]):
        return "Gathering financial data from news and web sources"
    if any(w in query_lower for w in ["who", "person", "ceo", "founder"]):
        return "Searching for people and profiles across sources"
    return "Searching across Reddit, News, and Web for relevant results"


async def start_agent(query: str) -> str:
    session_id = create_session(query)
    asyncio.create_task(run_agent(session_id, query))
    return session_id
