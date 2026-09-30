"""Cafe facts (hours, location, study space) from GET /info, plus the FAQ."""

import json
from datetime import datetime
from pathlib import Path

from app.services.backend_client import backend
from app.utils.text_utils import normalize

FAQ = json.loads((Path(__file__).resolve().parents[1] / "data" / "faq.json").read_text(encoding="utf-8"))


def format_time(value: str) -> str:
    """'22:00' -> '10 pm', '08:30' -> '8:30 am'"""
    hour, minute = (int(part) for part in value.split(":"))
    suffix = "pm" if hour >= 12 else "am"
    hour = hour % 12 or 12
    return f"{hour}:{minute:02d} {suffix}" if minute else f"{hour} {suffix}"


def _js_weekday(moment: datetime) -> int:
    """Python Monday=0 -> JavaScript Sunday=0, matching the backend's dayIndex."""
    return (moment.weekday() + 1) % 7


async def hours_text(now: datetime | None = None) -> str:
    info = await backend.get_info()
    now = now or datetime.now()
    today = next(h for h in info["hours"] if h["dayIndex"] == _js_weekday(now))
    minutes = now.hour * 60 + now.minute
    open_m = int(today["open"][:2]) * 60 + int(today["open"][3:])
    close_m = int(today["close"][:2]) * 60 + int(today["close"][3:])

    if open_m <= minutes < close_m:
        status = f"We are open right now, until {format_time(today['close'])}."
    elif minutes < open_m:
        status = f"We open today at {format_time(today['open'])}."
    else:
        status = "We are closed for today."

    weekday = [h for h in info["hours"] if h["dayIndex"] in range(1, 7)]
    sunday = next(h for h in info["hours"] if h["dayIndex"] == 0)
    return (
        f"{status} Our hours are {format_time(weekday[0]['open'])} to {format_time(weekday[0]['close'])} "
        f"Monday to Saturday, and {format_time(sunday['open'])} to {format_time(sunday['close'])} on Sunday."
    )


async def location_text() -> str:
    info = await backend.get_info()
    return (
        f"You can find us at {info['address']['full']}. Call {info['phone']} or email {info['email']}. "
        f"Directions: {info['mapUrl']}"
    )


async def study_text(topic: str = "") -> str:
    info = await backend.get_info()
    study = info["studySpace"]
    t = normalize(topic)
    if any(word in t for word in ("price", "pass", "cost", "how much", "fee", "pricing")):
        passes = "; ".join(f"{p['name']} ${p['price']:g}: {p['description']}" for p in study["passes"])
        return f"Our study passes: {passes}"
    if any(word in t for word in ("rule", "allowed", "can i", "policy", "call", "music", "food")):
        return "House rules: " + " ".join(study["rules"])
    zones = "; ".join(f"{z['name']} ({z['seats']} seats): {z['description']}" for z in study["zones"])
    amenities = " ".join(f"{a['title']}: {a['description']}" for a in info["amenities"])
    return f"We have three study zones. {zones}. {amenities}"


def search_faq(text: str) -> dict | None:
    t = normalize(text)
    best, best_hits = None, 0
    for entry in FAQ:
        hits = sum(1 for word in entry["keywords"] if word in t)
        if hits > best_hits:
            best, best_hits = entry, hits
    return best


async def get_info_topic(topic: str) -> str:
    """Single entry point for the LLM tool: hours, location, contact, study_space, passes, rules, amenities."""
    if topic == "hours":
        return await hours_text()
    if topic in ("location", "contact"):
        return await location_text()
    if topic == "passes":
        return await study_text("pass price")
    if topic == "rules":
        return await study_text("rules")
    return await study_text("")
