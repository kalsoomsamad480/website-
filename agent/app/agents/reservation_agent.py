"""Rules-mode booking flow: collects details one at a time, confirms, then books.

A booking is only created after the guest explicitly says yes to a summary.
"""

from datetime import date, datetime, timedelta

from app.memory.session_memory import Session
from app.schemas.reservation_schema import BOOKING_FIELDS
from app.tools import reservation_tool
from app.tools.info_tool import format_time
from app.utils import text_utils as tu

MAX_DAYS_AHEAD = 30
QUESTIONS = {
    "seatType": "Would you like a table, or a study desk for focused work?",
    "date": "Which day would you like? You can say today, tomorrow, a weekday, or a date like Oct 3.",
    "time": "What time works for you?",
    "guests": "How many people will be joining?",
    "name": "What name should I put the booking under?",
    "email": "What email should we send the confirmation to?",
    "phone": "And a phone number in case we need to reach you?",
}
QUICK = {
    "seatType": ["A table", "A study desk"],
    "date": ["Today", "Tomorrow"],
    "guests": ["Just me", "2 people", "4 people"],
}


def _today() -> date:
    return datetime.now().date()


def extract(message: str, awaiting: str | None) -> dict:
    """Pulls any booking details out of a message."""
    today = _today()
    found: dict = {}
    if seat := tu.parse_seat_type(message):
        found["seatType"] = seat
    if day := tu.parse_date(message, today):
        found["date"] = day.isoformat()
    if when := tu.parse_time(message):
        found["time"] = when
    if guests := tu.parse_guests(message):
        found["guests"] = guests
    if email := tu.parse_email(message):
        found["email"] = email
    if phone := tu.parse_phone(message):
        found["phone"] = phone
    if name := tu.parse_name(message):
        found["name"] = name

    # Bare answers to the question we just asked
    if awaiting == "name" and "name" not in found and tu.looks_like_name(message):
        found["name"] = tu.tidy_name(message)
    if awaiting == "guests" and "guests" not in found and message.strip().isdigit():
        found["guests"] = int(message.strip())
    if awaiting == "time" and "time" not in found:
        bare = message.strip()
        if bare.isdigit():
            hour = int(bare)
            hour = hour + 12 if 1 <= hour <= 7 else hour
            if 8 <= hour <= 22:
                found["time"] = f"{hour:02d}:00"
    return found


def summary(draft: dict) -> str:
    seat = "a table" if draft["seatType"] == "table" else "a study desk"
    day = date.fromisoformat(draft["date"]).strftime("%A, %B %d").replace(" 0", " ")
    people = "1 person" if draft["guests"] == 1 else f"{draft['guests']} people"
    return (
        f"Here is your booking: {seat} for {people} on {day} at {format_time(draft['time'])}, "
        f"under {draft['name']} ({draft['email']}, {draft['phone']}). Shall I book it?"
    )


def _validate(draft: dict) -> tuple[str | None, str | None]:
    """Returns (field, problem) for details that break the booking rules."""
    if "date" in draft:
        chosen = date.fromisoformat(draft["date"])
        if chosen < _today():
            return "date", "That date has already passed."
        if chosen > _today() + timedelta(days=MAX_DAYS_AHEAD):
            return "date", f"We take bookings up to {MAX_DAYS_AHEAD} days ahead."
    if draft.get("seatType") == "study-desk":
        if draft.get("guests", 1) != 1:
            return "guests", "Study desks are for one person. For a group, I can book a table instead."
        draft["guests"] = 1
    if "guests" in draft and not 1 <= draft["guests"] <= 8:
        return "guests", "Tables seat 1 to 8 guests. For bigger groups, email hello@alladin.cafe."
    return None, None


