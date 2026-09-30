"""Menu lookups over live backend data. Nothing here invents items: every result comes from GET /menu."""

import re

from app.services.backend_client import backend
from app.utils.text_utils import normalize, similarity

CATEGORY_WORDS = {
    "coffee": ["coffee", "coffees", "espresso drinks", "hot drinks", "latte", "lattes"],
    "cold-drinks": ["cold drink", "cold drinks", "iced drinks", "cold", "juice", "lemonade", "cooler", "refreshing"],
    "bakery": ["bakery", "pastry", "pastries", "baked", "bread", "croissant", "croissants", "buns"],
    "snacks": ["snack", "snacks", "small plate", "bite", "nibble", "side"],
    "meals": ["meal", "meals", "lunch", "dinner", "main", "hungry", "food", "eat"],
    "desserts": ["dessert", "desserts", "cake", "cakes", "sweet treat", "sweets"],
}


def format_price(value: float) -> str:
    return f"${value:.2f}"


def item_card(item: dict) -> dict:
    """The small shape the chat UI renders as a tappable item."""
    return {"name": item["name"], "slug": item["slug"], "price": item["price"], "image": item.get("image", "")}


def describe(item: dict, detail: bool = False) -> str:
    line = f"{item['name']} ({format_price(item['price'])}): {item['description']}"
    if not item.get("isAvailable", True):
        line += " It is sold out today."
    if detail:
        extras = []
        if item.get("ingredients"):
            extras.append("Made with " + ", ".join(i.lower() for i in item["ingredients"]) + ".")
        if item.get("calories") is not None:
            extras.append(f"About {item['calories']} calories.")
        if "veg" in item.get("tags", []):
            extras.append("It is vegetarian.")
        line += " " + " ".join(extras)
    return line.strip()


def detect_category(text: str) -> str | None:
    t = normalize(text)
    for slug, words in CATEGORY_WORDS.items():
        if any(re.search(rf"\b{re.escape(word)}\b", t) for word in words):
            return slug
    return None


async def find_items(text: str, limit: int = 3) -> list[dict]:
    """Menu items mentioned in the text, best match first (tolerates small typos)."""
    menu = await backend.get_menu()
    t = normalize(text)
    scored = []
    for item in menu:
        name = item["name"].lower()
        if name in t:
            scored.append((2.0 + len(name) / 100, item))
            continue
        words = [w for w in re.findall(r"[a-z]+", name) if len(w) > 3]
        tokens = re.findall(r"[a-z]+", t)
        hits = sum(1 for w in words if any(similarity(w, tok) > 0.84 for tok in tokens))
        if words and hits:
            score = hits / len(words)
            if score >= 0.5:
                scored.append((score, item))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    # A full-name mention beats partial word matches ("cardamom latte" should not also return the bun)
    exact = [item for score, item in scored if score >= 2]
    return exact[:limit] if exact else [item for _, item in scored[:limit]]


async def search_menu(query: str = "", category: str | None = None, tags: list[str] | None = None,
                      max_price: float | None = None, limit: int = 8) -> list[dict]:
    """Structured search used by the LLM tool."""
    menu = await backend.get_menu()
    q = normalize(query)
    results = []
    for item in menu:
        if category and item.get("category", {}).get("slug") != category:
            continue
        if tags and not all(tag in item.get("tags", []) for tag in tags):
            continue
        if max_price is not None and item["price"] > max_price:
            continue
        if q:
            haystack = " ".join([item["name"], item["description"], *item.get("ingredients", [])]).lower()
            if not all(word in haystack for word in q.split()):
                continue
        results.append(item)
    return results[:limit]


async def items_in_category(slug: str) -> list[dict]:
    menu = await backend.get_menu()
    return [item for item in menu if item.get("category", {}).get("slug") == slug]


async def known_prices() -> set[float]:
    menu = await backend.get_menu()
    return {round(item["price"], 2) for item in menu}
