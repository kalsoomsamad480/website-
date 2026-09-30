from datetime import date

from app.utils import text_utils as tu

TODAY = date(2026, 9, 29)  # a Tuesday


def test_parse_relative_and_named_dates():
    assert tu.parse_date("today please", TODAY) == TODAY
    assert tu.parse_date("tomorrow at 3", TODAY) == date(2026, 9, 30)
    assert tu.parse_date("this friday", TODAY) == date(2026, 10, 2)
    assert tu.parse_date("next tuesday", TODAY) == date(2026, 10, 6)
    assert tu.parse_date("on Oct 3rd", TODAY) == date(2026, 10, 3)
    assert tu.parse_date("the 5th of october", TODAY) == date(2026, 10, 5)
    assert tu.parse_date("2026-10-10", TODAY) == date(2026, 10, 10)
    assert tu.parse_date("no date here", TODAY) is None


def test_parse_time():
    assert tu.parse_time("3pm") == "15:00"
    assert tu.parse_time("around 3:30 pm") == "15:30"
    assert tu.parse_time("at 9") == "09:00"
    assert tu.parse_time("at 6") == "18:00"
    assert tu.parse_time("18:30") == "18:30"
    assert tu.parse_time("noon") == "12:00"


def test_table_for_four_is_guests_not_time():
    assert tu.parse_time("a table for 4") is None
    assert tu.parse_guests("a table for 4") == 4


def test_parse_guests():
    assert tu.parse_guests("we are 3 people") == 3
    assert tu.parse_guests("just me") == 1
    assert tu.parse_guests("party of six") == 6
    assert tu.parse_guests("at 3pm") is None


def test_seat_type_contact_and_name():
    assert tu.parse_seat_type("a quiet desk to study") == "study-desk"
    assert tu.parse_seat_type("table with friends") == "table"
    assert tu.parse_email("mail me at Sara.K@Example.com thanks") == "sara.k@example.com"
    assert tu.parse_phone("my number is +92 300 1234567") == "+92 300 1234567"
    assert tu.parse_phone("for 4 people") is None
    assert tu.parse_phone("book a desk on 2026-10-01 at 10am") is None
    assert tu.tidy_name("sara khan") == "Sara Khan"
    assert tu.tidy_name("QA Agent") == "QA Agent"
    assert tu.parse_name("my name is sara khan") == "Sara Khan"
    assert tu.looks_like_name("Sara Khan")
    assert not tu.looks_like_name("what time do you close today please")


def test_yes_and_no():
    assert tu.is_affirmative("Yes, book it")
    assert tu.is_affirmative("sounds good")
    assert not tu.is_affirmative("not yet")
    assert tu.is_negative("no thanks")
    assert tu.is_negative("cancel that")
