import asyncio

from app.agents import menu_agent
from tests.conftest import MENU


def recommend(text):
    return asyncio.run(menu_agent.recommend(text))


def test_strong_and_not_sweet(fake_backend):
    reply, items = recommend("something strong and not sweet")
    names = {i["name"] for i in items}
    assert names, reply
    by_name = {i["name"]: i for i in MENU}
    for name in names:
        assert "sweet" not in by_name[name]["tags"]
        assert "strong" in by_name[name]["tags"]


def test_budget_and_iced(fake_backend):
    _, items = recommend("an iced drink under $5")
    assert items
    assert all(i["price"] <= 5 for i in items)


def test_caffeine_free_excludes_coffee(fake_backend):
    _, items = recommend("something cold with no caffeine")
    assert items
    assert all(i["name"] in {"Mango Passion Cooler", "Hibiscus Lemonade"} for i in items)


def test_never_recommends_sold_out_or_unknown_items(fake_backend):
    _, items = recommend("a new sweet dessert")
    known = {i["name"] for i in MENU}
    assert all(i["name"] in known for i in items)
    assert "Pistachio Kunafa" not in {i["name"] for i in items}  # sold out today


def test_no_match_is_honest(fake_backend):
    reply, items = recommend("a vegetarian meal under $3")
    assert items == []
    assert "could not find" in reply
