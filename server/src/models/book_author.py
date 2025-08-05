from uuid import UUID
from sqlmodel import Field
from .common import Base

class BookAuthor(Base, table=True):
    __tablename__ = "tbl_book_author"
    
    book_id: UUID = Field(nullable=False, foreign_key="tbl_books.id", index=True)
    author_id: UUID = Field(nullable=False, foreign_key="tbl_authors.id", index=True)

