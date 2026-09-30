"""Current offers from GET /offers."""

from datetime import datetime

from app.services.backend_client import backend


async def offers_text() -> str:
    offers = await backend.get_offers()
    if not offers:
        return "There are no special offers running right now, but the menu is always worth a look."
    lines = []
    for offer in offers:
        until = datetime.fromisoformat(offer["validTill"].replace("Z", "+00:00")).strftime("%b %d").replace(" 0", " ")
        lines.append(f"{offer['title']} ({offer['discountText']}): {offer['description']} Valid until {until}.")
    return "Here is what is on right now:\n" + "\n".join(f"- {line}" for line in lines)
