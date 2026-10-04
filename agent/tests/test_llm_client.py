import asyncio
import json

import httpx

from app.core import llm_client
from app.core.llm_client import LLMClient, to_openai_messages, to_openai_tools

TOOLS = [
    {"name": "get_offers", "description": "Offers.", "input_schema": {"type": "object", "properties": {}}},
    {"name": "get_cafe_info", "description": "Info.", "input_schema": {"type": "object", "properties": {"topic": {"type": "string"}}}},
]


def test_tools_convert_and_drop_empty_schemas():
    tools = to_openai_tools(TOOLS)
    assert tools[0] == {"type": "function", "function": {"name": "get_offers", "description": "Offers."}}
    assert tools[1]["function"]["parameters"]["properties"]["topic"] == {"type": "string"}


def test_tool_round_trip_converts_messages():
    messages = [
        {"role": "user", "content": "hours?"},
        {"role": "assistant", "content": [{"type": "tool_use", "id": "c1", "name": "get_cafe_info", "input": {"topic": "hours"}}]},
        {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "c1", "content": "{\"open\": \"8am\"}"}]},
    ]
    out = to_openai_messages("sys", messages)
    assert out[0] == {"role": "system", "content": "sys"}
    assert out[2]["tool_calls"][0]["function"] == {"name": "get_cafe_info", "arguments": "{\"topic\": \"hours\"}"}
    assert out[3] == {"role": "tool", "tool_call_id": "c1", "content": "{\"open\": \"8am\"}"}


def test_openai_client_returns_anthropic_shaped_blocks(monkeypatch):
    monkeypatch.setattr(llm_client, "settings", llm_client.settings.__class__(
        **{**llm_client.settings.__dict__, "llm_api_key": "k", "llm_base_url": "https://example.test/v1", "llm_model": "m"}))
    seen = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["url"] = str(request.url)
        seen["auth"] = request.headers["authorization"]
        seen["body"] = json.loads(request.content)
        call = {"id": "", "type": "function", "function": {"name": "get_cafe_info", "arguments": "{\"topic\": \"hours\"}"}}
        return httpx.Response(200, json={"choices": [{"message": {"content": None, "tool_calls": [call]}, "finish_reason": "tool_calls"}]})

    client = LLMClient(transport=httpx.MockTransport(handler))
    response = asyncio.run(client.create("sys", [{"role": "user", "content": "hours?"}], TOOLS))

    assert seen["url"] == "https://example.test/v1/chat/completions"
    assert seen["auth"] == "Bearer k" and seen["body"]["model"] == "m"
    assert response.stop_reason == "tool_use"
    block = response.content[0]
    assert block.type == "tool_use" and block.name == "get_cafe_info" and block.input == {"topic": "hours"} and block.id
