"""Availability checks and reservation creation through the Node API."""

from app.services.backend_client import BackendError, backend
from app.tools.info_tool import format_time


async def available_times(date: str, seat_type: str, guests: int = 1) -> list[str]:
    """Slot start times ('HH:MM') that still fit the party. Raises BackendError for invalid dates."""
    slots = await backend.get_availability(date, seat_type)
    return [slot["time"] for slot in slots if slot["remaining"] >= guests]


def nearest_times(times: list[str], wanted: str, count: int = 3) -> list[str]:
    def minutes(value: str) -> int:
        return int(value[:2]) * 60 + int(value[3:])

    target = minutes(wanted)
    return sorted(times, key=lambda t: abs(minutes(t) - target))[:count]


def readable_times(times: list[str]) -> str:
    labels = [format_time(t) for t in times]
    if len(labels) <= 1:
        return "".join(labels)
    return ", ".join(labels[:-1]) + " or " + labels[-1]


async def create(details: dict) -> dict:
    """Creates a pending reservation. Raises BackendError with field errors on failure."""
    return await backend.create_reservation(details)


__all__ = ["BackendError", "available_times", "nearest_times", "readable_times", "create"]
