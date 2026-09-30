"""Settings loaded from agent/.env (see .env.example)."""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


@dataclass(frozen=True)
class Settings:
    llm_api_key: str
    llm_model: str
    backend_url: str
    agent_secret: str
    session_ttl_minutes: int
    max_history_turns: int

    @property
    def llm_enabled(self) -> bool:
        return bool(self.llm_api_key)


def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except ValueError:
        return default


settings = Settings(
    llm_api_key=os.getenv("LLM_API_KEY", "").strip(),
    llm_model=os.getenv("LLM_MODEL", "claude-sonnet-5-5").strip(),
    backend_url=os.getenv("BACKEND_URL", "http://localhost:5000/api/v1").rstrip("/"),
    agent_secret=os.getenv("AGENT_SECRET", "").strip(),
    session_ttl_minutes=_int("SESSION_TTL_MINUTES", 30),
    max_history_turns=_int("MAX_HISTORY_TURNS", 10),
)
