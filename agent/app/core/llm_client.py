"""Thin LLM wrapper. Only used when LLM_API_KEY is set.

Speaks the Anthropic Messages API by default. When LLM_BASE_URL is set it talks to any
OpenAI-compatible endpoint instead (free tiers: Google Gemini, Groq), converting requests and
responses so the agent always sees Anthropic-shaped data.
"""

import json
import uuid
from types import SimpleNamespace
from typing import Any

import httpx

from app.core.config import settings
from app.utils.logger import get_logger

log = get_logger(__name__)


class LLMUnavailable(Exception):
    """Raised when the LLM is not configured or the API call fails."""


# ------------------------------------------------------------------ OpenAI-compatible conversion


def to_openai_tools(tools: list[dict]) -> list[dict]:
    converted = []
    for tool in tools:
        function = {"name": tool["name"], "description": tool.get("description", "")}
        schema = tool.get("input_schema") or {}
        if schema.get("properties"):  # some providers reject an empty properties object
            function["parameters"] = schema
        converted.append({"type": "function", "function": function})
    return converted


def to_openai_messages(system: str, messages: list[dict]) -> list[dict]:
    converted = [{"role": "system", "content": system}]
    for message in messages:
        content = message["content"]
        if isinstance(content, str):
            converted.append({"role": message["role"], "content": content})
            continue
        if message["role"] == "assistant":
            text = "".join(b.get("text", "") for b in content if b["type"] == "text")
            calls = [
                {"id": b["id"], "type": "function", "function": {"name": b["name"], "arguments": json.dumps(b["input"] or {})}}
                for b in content
                if b["type"] == "tool_use"
            ]
            entry: dict = {"role": "assistant", "content": text or None}
            if calls:
                entry["tool_calls"] = calls
            converted.append(entry)
            continue
        for block in content:
            if block["type"] == "tool_result":
                converted.append({"role": "tool", "tool_call_id": block["tool_use_id"], "content": block["content"]})
            elif block["type"] == "text":
                converted.append({"role": "user", "content": block["text"]})
    return converted


def from_openai_response(data: dict) -> SimpleNamespace:
    message = data["choices"][0]["message"]
    blocks = []
    if message.get("content"):
        blocks.append(SimpleNamespace(type="text", text=message["content"]))
    for call in message.get("tool_calls") or []:
        try:
            args = json.loads(call["function"].get("arguments") or "{}")
        except json.JSONDecodeError:
            args = {}
        blocks.append(
            SimpleNamespace(
                type="tool_use",
                id=call.get("id") or f"call_{uuid.uuid4().hex[:12]}",
                name=call["function"]["name"],
                input=args,
            )
        )
    has_tools = any(b.type == "tool_use" for b in blocks)
    return SimpleNamespace(stop_reason="tool_use" if has_tools else "end_turn", content=blocks)


# ------------------------------------------------------------------ client


class LLMClient:
    def __init__(self, transport: httpx.AsyncBaseTransport | None = None) -> None:
        self._client = None
        self._http = None
        if not settings.llm_enabled:
            return
        if settings.llm_base_url:
            self._http = httpx.AsyncClient(
                base_url=settings.llm_base_url,
                timeout=30,
                transport=transport,
                headers={"Authorization": f"Bearer {settings.llm_api_key}"},
            )
        else:
            from anthropic import AsyncAnthropic  # imported lazily so rules mode needs no API key

            self._client = AsyncAnthropic(api_key=settings.llm_api_key, timeout=30, max_retries=2)

    @property
    def enabled(self) -> bool:
        return self._client is not None or self._http is not None

    async def create(self, system: str, messages: list[dict], tools: list[dict]) -> Any:
        if not self.enabled:
            raise LLMUnavailable("No LLM API key configured.")
        try:
            if self._http:
                return await self._create_openai(system, messages, tools)
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

    async def _create_openai(self, system: str, messages: list[dict], tools: list[dict]) -> SimpleNamespace:
        response = await self._http.post(
            "/chat/completions",
            json={
                "model": settings.llm_model,
                "max_tokens": 700,
                "messages": to_openai_messages(system, messages),
                "tools": to_openai_tools(tools),
            },
        )
        response.raise_for_status()
        return from_openai_response(response.json())


llm = LLMClient()
