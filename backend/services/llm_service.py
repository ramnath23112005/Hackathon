import json
from typing import Any

from openai import AsyncOpenAI

from core.config import settings
from core.logger import setup_logger
from models.schemas import IntelligenceReport

logger = setup_logger("llm_service")

SYSTEM_PROMPT = (
    "You are an intelligence analyst, not a chatbot.\n\n"
    "Analyze the provided structured internet data and produce a concise intelligence report.\n\n"
    "RULES:\n"
    "1. ONLY use the data provided. Do NOT add external knowledge or hallucinate.\n"
    "2. If data is insufficient, use \"insufficient data\" in the relevant fields.\n"
    "3. Be analytical — explain what the data means, not what it literally says.\n"
    "4. Be concise. Every word must carry signal. No filler, no greetings, no meta-commentary.\n"
    "5. Return ONLY valid JSON. No markdown, no code blocks, no explanation.\n\n"
    "OUTPUT FORMAT (strict JSON):\n"
    '{\n'
    '  "summary": "2-4 line analytical summary of what is happening",\n'
    '  "key_trends": ["trend1", "trend2", "trend3"],\n'
    '  "insights": ["insight1", "insight2"],\n'
    '  "opportunities": ["opportunity1", "opportunity2"],\n'
    '  "risk_signals": ["risk1", "risk2"],\n'
    '  "source_attribution": ["source1", "source2"]\n'
    '}'
)

FALLBACK_REPORT = IntelligenceReport(
    summary="Analysis unavailable due to LLM service error.",
    key_trends=["insufficient data"],
    insights=["insufficient data"],
    opportunities=["insufficient data"],
    risk_signals=["insufficient data"],
    source_attribution=["insufficient data"],
)


def _compress_results(results: list[dict[str, Any]], max_items: int = 12) -> list[dict[str, str]]:
    compressed = []
    seen_sources: set[str] = set()
    for r in results:
        source = r.get("source", "unknown")
        title = (r.get("title") or "")[:120]
        text = (r.get("text") or "")[:300]
        compressed.append({"source": source, "title": title, "snippet": text})
        seen_sources.add(source)
        if len(compressed) >= max_items:
            break
    return compressed


def _build_prompt(query: str, wire_data: dict[str, Any]) -> str:
    sources_summary = wire_data.get("sources", [])
    entities = wire_data.get("key_entities", [])
    trends = wire_data.get("trends", [])
    context = (wire_data.get("summary_context") or "")[:1500]
    results = _compress_results(wire_data.get("results", []))

    parts = [f"User Query: {query}"]
    parts.append(f"\nSummary Context: {context}")
    if entities:
        parts.append(f"\nKey Entities: {', '.join(entities[:12])}")
    if trends:
        parts.append(f"\nTrends: {', '.join(trends[:8])}")
    if sources_summary:
        active = [s for s in sources_summary if not s.get("error") and s.get("count", 0) > 0]
        if active:
            labels = [f"{s['source']}({s['count']})" for s in active]
            parts.append(f"\nSources: {', '.join(labels)}")
    if results:
        rows = []
        for r in results:
            rows.append(f"[{r['source']}] {r['title']} — {r['snippet']}")
        parts.append("\nResults:\n" + "\n".join(rows))

    return "\n".join(parts)


async def _call_llm(prompt: str) -> str | None:
    if not settings.openai_api_key:
        logger.warning("No OpenAI API key configured")
        return None

    client = AsyncOpenAI(
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
        timeout=settings.openai_timeout,
        max_retries=settings.openai_max_retries,
    )

    try:
        resp = await client.chat.completions.create(
            model=settings.openai_model,
            temperature=settings.openai_temperature,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
        )
        content = resp.choices[0].message.content
        if content:
            return content.strip()
        logger.warning("LLM returned empty content")
        return None
    except Exception as e:
        logger.error("LLM call failed: %s", str(e))
        return None


def _parse_response(raw: str) -> IntelligenceReport | None:
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:].strip()
    try:
        data = json.loads(text)
        return IntelligenceReport(
            summary=str(data.get("summary", "insufficient data")),
            key_trends=list(data.get("key_trends", [])),
            insights=list(data.get("insights", [])),
            opportunities=list(data.get("opportunities", [])),
            risk_signals=list(data.get("risk_signals", [])),
            source_attribution=list(data.get("source_attribution", [])),
        )
    except (json.JSONDecodeError, TypeError, ValueError) as e:
        logger.error("Failed to parse LLM response as JSON: %s", str(e))
        return None


async def generate_intelligence(query: str, wire_data: dict[str, Any]) -> IntelligenceReport:
    if not settings.llm_enabled:
        logger.info("LLM disabled via config, returning fallback")
        return FALLBACK_REPORT

    prompt = _build_prompt(query, wire_data)
    logger.info("LLM prompt built — %d chars", len(prompt))

    raw = await _call_llm(prompt)
    if not raw:
        logger.warning("LLM returned no content, using fallback")
        return FALLBACK_REPORT

    report = _parse_response(raw)
    if not report:
        logger.warning("LLM response unparseable, using fallback")
        return FALLBACK_REPORT

    return report
