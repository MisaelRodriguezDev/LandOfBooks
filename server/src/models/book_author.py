from uuid import UUID
from sqlmodel import Field
from .common import Base

class BookAuthor(Base, table=True):
    book_id: UUID = Field(nullable=False, foreign_key="tbl_books.id", index=True)
    author_id: UUID = Field(nullable=False, foreign_key="tbl_authors.id", index=True)