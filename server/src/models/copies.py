from uuid import UUID
from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship, Column, Enum
from .common import Base
from src.schemas.books import BookCopyStatus as Status
from src.utils.barcode_generator import barcode_generator

if TYPE_CHECKING:
    from .books import Book
    from .loans import Loan

class BookCopy(Base, table=True):
    __tablename__ = "tbl_copies"

    book_id: UUID = Field(foreign_key='tbl_books.id', nullable=False, index=True)
    barcode: str = Field(max_length=50, nullable=False, unique=True, default_factory=barcode_generator)
    status: Status = Field(
        min_length=4,
        max_length=9,
        default=Status.AVAILABLE,
        sa_column=Column(Enum(Status))
    )

    book: "Book" = Relationship(back_populates='copies')
    loans: list["Loan"] = Relationship(back_populates='book_copy')