from fastapi import APIRouter, Path

from app.agents.cafe_agent import respond
from app.memory.session_memory import sessions
from app.schemas.chat_schema import ChatRequest, ChatResponse

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    session = sessions.get(request.session_id)
    result, mode = await respond(session, request.message.strip())
    return ChatResponse(
        reply=result["reply"],
        quick_replies=result.get("quick_replies") or [],
        action=result.get("action"),
        mode=mode,
    )


@router.delete("/chat/{session_id}", status_code=204)
async def clear_chat(session_id: str = Path(min_length=8, max_length=64, pattern=r"^[A-Za-z0-9_-]+$")) -> None:
    sessions.clear(session_id)
