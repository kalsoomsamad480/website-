from typing import Any, Literal

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=8, max_length=64, pattern=r"^[A-Za-z0-9_-]+$")
    message: str = Field(min_length=1, max_length=500)


class ChatResponse(BaseModel):
    reply: str
    quick_replies: list[str] = Field(default_factory=list)
    # Optional structured extra for the UI, e.g. {"type": "menu_items", "items": [...]}
    action: dict[str, Any] | None = None
    mode: Literal["llm", "rules"]
