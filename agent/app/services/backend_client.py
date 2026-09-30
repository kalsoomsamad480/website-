"""HTTP client for the Node API. The agent only reads public data and creates reservations."""

import json
from pathlib import Path
from typing import Any

import httpx

from app.core.config import settings
from app.services.cache import TTLCache
from app.utils.logger import get_logger

log = get_logger(__name__)
FALLBACK_INFO = Path(__file__).resolve().parents[1] / "data" / "cafe_info.json"


class BackendError(Exception):
    """A failed backend call, with the API's friendly message and any field errors."""

    def __init__(self, message: str, status: int | None = None, field_errors: list | None = None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.field_errors = field_errors or []


class BackendClient:
    def __init__(self, base_url: str = settings.backend_url, transport: httpx.AsyncBaseTransport | None = None):
        # The shared secret lets the backend trust bookings made through the assistant
        headers = {"X-Agent-Key": settings.agent_secret} if settings.agent_secret else {}
        self._client = httpx.AsyncClient(base_url=base_url, timeout=10, transport=transport, headers=headers)
        self._cache = TTLCache(ttl_seconds=60)

    async def close(self) -> None:
        await self._client.aclose()

    async def _request(self, method: str, path: str, **kwargs) -> Any:
        try:
            response = await self._client.request(method, path, **kwargs)
        except httpx.HTTPError as error:
            log.warning("Backend unreachable: %s %s (%s)", method, path, error)
            raise BackendError("The cafe system is not reachable right now.") from error

        body = response.json() if response.content else {}
        if response.status_code >= 400:
            raise BackendError(
                body.get("message", "The cafe system returned an error."),
                status=response.status_code,
                field_errors=body.get("errors"),
            )
        return body.get("data")

    async def get_menu(self) -> list[dict]:
        return await self._cache.get_or_load("menu", lambda: self._request("GET", "/menu"))

    async def get_offers(self) -> list[dict]:
        return await self._cache.get_or_load("offers", lambda: self._request("GET", "/offers"))

    async def get_info(self) -> dict:
        async def load() -> dict:
            try:
                return await self._request("GET", "/info")
            except BackendError:
                # Static copy keeps hours and location answerable if the API is down
                return json.loads(FALLBACK_INFO.read_text(encoding="utf-8"))

        return await self._cache.get_or_load("info", load)

    async def get_availability(self, date: str, seat_type: str) -> list[dict]:
        return await self._request("GET", "/reservations/availability", params={"date": date, "seatType": seat_type})

    async def create_reservation(self, details: dict) -> dict:
        return await self._request("POST", "/reservations", json=details)

    async def is_healthy(self) -> bool:
        try:
            await self._request("GET", "/health")
            return True
        except BackendError:
            return False


backend = BackendClient()
