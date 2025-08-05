from uuid import UUID
from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, Relationship
from sqlalchemy.dialects.postgresql import TEXT
from .common import Base
from .book_author import BookAuthor
from .book_genre import BookGenre

if TYPE_CHECKING:
    from .publishers import Publisher
    from .authors import Author
    from .genres import Genre
    from .copies import BookCopy
    from .reservations import Reservation

class Book(Base, table=True):
    __tablename__ = "tbl_books"

    isbn: str = Field(nullable=False, min_length=10, max_length=13, index=True)
    title: str = Field(nullable=False, min_length=5, max_length=100, index=True)
    description: str = Field(nullable=False, min_length=50, max_length=500, sa_type=TEXT)
    cover: str = Field(nullable=False, min_length=50, max_length=255)
    year_of_publication: int = Field(nullable=False, ge=0, le=2100)
    publisher_id: UUID = Field(foreign_key='tbl_publishers.id')

    authors: list["Author"] = Relationship(back_populates='books', link_model=BookAuthor)
    genres: list["Genre"] = Relationship(back_populates='books', link_model=BookGenre)
    publisher: "Publisher" = Relationship(back_populates='books')
    copies: list["BookCopy"] = Relationship(back_populates='book')
    reservations: Optional[list["Reservation"]] = Relationship(back_populates='book')
