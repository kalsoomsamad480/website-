"""Main orchestration: routes a message to LLM mode (with tools) or rules mode, and keeps replies grounded."""

import json
import re
from datetime import datetime

from app.agents import menu_agent, reservation_agent
from app.core.llm_client import LLMUnavailable, llm
from app.core.prompts import SYSTEM_PROMPT
from app.memory.session_memory import Session
from app.schemas.reservation_schema import ReservationDraft
from app.services.backend_client import BackendError, backend
from app.tools import info_tool, menu_tool, offer_tool, reservation_tool
from app.utils import text_utils as tu
from app.utils.logger import get_logger

log = get_logger(__name__)

DEFAULT_QUICK_REPLIES = ["Recommend a coffee", "Opening hours", "Today's offers", "Book a table"]
FALLBACK_REPLY = (
    "I am not sure about that one. For anything I cannot answer, the team is happy to help at "
    "hello@alladin.cafe or +00 123 456 789."
)


def _has(text: str, *patterns: str) -> bool:
    return any(re.search(pattern, text) for pattern in patterns)


# ---------------------------------------------------------------- rules mode


async def rules_reply(session: Session, message: str) -> dict:
    t = tu.normalize(message)

    if session.booking is not None or session.pending_confirmation:
        return await reservation_agent.handle(session, message)

    if _has(t, r"^(hi|hello|hey|salam|assalam|good (morning|afternoon|evening))\b") and len(t.split()) <= 4:
        return {"reply": "Hi, welcome to Alladin Cafe! I can help with the menu, recommendations, hours, "
                         "offers, the study space, or booking a seat.", "quick_replies": DEFAULT_QUICK_REPLIES}

    if _has(t, r"\b(thanks|thank you|thx|cheers)\b") and len(t.split()) <= 5:
        return {"reply": "You are welcome! Enjoy your visit.", "quick_replies": []}

    if _has(t, r"\b(book|reserve|reservation|booking)\b", r"\btable for\b", r"\bsave (me )?a (seat|table|desk)\b"):
        session.booking = {}
        return await reservation_agent.handle(session, message)

    if _has(t, r"\b(open|close|closing|opening|hours|timing|timings)\b", r"\bwhat time\b"):
        return {"reply": await info_tool.hours_text(), "quick_replies": ["Where are you?", "Book a table"]}

    if _has(t, r"\b(where|address|location|located|directions|find you|phone|call|email|contact)\b"):
        return {"reply": await info_tool.location_text(), "quick_replies": ["Opening hours"],
                "action": {"type": "link", "label": "Contact page", "href": "/contact"}}

    if _has(t, r"\b(offer|offers|deal|deals|discount|promo|special|specials)\b"):
        return {"reply": await offer_tool.offers_text(), "quick_replies": ["Recommend a coffee", "Book a table"]}

    # Policy questions (Wi-Fi, parking, pets, allergies...) are answered from the FAQ
    faq = info_tool.search_faq(t)
    if faq and _has(t, r"wi-?fi|password|parking|\bpets?\b|\bdogs?\b|\bkids?\b|child|payment|\bpay\b|deliver|"
                       r"wheelchair|accessib|gluten|allerg|\bnuts?\b|event|workshop|oat milk|almond|\bsoy\b|vegan|dairy|lactose"):
        return {"reply": faq["answer"], "quick_replies": DEFAULT_QUICK_REPLIES[:2]}

    if _has(t, r"\b(study|studying|quiet|pass|passes|desk|socket|sockets|plug|charge|laptop|work from|rules)\b"):
        return {"reply": await info_tool.study_text(t), "quick_replies": ["Study space passes", "Book a study desk"],
                "action": {"type": "link", "label": "Study space", "href": "/study-space"}}

    if _has(t, r"\b(recommend|suggest|suggestion|should i (get|try|order)|what'?s good|craving|in the mood|"
               r"something|surprise me|best|popular|favorite|favourite)\b"):
        reply, items = await menu_agent.recommend(message)
        return {"reply": reply, "quick_replies": ["Something sweet", "Something strong, not sweet"],
                "action": {"type": "menu_items", "items": items} if items else None}

    items = await menu_tool.find_items(message)
    if items:
        detail = len(items) == 1 or _has(t, r"\b(ingredient|in it|made with|calorie|contain|what is|what'?s in)\b")
        reply = "\n".join(menu_tool.describe(item, detail=detail) for item in items)
        return {"reply": reply, "quick_replies": ["Something similar", "See the menu"],
                "action": {"type": "menu_items", "items": [menu_tool.item_card(i) for i in items]}}

    category = menu_tool.detect_category(t)
    if category and _has(t, r"\b(what|which|any|list|have|menu|show|options)\b"):
        category_items = await menu_tool.items_in_category(category)
        lines = [f"- {i['name']} ({menu_tool.format_price(i['price'])})" for i in category_items]
        return {"reply": "Here is what we have:\n" + "\n".join(lines), "quick_replies": ["Recommend something"],
                "action": {"type": "menu_items", "items": [menu_tool.item_card(i) for i in category_items[:6]]}}

    if _has(t, r"\b(do you have|do you serve|do you sell|got any|is there)\b"):
        return {"reply": "I could not find that on our menu, sorry. Would you like a recommendation instead?",
                "quick_replies": ["Recommend something", "See the menu"],
                "action": {"type": "link", "label": "Full menu", "href": "/menu"}}

    if faq:
        return {"reply": faq["answer"], "quick_replies": DEFAULT_QUICK_REPLIES[:2]}

    return {"reply": FALLBACK_REPLY, "quick_replies": DEFAULT_QUICK_REPLIES}


