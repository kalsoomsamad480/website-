"""Thin wrapper around the Anthropic Messages API. Only used when LLM_API_KEY is set."""

from typing import Any

from app.core.config import settings
from app.utils.logger import get_logger

log = get_logger(__name__)


class LLMUnavailable(Exception):
    """Raised when the LLM is not configured or the API call fails."""


class LLMClient:
    def __init__(self) -> None:
        self._client = None
        if settings.llm_enabled:
            from anthropic import AsyncAnthropic  # imported lazily so rules mode needs no API key

            self._client = AsyncAnthropic(api_key=settings.llm_api_key, timeout=30, max_retries=2)

    @property
    def enabled(self) -> bool:
        return self._client is not None

    async def create(self, system: str, messages: list[dict], tools: list[dict]) -> Any:
        if not self._client:
            raise LLMUnavailable("No LLM API key configured.")
        try:
            return await self._client.messages.create(
                model=settings.llm_model,
                max_tokens=700,
                # The system prompt is identical across turns, so cache it
                system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
                tools=tools,
                messages=messages,
            )
        except Exception as error:  # network, auth, rate limit, overload
            log.warning("LLM call failed: %s", error)
            raise LLMUnavailable(str(error)) from error


llm = LLMClient()
