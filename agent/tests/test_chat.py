import asyncio
from datetime import date, timedelta

import pytest
from fastapi.testclient import TestClient

from app.agents import cafe_agent
from app.memory.session_memory import Session
from main import app

SESSION = "test-session-0001"


@pytest.fixture
def client(fake_backend):
    with TestClient(app) as test_client:
        yield test_client


def say(client, message, session=SESSION):
    response = client.post("/chat", json={"session_id": session, "message": message})
    assert response.status_code == 200, response.text
    return response.json()


def test_health(client):
    body = client.get("/health").json()
    assert body["status"] == "ok"
    assert body["mode"] in ("rules", "llm")


def test_rejects_bad_input(client):
    assert client.post("/chat", json={"session_id": "short", "message": "hi"}).status_code == 422
    assert client.post("/chat", json={"session_id": SESSION, "message": ""}).status_code == 422
    assert client.post("/chat", json={"session_id": SESSION, "message": "x" * 501}).status_code == 422


def test_menu_price_comes_from_backend(client):
    body = say(client, "How much is the flat white?")
    assert "$4.50" in body["reply"]
    assert body["action"]["type"] == "menu_items"


def test_exact_name_beats_partial_matches(client):
    body = say(client, "how much is the cardamom latte?")
    assert [i["name"] for i in body["action"]["items"]] == ["Cardamom Latte"]


def test_unknown_item_is_not_invented(client):
    body = say(client, "Do you have sushi?")
    assert "could not find" in body["reply"].lower()
    assert "$" not in body["reply"]


def test_hours_location_offers(client):
    assert "Monday to Saturday" in say(client, "When do you close?")["reply"]
    assert "12 Garden Street" in say(client, "Where are you located?")["reply"]
    assert "20% off" in say(client, "Any offers today?")["reply"]


def test_faq_answer(client):
    assert "receipt" in say(client, "What's the wifi password?")["reply"]


def test_recommendation(client):
    body = say(client, "Recommend something strong but not sweet")
    assert body["action"]["type"] == "menu_items"
    assert "Cardamom Latte" not in body["reply"]


def test_full_booking_flow_requires_yes(client, fake_backend):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    first = say(client, "Book a table for 2 tomorrow at 3pm")
    assert "name" in first["reply"].lower()
    assert "email" in say(client, "Sara Khan")["reply"].lower()
    assert "phone" in say(client, "sara@example.com")["reply"].lower()
    summary = say(client, "+92 300 1234567")
    assert "Shall I book it?" in summary["reply"]
    assert fake_backend.created == []  # nothing booked before the guest says yes

    done = say(client, "Yes, book it")
    assert done["action"]["type"] == "reservation_created"
    booked = fake_backend.created[0]
    assert booked == {**booked, "seatType": "table", "date": tomorrow, "time": "15:00", "guests": 2,
                      "name": "Sara Khan", "email": "sara@example.com", "source": "agent"}


def test_booking_can_be_declined(client, fake_backend):
    say(client, "I want to book a study desk tomorrow at 10am, my name is Ali, ali@example.com, +92 333 1112223")
    body = say(client, "no")
    assert "not booked" in body["reply"].lower()
    assert fake_backend.created == []


def test_full_slot_suggests_alternatives(client):
    body = say(client, "Book a table for 4 tomorrow at 12pm")
    assert "not available" in body["reply"]
    assert body["quick_replies"]


def test_study_desk_is_one_person(client):
    body = say(client, "book a study desk for 3 people tomorrow")
    assert "one person" in body["reply"]


def _prepare_args():
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    return {"seatType": "table", "date": tomorrow, "time": "15:00", "guests": 2,
            "name": "Sara Khan", "email": "sara@example.com", "phone": "+92 300 1234567"}


def test_llm_confirm_tool_is_guarded(fake_backend):
    session = Session()
    turn = {"items": [], "cards": [], "action": None}
    run = lambda name, args=None: asyncio.run(cafe_agent._run_tool(name, args or {}, session, turn))

    session.add_turn("user", "book it for friday")
    assert "prepare_reservation" in run("confirm_reservation")

    # A "yes" in the same message that supplied the details must not book
    session.add_turn("user", "Yes, book a table for 2 tomorrow at 3pm, Sara Khan, sara@example.com, +92 300 1234567")
    assert "Prepared" in run("prepare_reservation", _prepare_args())
    assert "wait for their reply" in run("confirm_reservation")

    # Next message is not a yes
    session.add_turn("assistant", "Here is your booking... Shall I book it?")
    session.add_turn("user", "hmm, what about parking?")
    assert "not clearly confirmed" in run("confirm_reservation")
    assert fake_backend.created == []

    # An explicit yes on a later message books it
    session.add_turn("user", "yes please")
    assert "Booked" in run("confirm_reservation")
    assert len(fake_backend.created) == 1


def test_booking_is_reported_even_if_llm_then_fails(fake_backend, monkeypatch):
    session = Session()

    async def failing_turn(sess, turn):
        turn["action"] = {"type": "reservation_created", "reservation": {"_id": "r1"}}
        raise cafe_agent.LLMUnavailable("Ungrounded price.")

    monkeypatch.setattr(cafe_agent, "_llm_turn", failing_turn)
    result = asyncio.run(cafe_agent.llm_reply(session, "yes"))
    assert result["action"]["type"] == "reservation_created"
    assert "Done!" in result["reply"]


def test_price_grounding_check(fake_backend):
    assert asyncio.run(cafe_agent._prices_are_grounded("A Flat White is $4.50, two are $9.00."))
    assert asyncio.run(cafe_agent._prices_are_grounded("The Day Pass is $12."))
    assert not asyncio.run(cafe_agent._prices_are_grounded("Our truffle latte is $7.95."))