# ------------------------------------------------------------------ LLM mode

TOOLS = [
    {
        "name": "search_menu",
        "description": "Search the live menu. Returns real items with name, price, description, ingredients, tags, and availability. Use for any question about food, drinks, prices, or ingredients.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Words to match in name, description, or ingredients. Empty for all."},
                "category": {"type": "string", "enum": ["coffee", "cold-drinks", "bakery", "snacks", "meals", "desserts"]},
                "tags": {"type": "array", "items": {"type": "string", "enum": ["veg", "popular", "new", "strong", "sweet", "iced"]}},
                "max_price": {"type": "number"},
            },
        },
    },
    {
        "name": "recommend_items",
        "description": "Recommend up to 3 real menu items from a free-text preference, e.g. 'strong and not sweet', 'iced, under $5', 'vegetarian lunch'.",
        "input_schema": {"type": "object", "properties": {"preference": {"type": "string"}}, "required": ["preference"]},
    },
    {
        "name": "get_cafe_info",
        "description": "Opening hours, location and contact, study space zones, study pass prices, or house rules.",
        "input_schema": {
            "type": "object",
            "properties": {"topic": {"type": "string", "enum": ["hours", "location", "contact", "study_space", "passes", "rules"]}},
            "required": ["topic"],
        },
    },
    {"name": "get_offers", "description": "Current offers and discounts.", "input_schema": {"type": "object", "properties": {}}},
    {
        "name": "search_faq",
        "description": "Cafe policies: Wi-Fi password, plant milk, parking, pets, children, payment, events, delivery, accessibility, allergies.",
        "input_schema": {"type": "object", "properties": {"question": {"type": "string"}}, "required": ["question"]},
    },
    {
        "name": "check_availability",
        "description": "Free reservation start times for a date and seat type.",
        "input_schema": {
            "type": "object",
            "properties": {
                "date": {"type": "string", "description": "YYYY-MM-DD"},
                "seat_type": {"type": "string", "enum": ["table", "study-desk"]},
                "guests": {"type": "integer", "minimum": 1, "maximum": 8},
            },
            "required": ["date", "seat_type"],
        },
    },
    {
        "name": "prepare_reservation",
        "description": "Validate a complete booking and store it for confirmation. Returns a summary to show the guest. Does NOT book.",
        "input_schema": {
            "type": "object",
            "properties": {
                "seatType": {"type": "string", "enum": ["table", "study-desk"]},
                "date": {"type": "string", "description": "YYYY-MM-DD"},
                "time": {"type": "string", "description": "HH:MM, 24h, on a 30 minute slot"},
                "guests": {"type": "integer", "minimum": 1, "maximum": 8},
                "name": {"type": "string"},
                "email": {"type": "string"},
                "phone": {"type": "string"},
                "notes": {"type": "string"},
            },
            "required": ["seatType", "date", "time", "guests", "name", "email", "phone"],
        },
    },
    {
        "name": "confirm_reservation",
        "description": "Create the prepared booking. Only call after the guest clearly said yes to the summary.",
        "input_schema": {"type": "object", "properties": {}},
    },
]


