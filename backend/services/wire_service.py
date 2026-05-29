from typing import Any

from core.logger import setup_logger
from core.wire_client import search_all

logger = setup_logger("wire_service")


def _extract_entities(texts: list[str]) -> list[str]:
    entities: set[str] = set()
    prefixes = ("@", "#", "https://", "http://")
    for text in texts:
        for word in text.split():
            if any(word.startswith(p) for p in prefixes):
                entities.add(word.strip(",:;.!?"))
    return sorted(entities)


def _normalize_source(action_id: str) -> str:
    mapping = {
        "rt_search": "Reddit",
        "gn_search": "Google News",
        "web_search": "Web",
        "reddit": "Reddit",
        "news": "News",
        "web": "Web",
    }
    return mapping.get(action_id, action_id)


def normalize_wire_response(raw: list[dict[str, Any]]) -> dict[str, Any]:
    all_texts: list[str] = []
    sources: list[dict[str, Any]] = []
    all_results: list[dict[str, Any]] = []

    for source_data in raw:
        source_name = _normalize_source(source_data.get("action", "unknown"))
        error = source_data.get("error")

        entry: dict[str, Any] = {"source": source_name, "error": error, "count": 0}
        results_raw = source_data.get("results", source_data.get("data", {}))

        if isinstance(results_raw, dict):
            items = results_raw.get("results", results_raw.get("items", []))
        elif isinstance(results_raw, list):
            items = results_raw
        else:
            items = []

        if items and not error:
            entry["count"] = len(items)
            for r in items:
                text = r.get("text", r.get("content", r.get("title", "")))
                if text:
                    all_texts.append(text)
                    all_results.append({
                        "source": source_name,
                        "title": r.get("title", ""),
                        "text": text[:500],
                        "url": r.get("url", r.get("link", "")),
                        "author": r.get("author", r.get("user", "")),
                        "date": r.get("date", r.get("created_at", "")),
                    })
        else:
            entry["count"] = 0

        sources.append(entry)

    summary = ". ".join(all_texts[:5])[:1000] if all_texts else "No results found."
    entities = _extract_entities(all_texts[:20])

    return {
        "summary_context": summary,
        "key_entities": entities[:15],
        "trends": [t for t in entities if t.startswith("#")][:8],
        "sources": sources,
        "results": all_results[:30],
    }


async def query_internet(user_query: str) -> dict[str, Any]:
    logger.info("Querying internet: %s", user_query)
    raw_responses = await search_all(user_query)
    normalized = normalize_wire_response(raw_responses)
    logger.info(
        "Normalized: %d results across %d sources",
        len(normalized.get("results", [])),
        len(normalized.get("sources", [])),
    )
    return {"normalized": normalized, "raw": raw_responses}
