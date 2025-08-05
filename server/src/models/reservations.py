from uuid import UUID
from datetime import date
from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship
from .common import Base
from src.schemas.reservations import ReservationStatus as Status

if TYPE_CHECKING:
    from .books import Book
    from .users import User

class Reservation(Base, table=True):
    __tablename__ = 'tbl_reservations'

    book_id: UUID = Field(foreign_key='tbl_books.id', nullable=False)
    user_id: UUID = Field(foreign_key='tbl_users.id', nullable=False)
    reservation_date: date = Field(nullable=False, default_factory=date.today)
    status: Status = Field(nullable=False, min_length=6, max_length=9, default=Status.WAITING)
    reason: str | None = Field(default=None, max_length=100)

    book: "Book" = Relationship(back_populates='reservations')
    user: "User" = Relationship(back_populates='reservations')