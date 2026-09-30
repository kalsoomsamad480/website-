"""Small, dependency-free parsers for chat text: dates, times, guests, contact details, yes/no."""

import re
from datetime import date, timedelta
from difflib import SequenceMatcher

WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
MONTHS = {
    name: index + 1
    for index, names in enumerate(
        [
            ("jan", "january"), ("feb", "february"), ("mar", "march"), ("apr", "april"),
            ("may",), ("jun", "june"), ("jul", "july"), ("aug", "august"),
            ("sep", "sept", "september"), ("oct", "october"), ("nov", "november"), ("dec", "december"),
        ]
    )
    for name in names
}
NUMBER_WORDS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8,
    "nine": 9, "ten": 10, "a couple": 2, "couple": 2,
}

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(\.[\w-]+)+")
PHONE_RE = re.compile(r"\+?[\d][\d\s()-]{6,18}\d")

AFFIRMATIVE = re.compile(
    r"^\s*(yes|yep|yeah|yup|sure|ok|okay|confirm|confirmed|correct|please do|go ahead|book it|"
    r"sounds good|perfect|that'?s right|do it|absolutely|y)\b",
    re.IGNORECASE,
)
NEGATIVE = re.compile(
    r"^\s*(no|nope|nah|cancel|stop|never ?mind|don'?t|not now|forget it|n)\b", re.IGNORECASE
)


def normalize(text: str) -> str:
    """Lowercase and collapse whitespace, keeping characters useful for parsing."""
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s$.:@+/'-]", " ", text.lower())).strip()


def is_affirmative(text: str) -> bool:
    return bool(AFFIRMATIVE.search(text))


def is_negative(text: str) -> bool:
    return bool(NEGATIVE.search(text))


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()


def contains_phrase(text: str, phrase: str) -> bool:
    return re.search(rf"\b{re.escape(phrase)}\b", text) is not None


def parse_date(text: str, today: date) -> date | None:
    """Understands today, tomorrow, weekdays, 'oct 3', '3rd october', and 2026-10-03."""
    t = normalize(text)
    if re.search(r"\b(today|tonight|this evening|this afternoon)\b", t):
        return today
    if "day after tomorrow" in t:
        return today + timedelta(days=2)
    if re.search(r"\b(tomorrow|tmrw|tmr)\b", t):
        return today + timedelta(days=1)

    iso = re.search(r"\b(\d{4})-(\d{1,2})-(\d{1,2})\b", t)
    if iso:
        try:
            return date(int(iso.group(1)), int(iso.group(2)), int(iso.group(3)))
        except ValueError:
            return None

    month_names = "|".join(sorted(MONTHS, key=len, reverse=True))
    for pattern, day_group, month_group in (
        (rf"\b({month_names})\.? (\d{{1,2}})(st|nd|rd|th)?\b", 2, 1),
        (rf"\b(\d{{1,2}})(st|nd|rd|th)? (of )?({month_names})\b", 1, 4),
    ):
        match = re.search(pattern, t)
        if match:
            month = MONTHS[match.group(month_group)]
            day = int(match.group(day_group))
            for year in (today.year, today.year + 1):
                try:
                    candidate = date(year, month, day)
                except ValueError:
                    return None
                if candidate >= today:
                    return candidate
            return None

    for index, name in enumerate(WEEKDAYS):
        if re.search(rf"\b{name[:3]}({name[3:]})?\b", t):
            ahead = (index - today.weekday()) % 7
            if "next" in t and ahead == 0:
                ahead = 7
            return today + timedelta(days=ahead)
    return None


