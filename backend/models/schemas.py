from typing import Any

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class SourceSummary(BaseModel):
    source: str
    error: str | None = None
    count: int = 0


class NormalizedData(BaseModel):
    summary_context: str
    key_entities: list[str]
    trends: list[str]
    sources: list[SourceSummary]
    results: list[dict[str, Any]]


class ChatResponse(BaseModel):
    query: str
    sources: list[SourceSummary]
    data: NormalizedData
    raw_wire_response: list[dict[str, Any]] | None = None