async def handle(session: Session, message: str) -> dict:
    """One step of the booking conversation. Returns {reply, quick_replies, action?}."""
    draft = session.booking or {}

    # Waiting for a yes or no on the summary
    if session.pending_confirmation:
        if tu.is_affirmative(message):
            return await _book(session)
        if tu.is_negative(message):
            session.booking = None
            session.pending_confirmation = None
            return {"reply": "No problem, I have not booked anything. Anything else I can help with?",
                    "quick_replies": ["Book a table", "Today's offers"]}
        # Treat anything else as a correction, then confirm again
        session.pending_confirmation = None

    # A plain "no" / "cancel" (with no new details) abandons the booking
    if draft and tu.is_negative(message) and not extract(message, None):
        session.booking = None
        return {"reply": "Okay, I have cancelled that booking request. Anything else?", "quick_replies": ["Today's offers"]}

    draft.update(extract(message, draft.get("_awaiting")))
    session.booking = draft

    problem_field, problem = _validate(draft)
    if problem:
        draft.pop(problem_field, None)
        draft["_awaiting"] = problem_field
        return {"reply": f"{problem} {QUESTIONS[problem_field]}", "quick_replies": QUICK.get(problem_field, [])}

    # Check the time against live availability once we know seat, date, and party size
    if all(k in draft for k in ("seatType", "date")) and (draft.get("seatType") == "study-desk" or "guests" in draft):
        guests = draft.get("guests", 1)
        try:
            times = await reservation_tool.available_times(draft["date"], draft["seatType"], guests)
        except reservation_tool.BackendError as error:
            draft.pop("date", None)
            draft["_awaiting"] = "date"
            return {"reply": f"{error.message} {QUESTIONS['date']}", "quick_replies": QUICK["date"]}

        if not times:
            draft.pop("date", None)
            draft.pop("time", None)
            draft["_awaiting"] = "date"
            return {"reply": "Sorry, there are no free slots left that day. Which other day would suit you?",
                    "quick_replies": QUICK["date"]}
        if "time" in draft and draft["time"] not in times:
            options = reservation_tool.nearest_times(times, draft["time"])
            wanted = format_time(draft.pop("time"))
            draft["_awaiting"] = "time"
            return {"reply": f"{wanted} is not available. The closest free times are "
                             f"{reservation_tool.readable_times(options)}. Which one would you like?",
                    "quick_replies": [format_time(t) for t in options]}
        if "time" not in draft:
            draft["_awaiting"] = "time"
            suggestions = times[:: max(1, len(times) // 4)][:4]
            return {"reply": f"{QUESTIONS['time']} Some free times: {reservation_tool.readable_times(suggestions)}.",
                    "quick_replies": [format_time(t) for t in suggestions]}

    for field in BOOKING_FIELDS:
        if field == "guests" and draft.get("seatType") == "study-desk":
            continue
        if field not in draft:
            draft["_awaiting"] = field
            return {"reply": QUESTIONS[field], "quick_replies": QUICK.get(field, [])}

    draft["_awaiting"] = None
    session.pending_confirmation = {k: v for k, v in draft.items() if not k.startswith("_")}
    return {"reply": summary(session.pending_confirmation), "quick_replies": ["Yes, book it", "No, cancel"]}


async def _book(session: Session) -> dict:
    details = session.pending_confirmation
    try:
        reservation = await reservation_tool.create(details)
    except reservation_tool.BackendError as error:
        session.pending_confirmation = None
        field = error.field_errors[0]["field"] if error.field_errors else None
        if field and session.booking is not None:
            session.booking.pop(field, None)
            session.booking["_awaiting"] = field
            return {"reply": f"{error.field_errors[0]['message']} {QUESTIONS.get(field, '')}".strip(),
                    "quick_replies": QUICK.get(field, [])}
        session.booking = None
        return {"reply": f"Sorry, I could not complete the booking: {error.message} "
                         "You can also book on the reservations page.",
                "quick_replies": [], "action": {"type": "link", "label": "Open reservations", "href": "/reserve"}}

    session.booking = None
    session.pending_confirmation = None
    return {
        "reply": "Done! Your request is in and marked pending. The team will confirm it shortly. "
                 "Anything else I can help with?",
        "quick_replies": ["Recommend a coffee", "Today's offers"],
        "action": {"type": "reservation_created", "reservation": reservation},
    }