async def _run_tool(name: str, args: dict, session: Session, turn: dict) -> str:
    """Executes one tool call and returns a JSON string for the model."""
    try:
        if name == "search_menu":
            items = await menu_tool.search_menu(args.get("query", ""), args.get("category"), args.get("tags"), args.get("max_price"))
            turn["items"].extend(items)
            return json.dumps([
                {k: i.get(k) for k in ("name", "price", "description", "ingredients", "tags", "isAvailable", "calories")}
                | {"category": i.get("category", {}).get("name")}
                for i in items
            ])
        if name == "recommend_items":
            reply, cards = await menu_agent.recommend(args["preference"])
            turn["cards"].extend(cards)
            return reply
        if name == "get_cafe_info":
            return await info_tool.get_info_topic(args["topic"])
        if name == "get_offers":
            return await offer_tool.offers_text()
        if name == "search_faq":
            entry = info_tool.search_faq(args["question"])
            return entry["answer"] if entry else "No FAQ entry found. Suggest contacting hello@alladin.cafe."
        if name == "check_availability":
            times = await reservation_tool.available_times(args["date"], args["seat_type"], args.get("guests", 1))
            return json.dumps({"free_times": times}) if times else "No free times on that date."
        if name == "prepare_reservation":
            draft = ReservationDraft(**args).model_dump()
            if draft["seatType"] == "study-desk" and draft["guests"] != 1:
                return "Invalid: study desks are for 1 person. Offer a table for groups."
            times = await reservation_tool.available_times(draft["date"], draft["seatType"], draft["guests"])
            if draft["time"] not in times:
                return json.dumps({"error": "time not available", "nearest_free_times": reservation_tool.nearest_times(times, draft["time"]) if times else []})
            session.pending_confirmation = draft
            session.prepared_at_turn = session.user_turns
            return "Prepared. Show this summary and ask the guest to confirm: " + reservation_agent.summary(draft)
        if name == "confirm_reservation":
            # Code-level guard: the model cannot book without a prepared draft and an explicit yes
            if not session.pending_confirmation:
                return "Nothing prepared yet. Call prepare_reservation first."
            # The guest must see the summary first: a "yes" in the same message that
            # supplied the details does not count
            if session.prepared_at_turn is None or session.user_turns <= session.prepared_at_turn:
                return "Show the guest the summary and wait for their reply before confirming."
            if not tu.is_affirmative(session.last_user_message()):
                return "The guest has not clearly confirmed yet. Ask them to confirm the summary."
            reservation = await reservation_tool.create(session.pending_confirmation)
            session.pending_confirmation = None
            turn["action"] = {"type": "reservation_created", "reservation": reservation}
            return "Booked. Status pending; the team will confirm shortly."
    except BackendError as error:
        return f"Error from the cafe system: {error.message}"
    except (KeyError, ValueError, TypeError) as error:
        return f"Invalid tool input: {error}"
    return f"Unknown tool {name}."


