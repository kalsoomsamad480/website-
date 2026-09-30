"""Test fixtures: a fake backend so tests run offline and never touch the real database."""

import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.memory.session_memory import sessions  # noqa: E402
from app.services import backend_client  # noqa: E402
from app.services.backend_client import BackendError  # noqa: E402


def _item(name, price, category, tags, description, ingredients, available=True):
    slug = name.lower().replace(" ", "-")
    return {
        "_id": slug, "name": name, "slug": slug, "price": price, "tags": tags, "isAvailable": available,
        "description": description, "ingredients": ingredients, "calories": 120, "image": f"/images/menu/{slug}.webp",
        "category": {"slug": category, "name": category.replace("-", " ").title()},
    }


MENU = [
    _item("Flat White", 4.5, "coffee", ["veg", "popular", "strong"], "Double ristretto with silky milk.", ["Double ristretto", "Whole milk"]),
    _item("Cardamom Latte", 5.2, "coffee", ["veg", "popular", "sweet"], "Espresso with cardamom syrup.", ["Espresso", "Milk", "Cardamom syrup"]),
    _item("Cold Brew", 4.8, "cold-drinks", ["veg", "strong", "iced"], "Steeped for 18 hours.", ["Cold brew coffee", "Ice"]),
    _item("Espresso Tonic", 5.2, "cold-drinks", ["veg", "strong", "iced", "new"], "Espresso over tonic.", ["Espresso", "Tonic water"]),
    _item("Iced Spanish Latte", 5.6, "cold-drinks", ["veg", "popular", "sweet", "iced"], "With condensed milk.", ["Espresso", "Condensed milk"]),
    _item("Mango Passion Cooler", 4.9, "cold-drinks", ["veg", "sweet", "iced"], "Mango and passion fruit.", ["Mango", "Soda water"]),
    _item("Hibiscus Lemonade", 4.2, "cold-drinks", ["veg", "iced"], "Tart hibiscus tea.", ["Hibiscus tea", "Lemon"]),
    _item("Basque Cheesecake", 5.8, "desserts", ["veg", "popular", "sweet"], "Burnt-top cheesecake.", ["Cream cheese", "Eggs"]),
    _item("Chicken Tikka Rice Bowl", 11.5, "meals", ["popular"], "Charred tikka chicken.", ["Chicken tikka", "Rice"]),
    _item("Pistachio Kunafa", 6.5, "desserts", ["veg", "sweet", "new"], "Kataifi with pistachio.", ["Kataifi", "Pistachio"], available=False),
]
INFO = json.loads((ROOT / "app" / "data" / "cafe_info.json").read_text(encoding="utf-8"))
OFFERS = [{"title": "Afternoon Cold Brew Hour", "discountText": "20% off", "description": "All cold drinks 20% off.", "validTill": "2030-01-15T00:00:00.000Z"}]
ALL_SLOTS = [f"{h:02d}:{m:02d}" for h in range(8, 22) for m in (0, 30)]
FULL_SLOT = "12:00"


class FakeBackend:
    def __init__(self):
        self.created: list[dict] = []

    async def get_menu(self):
        return MENU

    async def get_info(self):
        return INFO

    async def get_offers(self):
        return OFFERS

    async def get_availability(self, date, seat_type):
        if date < "2000-01-01":
            raise BackendError("Choose a valid date.", 422, [{"field": "date", "message": "Choose a valid date."}])
        capacity = 24 if seat_type == "table" else 30
        return [{"time": t, "remaining": 0 if t == FULL_SLOT else capacity, "available": t != FULL_SLOT} for t in ALL_SLOTS]

    async def create_reservation(self, details):
        reservation = {**details, "source": "agent", "status": "pending", "_id": "r1"}
        self.created.append(reservation)
        return reservation

    async def is_healthy(self):
        return True

    async def close(self):
        return None


@pytest.fixture
def fake_backend(monkeypatch):
    fake = FakeBackend()
    for name in ("get_menu", "get_info", "get_offers", "get_availability", "create_reservation", "is_healthy", "close"):
        monkeypatch.setattr(backend_client.backend, name, getattr(fake, name))
    sessions._sessions.clear()
    yield fake
    sessions._sessions.clear()
