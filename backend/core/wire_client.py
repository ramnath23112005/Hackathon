import asyncio
from typing import Any

from anakin import Anakin

from core.config import settings
from core.logger import setup_logger

logger = setup_logger("wire_client")

ACTION_KEYS = ["x", "reddit", "news", "web"]
ACTION_CONFIG_MAP = {
    "x": "wire_action_x",
    "reddit": "wire_action_reddit",
    "news": "wire_action_news",
    "web": "wire_action_web",
}


def _get_action_id(source: str) -> str | None:
    field = ACTION_CONFIG_MAP.get(source)
    if not field:
        return None
    return getattr(settings, field, None) or None


def _run_wire_sync(action_id: str, query: str) -> dict[str, Any]:
    if not settings.wire_api_key:
        logger.warning("No Wire API key configured — skipping real API call")
        return {"action": action_id, "query": query, "error": "no_api_key", "results": []}

    try:
        client = Anakin(
            api_key=settings.wire_api_key,
            base_url=settings.wire_base_url,
            timeout=settings.wire_timeout,
        )
        result = client.wire(action_id, {"query": query})
        logger.debug("Wire %s completed — status=%s", action_id, result.status)

        return {
            "action": action_id,
            "query": query,
            "status": result.status,
            "data": result.data if result.data else {},
            "error": result.error.message if result.error else None,
            "results": result.data if result.data else [],
        }

    except Exception as e:
        logger.error("Wire %s failed: %s", action_id, str(e))
        return {"action": action_id, "query": query, "error": str(e), "results": []}


async def search_all(query: str) -> list[dict[str, Any]]:
    action_ids = [_get_action_id(s) for s in ACTION_KEYS]
    configured = [aid for aid in action_ids if aid]

    if not configured:
        logger.warning("No Wire action IDs configured — returning empty")
        return [
            {"action": k, "query": query, "error": "no_action_id", "results": []}
            for k in ACTION_KEYS
        ]

    results = await asyncio.gather(*[
        asyncio.to_thread(_run_wire_sync, aid, query)
        for aid in configured
    ])

    logger.info("Wire pipeline complete — %d actions executed", len(results))
    return results
