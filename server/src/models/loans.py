from uuid import UUID
from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship, Column, Enum
from sqlalchemy import event, inspect
from .common import Base
from src.schemas.loans import LoanStatus

if TYPE_CHECKING:
    from .users import User
    from .penalties import Penalty
    from .copies import BookCopy

class Loan(Base, table=True):
    __tablename__ = 'tbl_loans'
    copy_id: UUID = Field(foreign_key='tbl_copies.id', nullable=False)
    user_id: UUID = Field(foreign_key='tbl_users.id', nullable=False)
    loan_date: datetime | None = Field(default=None, nullable=True)
    due_date: date | None = Field(default=None, nullable=True)
    return_date: datetime | None = Field(default=None, nullable=True)
    status: LoanStatus = Field(
        min_length=6,
        max_length=8,
        default=LoanStatus.PENDING,
        sa_column=Column(Enum(LoanStatus))
    )

    book_copy: "BookCopy" = Relationship(back_populates='loans')
    user: "User" = Relationship(back_populates='loans')
    penalty: Optional["Penalty"] = Relationship(back_populates='loan')

@event.listens_for(Loan, 'before_insert')
def create_due_date_on_create(mapper, connection, target: Loan):
    if target.loan_date != None:
        _date = target.loan_date.date()
        target.due_date = _date + timedelta(days=15)

@event.listens_for(Loan, 'before_update')
def create_due_date_on_update(mapper, connection, target: Loan):
    insp = inspect(target)
    if insp.attrs.loan_date.history.has_changes():
        _date = target.loan_date.date()
        target.due_date = _date + timedelta(days=15)
