from fastapi import APIRouter

from models.chat import ChatRequest, ChatResponse
from services.chat_service import generate_reply

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest) -> ChatResponse:
    reply = await generate_reply(body.message)
    return ChatResponse(reply=reply)
