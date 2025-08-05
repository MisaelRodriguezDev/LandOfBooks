from uuid import UUID
from typing_extensions import TYPE_CHECKING
from datetime import datetime, date
from pydantic import BaseModel, Field
from .common import BaseOut

if TYPE_CHECKING:
    from .users import UserOut
    from .loans import LoanOut

class PenaltyBase(BaseModel):
    reason: str | None = Field(default=None, max_length=100)
    payment_date: datetime | None = Field(default=None)
    generation_date: date | None = Field(default=None)

class PenaltyIn(PenaltyBase):
    loan_id: UUID
    amount: float = Field(ge=1, le=1000)

class PenaltyUpdate(PenaltyBase):
    loan_id: UUID | None = Field(default=None)
    amount: float | None = Field(default=None, ge=1, le=1000)

class PenaltyOut(BaseOut, PenaltyIn):
    loan: "LoanOut"
    user: "UserOut"