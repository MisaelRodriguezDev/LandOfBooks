from uuid import UUID
from typing import TYPE_CHECKING
from datetime import date, datetime
from sqlmodel import Field, Relationship
from .common import Base

if TYPE_CHECKING:
    from .loans import Loan
    from .users import User

class Penalty(Base, table=True):
    __tablename__ = 'tbl_penalties'

    loan_id: UUID = Field(foreign_key='tbl_loans.id', nullable=False)
    user_id: UUID = Field(foreign_key='tbl_users.id', nullable=False)
    amount: float = Field(nullable=False, ge=1, le=1000)
    reason: str | None = Field(default=None, max_length=100)
    generation_date: date = Field(nullable=False, default_factory=date.today)
    payment_date: datetime | None = Field(default=None)

    loan: "Loan" = Relationship(back_populates='penalty')
    user: "User" = Relationship(back_populates='penalties')