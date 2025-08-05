from enum import StrEnum
from uuid import UUID
from typing import TYPE_CHECKING
from datetime import datetime, date
from pydantic import BaseModel, Field
from .common import BaseOut
from .books import BookCopyOut
from .penalties import PenaltyOut

if TYPE_CHECKING:
    from .users import UserOut

class LoanStatus(StrEnum):
    PENDING = 'PENDING'
    ACTIVE = 'ACTIVE'
    EXPIRED = 'EXPIRED'
    RETURNED = 'RETURNED'
    OVERDUE = 'OVERDUE'
    CANCELLED = 'CANCELLED'

class LoanBase(BaseModel):
    loan_date: datetime | None = Field(default=None)
    due_date: date | None = Field(default=None)
    return_date: datetime | None = Field(default=None)

class LoanIn(LoanBase):
    book_id: UUID
    status: LoanStatus = Field(default=LoanStatus.PENDING, min_length=6, max_length=8)

class LoanUpdate(BaseModel):
    copy_id: UUID | None = Field(default=None)
    status: LoanStatus | None = Field(default=None, min_length=6, max_length=8)

class LoanOut(BaseOut, LoanIn):
    book_copy: BookCopyOut
    user: "UserOut"
    penalty: PenaltyOut

    class Config:
        json_schema_extra = {
            'example': {
                
            }
        }