def _block_param(block) -> dict:
    """Converts a response content block back into request format (only the fields the API accepts)."""
    if block.type == "tool_use":
        return {"type": "tool_use", "id": block.id, "name": block.name, "input": block.input}
    return {"type": "text", "text": getattr(block, "text", "")}


PRICE_RE = re.compile(r"\$\s?(\d+(?:\.\d{1,2})?)")


async def _prices_are_grounded(reply: str) -> bool:
    """Every $ amount must be a real menu or pass price (or a small multiple, e.g. 2 x $4.50)."""
    amounts = [float(m) for m in PRICE_RE.findall(reply)]
    if not amounts:
        return True
    info = await backend.get_info()
    known = await menu_tool.known_prices() | {float(p["price"]) for p in info["studySpace"]["passes"]}
    return all(any(abs(amount - k * price) < 0.01 for price in known for k in range(1, 11)) for amount in amounts)


BOOKED_REPLY = "Done! Your booking request is in and marked pending. The team will confirm it shortly."


async def llm_reply(session: Session, message: str) -> dict:
    turn: dict = {"items": [], "cards": [], "action": None}
    try:
        return await _llm_turn(session, turn)
    except LLMUnavailable:
        # If a booking was already created this turn, never fall back to an answer that ignores it
        if turn["action"] and turn["action"]["type"] == "reservation_created":
            return {"reply": BOOKED_REPLY, "quick_replies": DEFAULT_QUICK_REPLIES[:2], "action": turn["action"]}
        raise


async def _llm_turn(session: Session, turn: dict) -> dict:
    now = datetime.now()
    system = SYSTEM_PROMPT.format(today=now.strftime("%A, %B %d, %Y"), now=now.strftime("%H:%M"))
    messages = [{"role": m["role"], "content": m["content"]} for m in session.history]

    for _ in range(6):  # tool-use rounds
        response = await llm.create(system, messages, TOOLS)
        if response.stop_reason != "tool_use":
            break
        messages.append({"role": "assistant", "content": [_block_param(block) for block in response.content]})
        results = []
        for block in response.content:
            if block.type == "tool_use":
                output = await _run_tool(block.name, block.input or {}, session, turn)
                results.append({"type": "tool_result", "tool_use_id": block.id, "content": output})
        messages.append({"role": "user", "content": results})
    else:
        raise LLMUnavailable("Too many tool rounds.")

    reply = "".join(block.text for block in response.content if block.type == "text").strip()
    if not reply:
        raise LLMUnavailable("Empty reply.")
    if not await _prices_are_grounded(reply):
        log.warning("Ungrounded price in LLM reply; using rules mode instead: %r", reply)
        raise LLMUnavailable("Ungrounded price.")

    action = turn["action"]
    if action is None:
        cards = turn["cards"] or [menu_tool.item_card(i) for i in turn["items"][:4]]
        mentioned = [c for c in cards if c["name"].lower() in reply.lower()]
        if mentioned:
            action = {"type": "menu_items", "items": mentioned[:4]}

    quick = ["Yes, book it", "No, cancel"] if session.pending_confirmation else DEFAULT_QUICK_REPLIES[:3]
    return {"reply": reply, "quick_replies": quick, "action": action}


# ------------------------------------------------------------------ entry point


async def respond(session: Session, message: str) -> tuple[dict, str]:
    """Returns (result, mode). Falls back to rules mode whenever the LLM is unavailable."""
    session.add_turn("user", message)
    result, mode = None, "rules"
    if llm.enabled:
        try:
            result, mode = await llm_reply(session, message), "llm"
        except LLMUnavailable:
            result = None
    if result is None:
        try:
            result = await rules_reply(session, message)
        except BackendError as error:
            log.warning("Backend error in rules mode: %s", error.message)
            result = {"reply": "Sorry, I cannot reach the cafe system right now. Please try again in a moment, "
                               "or contact us at hello@alladin.cafe.", "quick_replies": []}
    session.add_turn("assistant", result["reply"])
    return result, mode
