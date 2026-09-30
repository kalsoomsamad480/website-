"""Recommendations from mood or preference, e.g. 'something strong and not sweet'."""

import re

from app.services.backend_client import backend
from app.tools.menu_tool import detect_category, format_price, item_card
from app.utils.text_utils import normalize

CAFFEINE_WORDS = ("espresso", "coffee", "matcha", "brew", "ristretto")
DRINK_CATEGORIES = {"coffee", "cold-drinks"}


def parse_preferences(text: str) -> dict:
    t = normalize(text)
    prefs: dict = {"want": set(), "avoid": set(), "category": detect_category(t), "max_price": None, "caffeine": None}

    # Negations first so "not sweet" never counts as wanting sweet
    for tag, pattern in {
        "sweet": r"\b(not|no|less|without|isn'?t|nothing)\s+(too\s+)?sweet|\bno sugar|\bsugar[- ]free|\bbitter\b",
        "strong": r"\b(not|no|nothing)\s+(too\s+)?strong|\b(mild|light|gentle|smooth)\b",
        "iced": r"\b(hot|warm|not cold|not iced)\b",
    }.items():
        if re.search(pattern, t):
            prefs["avoid"].add(tag)

    for tag, pattern in {
        "strong": r"\b(strong|bold|intense|kick|wake me up|energy|caffeine|awake|tired|sleepy)\b",
        "sweet": r"\b(sweet|treat|indulgent|dessert-?like|sugary|craving something sweet)\b",
        "iced": r"\b(iced|cold|chilled|refreshing|hot day|summer)\b",
        "veg": r"\b(veg|vegetarian|meat[- ]free|no meat)\b",
        "new": r"\b(new|something different|surprise me|adventurous)\b",
    }.items():
        if tag not in prefs["avoid"] and re.search(pattern, t):
            prefs["want"].add(tag)

    if re.search(r"\b(no|without|free of|avoid)\s+caffeine|\bcaffeine[- ]free|\bdecaf\b", t):
        prefs["caffeine"] = False
        prefs["want"].discard("strong")

    budget = re.search(r"\b(?:under|below|less than|max|up to)\s*\$?\s*(\d+(?:\.\d+)?)", t)
    if budget:
        prefs["max_price"] = float(budget.group(1))
    elif re.search(r"\b(cheap|budget|affordable|inexpensive)\b", t):
        prefs["max_price"] = 5.0

    if prefs["category"] is None and prefs["want"] & {"strong", "iced"} and not re.search(r"\b(eat|food|meal)\b", t):
        prefs["category"] = "drinks"
    return prefs


def _has_caffeine(item: dict) -> bool:
    text = " ".join([item["name"], *item.get("ingredients", [])]).lower()
    return any(word in text for word in CAFFEINE_WORDS)


def score(item: dict, prefs: dict) -> float | None:
    """Higher is better; None means the item is excluded."""
    tags = set(item.get("tags", []))
    category = item.get("category", {}).get("slug")
    if not item.get("isAvailable", True):
        return None
    if prefs["category"] == "drinks" and category not in DRINK_CATEGORIES:
        return None
    if prefs["category"] not in (None, "drinks") and category != prefs["category"]:
        return None
    if prefs["avoid"] & tags:
        return None
    if prefs["max_price"] is not None and item["price"] > prefs["max_price"]:
        return None
    if prefs["caffeine"] is False and _has_caffeine(item):
        return None
    if "veg" in prefs["want"] and "veg" not in tags:
        return None

    value = 3.0 * len(prefs["want"] & tags)
    if "popular" in tags:
        value += 1.0
    return value


async def recommend(text: str, limit: int = 3) -> tuple[str, list[dict]]:
    """Returns a friendly reply and the recommended items (all real menu items)."""
    menu = await backend.get_menu()
    prefs = parse_preferences(text)
    ranked = sorted(
        ((s, item) for item in menu if (s := score(item, prefs)) is not None),
        key=lambda pair: pair[0],
        reverse=True,
    )
    picks = [item for _, item in ranked[:limit]]

    if not picks:
        return (
            "I could not find anything on the menu that matches all of that. "
            "Try loosening one preference, or browse the full menu.",
            [],
        )

    intro = "Here is what I would suggest:"
    if prefs["want"] or prefs["avoid"]:
        liked = ", ".join(sorted(prefs["want"])) or "your taste"
        intro = f"Going by {liked}" + (f" and nothing {', '.join(sorted(prefs['avoid']))}" if prefs["avoid"] else "") + ", try:"
    lines = [f"- {item['name']} ({format_price(item['price'])}): {item['description']}" for item in picks]
    return intro + "\n" + "\n".join(lines), [item_card(item) for item in picks]
