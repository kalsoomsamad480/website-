from typing import Literal

from pydantic import BaseModel, Field

SeatType = Literal["table", "study-desk"]

# Order in which the booking flow asks for missing details
BOOKING_FIELDS = ["seatType", "date", "time", "guests", "name", "email", "phone"]


class ReservationDraft(BaseModel):
    seatType: SeatType
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    time: str = Field(pattern=r"^\d{2}:\d{2}$")
    guests: int = Field(ge=1, le=8)
    name: str = Field(min_length=2, max_length=60)
    email: str = Field(min_length=5, max_length=120)
    phone: str = Field(min_length=7, max_length=20)
    notes: str = Field(default="", max_length=300)
