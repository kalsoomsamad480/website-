"""A tiny async TTL cache so repeated questions do not refetch the menu every time."""

import time
from collections.abc import Awaitable, Callable
from typing import Any


class TTLCache:
    def __init__(self, ttl_seconds: float = 60):
        self.ttl = ttl_seconds
        self._store: dict[str, tuple[float, Any]] = {}

    async def get_or_load(self, key: str, loader: Callable[[], Awaitable[Any]]) -> Any:
        entry = self._store.get(key)
        if entry and time.monotonic() - entry[0] < self.ttl:
            return entry[1]
        value = await loader()
        self._store[key] = (time.monotonic(), value)
        return value

    def clear(self) -> None:
        self._store.clear()
