from models.schemas import ChatResponse, NormalizedData, SourceSummary
from services.llm_service import generate_intelligence
from services.wire_service import query_internet


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

    intelligence = await generate_intelligence(message, normalized)

    response = ChatResponse(
        query=message,
        sources=sources,
        data=data,
        intelligence=intelligence,
        raw_wire_response=raw if debug else None,
    )

    return response
