from models.schemas import ChatResponse, NormalizedData, SourceSummary
from services.wire_service import query_internet


def _build_debug_response(raw: list) -> ChatResponse:
    return ChatResponse(
        query="debug_pipeline",
        sources=[],
        data=NormalizedData(
            summary_context="Debug mode — raw Wire responses returned.",
            key_entities=[],
            trends=[],
            sources=[],
            results=[],
        ),
        raw_wire_response=raw,
    )


async def generate_reply(message: str, debug: bool = False) -> ChatResponse:
    result = await query_internet(message)
    normalized = result["normalized"]
    raw = result["raw"]

    sources = [
        SourceSummary(source=s["source"], error=s.get("error"), count=s["count"])
        for s in normalized["sources"]
    ]

    data = NormalizedData(
        summary_context=normalized["summary_context"],
        key_entities=normalized["key_entities"],
        trends=normalized["trends"],
        sources=sources,
        results=normalized["results"],
    )

    response = ChatResponse(
        query=message,
        sources=sources,
        data=data,
        raw_wire_response=raw if debug else None,
    )

    return response
