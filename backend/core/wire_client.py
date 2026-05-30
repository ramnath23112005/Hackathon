import asyncio
from typing import Any

from anakin import Anakin

from core.config import settings
from core.logger import setup_logger

logger = setup_logger("wire_client")

WIRE_ACTIONS = {
    "x": "wire_action_x",
    "reddit": "wire_action_reddit",
    "news": "wire_action_news",
}


def _get_action_id(source: str) -> str | None:
    field = WIRE_ACTIONS.get(source)
    if not field:
        return None
    return getattr(settings, field, None) or None


def _get_client() -> Anakin | None:
    if not settings.wire_api_key:
        logger.warning("No Wire API key configured")
        return None
    return Anakin(
        api_key=settings.wire_api_key,
        base_url=settings.wire_base_url,
        timeout=settings.wire_timeout,
    )


def _run_wire_action(client: Anakin, action_id: str, query: str) -> dict[str, Any]:
    try:
        result = client.wire(action_id, {"query": query})
        logger.debug("Wire %s — status=%s", action_id, result.status)
        return {
            "action": action_id,
            "query": query,
            "status": result.status,
            "error": result.error.message if result.error else None,
            "results": result.data if result.data else [],
        }
    except Exception as e:
        logger.error("Wire %s failed: %s", action_id, str(e))
        return {"action": action_id, "query": query, "error": str(e), "results": []}


def _run_web_search(client: Anakin, query: str) -> dict[str, Any]:
    try:
        result = client.search(query, limit=8)
        items = [r.model_dump() for r in result.results]
        logger.debug("Web search returned %d results", len(items))
        return {
            "action": "web_search",
            "query": query,
            "status": "completed",
            "error": None,
            "results": items,
        }
    except Exception as e:
        logger.error("Web search failed: %s", str(e))
        return {"action": "web_search", "query": query, "error": str(e), "results": []}


async def search_all(query: str) -> list[dict[str, Any]]:
    client = _get_client()

    if not client:
        return [
            {"action": k, "query": query, "error": "no_api_key", "results": []}
            for k in list(WIRE_ACTIONS.keys()) + ["web"]
        ]

    tasks: list[Any] = []

    for source, action_id in _configured_actions():
        tasks.append(asyncio.to_thread(_run_wire_action, client, action_id, query))

    tasks.append(asyncio.to_thread(_run_web_search, client, query))

    results = await asyncio.gather(*tasks)
    logger.info("Wire pipeline complete — %d sources", len(results))
    return results


def _configured_actions() -> list[tuple[str, str]]:
    result: list[tuple[str, str]] = []
    for source, field in WIRE_ACTIONS.items():
        aid = getattr(settings, field, None)
        if aid:
            result.append((source, aid))
    return result