def parse_time(text: str) -> str | None:
    """'3pm', '3:30 pm', '15:00', 'noon', 'at 9' -> 'HH:MM' (24h)."""
    t = normalize(text)
    if re.search(r"\bnoon\b|\bmidday\b", t):
        return "12:00"

    match = re.search(r"\b(\d{1,2})(?::|\.)?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)\b", t)
    if match:
        hour, minute = int(match.group(1)), int(match.group(2) or 0)
        if hour > 12 or minute > 59:
            return None
        is_pm = match.group(3).startswith("p")
        hour = hour % 12 + (12 if is_pm else 0)
        return f"{hour:02d}:{minute:02d}"

    match = re.search(r"\b([01]?\d|2[0-3]):([0-5]\d)\b", t)
    if match:
        return f"{int(match.group(1)):02d}:{match.group(2)}"

    # "at 9" / "around 6": cafe hours make the meaning clear (8-11 morning, 1-7 afternoon)
    # ("for 4" is left to parse_guests: "a table for 4" means people, not 4 pm)
    match = re.search(r"\b(?:at|around|by|about) (\d{1,2})\b(?!\s*(people|guests|persons|of us|pax))", t)
    if match:
        hour = int(match.group(1))
        if 1 <= hour <= 7:
            hour += 12
        if 8 <= hour <= 22:
            return f"{hour:02d}:00"
    return None


def parse_guests(text: str) -> int | None:
    t = normalize(text)
    if re.search(r"\b(just me|only me|myself|alone|solo|by myself)\b", t):
        return 1
    match = re.search(r"\b(\d{1,2})\s*(people|persons|guests|of us|pax|adults|ppl)\b", t)
    if not match:
        match = re.search(r"\b(?:party of|table for|for|group of)\s*(\d{1,2})\b(?!\s*(am|pm|:))", t)
    if match:
        return int(match.group(1))
    for word, number in NUMBER_WORDS.items():
        if re.search(rf"\b(party of |table for |for )?{word}\s*(people|persons|guests|of us)\b", t) or re.search(
            rf"\b(table for|party of|group of) {word}\b", t
        ):
            return number
    return None


def parse_seat_type(text: str) -> str | None:
    t = normalize(text)
    if re.search(r"\b(desk|study|studying|work|working|laptop|focus|quiet)\b", t):
        return "study-desk"
    if re.search(r"\b(table|friends|family|group|dinner|lunch|birthday|date night)\b", t):
        return "table"
    return None


def parse_email(text: str) -> str | None:
    match = EMAIL_RE.search(text)
    return match.group(0).lower() if match else None


ISO_DATE_RE = re.compile(r"\b\d{4}-\d{1,2}-\d{1,2}\b")


def parse_phone(text: str) -> str | None:
    # Remove emails and dates first so "2026-10-01" is never read as a phone number
    cleaned = ISO_DATE_RE.sub(" ", EMAIL_RE.sub(" ", text))
    match = PHONE_RE.search(cleaned)
    if not match:
        return None
    digits = re.sub(r"\D", "", match.group(0))
    return match.group(0).strip() if 7 <= len(digits) <= 15 else None


def parse_name(text: str) -> str | None:
    """'my name is Sara Khan', "I'm Sara", 'this is Sara' -> 'Sara Khan'."""
    match = re.search(
        r"\b(?:my name is|name's|name is|i am|i'm|im|this is|it's|call me)\s+([a-zA-Z][a-zA-Z' -]{1,58})",
        text,
        re.IGNORECASE,
    )
    if not match:
        return None
    name = re.split(r"\s+(?:and|my|email|phone|number|,)\b|[,.]", match.group(1))[0].strip()
    return tidy_name(name) if 2 <= len(name) <= 60 else None


def tidy_name(name: str) -> str:
    """Capitalizes all-lowercase names but keeps the guest's own casing otherwise ('QA Agent', 'McKay')."""
    name = " ".join(name.split())
    return name.title() if name.islower() else name


def looks_like_name(text: str) -> bool:
    """Accepts a bare reply like 'Sara Khan' when we just asked for a name."""
    return bool(re.fullmatch(r"[A-Za-z][A-Za-z' -]{1,58}", text.strip())) and len(text.split()) <= 4
