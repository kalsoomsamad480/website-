from fastapi import APIRouter

from app.core.config import settings
from app.core.llm_client import llm
from app.memory.session_memory import sessions
from app.services.backend_client import backend

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    return {
        "status": "ok",
        "mode": "llm" if llm.enabled else "rules",
        "model": settings.llm_model if llm.enabled else None,
        "backend": "reachable" if await backend.is_healthy() else "unreachable",
        "active_sessions": len(sessions),
    }
