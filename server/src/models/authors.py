from typing import TYPE_CHECKING
from datetime import date
from sqlmodel import Field, Relationship
from .common import Base
from .book_author import BookAuthor

IMAGE = "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"

if TYPE_CHECKING:
    from .books import Book

class Author(Base, table=True):
    __tablename__ = 'tbl_authors'

    first_name: str = Field(min_length=1, max_length=50, index=True)
    last_name: str = Field(min_length=1, max_length=50, index=True)
    pseudonym: str | None = Field(default=None, max_length=20, unique=True, index=True)
    photo: str = Field(default=IMAGE, nullable=False, max_length=255)
    biography: str | None = Field(default=None, max_length=2500)
    nationality: str | None = Field(max_length=100, default=None, nullable=True)
    birth_date: date | None = Field(default=None, nullable=True)

    books: list["Book"] = Relationship(back_populates='authors', link_model=BookAuthor)