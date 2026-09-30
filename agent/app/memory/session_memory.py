"""In-memory chat sessions: last N turns plus booking state, expiring after inactivity."""

import time
from dataclasses import dataclass, field

from app.core.config import settings


@dataclass
class Session:
    history: list[dict] = field(default_factory=list)  # [{"role": "user"|"assistant", "content": str}]
    booking: dict | None = None  # reservation draft while booking
    pending_confirmation: dict | None = None  # draft awaiting the user's "yes"
    prepared_at_turn: int | None = None  # user turn when the draft was shown (LLM mode)
    user_turns: int = 0  # monotonic count of user messages (history itself is trimmed)
    updated_at: float = field(default_factory=time.monotonic)

    def add_turn(self, role: str, content: str) -> None:
        self.history.append({"role": role, "content": content})
        if role == "user":
            self.user_turns += 1
        # A turn is a user message plus the reply
        limit = settings.max_history_turns * 2
        if len(self.history) > limit:
            self.history = self.history[-limit:]
        self.updated_at = time.monotonic()

    def last_user_message(self) -> str:
        for message in reversed(self.history):
            if message["role"] == "user":
                return message["content"]
        return ""


class SessionStore:
    def __init__(self, ttl_minutes: int = settings.session_ttl_minutes):
        self.ttl_seconds = ttl_minutes * 60
        self._sessions: dict[str, Session] = {}

    def _prune(self) -> None:
        now = time.monotonic()
        expired = [key for key, s in self._sessions.items() if now - s.updated_at > self.ttl_seconds]
        for key in expired:
            del self._sessions[key]

    def get(self, session_id: str) -> Session:
        self._prune()
        session = self._sessions.get(session_id)
        if session is None:
            session = self._sessions[session_id] = Session()
        return session

    def clear(self, session_id: str) -> None:
        self._sessions.pop(session_id, None)

    def __len__(self) -> int:
        return len(self._sessions)


sessions = SessionStore()
