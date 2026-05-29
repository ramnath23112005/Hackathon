from fastapi import APIRouter

from core.config import settings
from models.schemas import ChatRequest, ChatResponse
from services.chat_service import generate_reply

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest) -> ChatResponse:
    return await generate_reply(body.message, debug=settings.debug)
