from enum import StrEnum
from typing import TYPE_CHECKING
from datetime import date
from uuid import UUID
from pydantic import BaseModel, Field
from .common import BaseOut

if TYPE_CHECKING:
    from .users import UserOut
    from .books import BookOut

class ReservationStatus(StrEnum):
    WAITING = 'WAITING'
    READY = 'READY'
    EXPIRED = 'EXPIRED'
    FULFILLED = 'FULFILLED'
    CANCELLED = 'CANCELLED'

class ReservationBase(BaseModel):
    reservation_date: date | None = Field(default=None)
    state: ReservationStatus | None = Field(default=None, min_length=6, max_length=9)
    reason: str | None = Field(default=None, max_length=100)

class ReservationIn(ReservationBase):
    book_id: UUID

class ReservationUpdate(ReservationBase):
    book_id: UUID | None = Field(default=None)

class ReservationOut(BaseOut, ReservationIn):
    book: "BookOut"
    user: "UserOut"