import asyncio
from typing import Any

import httpx

from core.config import settings
from core.logger import setup_logger

logger = setup_logger("wire_client")

WIRE_ACTIONS = {
    "x": "search_x",
    "reddit": "search_reddit",
    "news": "search_news",
    "web": "search_web",
}


class WireClientError(Exception):
    pass


class WireClient:
    def __init__(self) -> None:
        self.base_url = settings.wire_base_url
        self.api_key = settings.wire_api_key
        self.timeout = settings.wire_timeout

    async def _call_action(self, action: str, query: str) -> dict[str, Any]:
        if not self.api_key:
            logger.warning("No Wire API key configured — skipping real API call")
            return {"action": action, "query": query, "error": "no_api_key", "results": []}

        url = f"{self.base_url}/v1/actions/call"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "action": action,
            "input": {"query": query},
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(url, json=payload, headers=headers)
                resp.raise_for_status()
                data: dict[str, Any] = resp.json()
                logger.debug("Wire %s returned %d items", action, len(data.get("results", [])))
                return data

        except httpx.TimeoutException:
            logger.error("Wire %s timed out after %ss", action, self.timeout)
            return {"action": action, "query": query, "error": "timeout", "results": []}

        except httpx.HTTPStatusError as e:
            logger.error("Wire %s HTTP %s: %s", action, e.response.status_code, e.response.text[:200])
            return {"action": action, "query": query, "error": f"http_{e.response.status_code}", "results": []}

        except Exception as e:
            logger.error("Wire %s failed: %s", action, str(e))
            return {"action": action, "query": query, "error": str(e), "results": []}

    async def search_all(self, query: str) -> list[dict[str, Any]]:
        tasks = [
            self._call_action(WIRE_ACTIONS["x"], query),
            self._call_action(WIRE_ACTIONS["reddit"], query),
            self._call_action(WIRE_ACTIONS["news"], query),
            self._call_action(WIRE_ACTIONS["web"], query),
        ]
        results = await asyncio.gather(*tasks)
        logger.info("Wire pipeline complete — %d sources queried", len(results))
        return results
