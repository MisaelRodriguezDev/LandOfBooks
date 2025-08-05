from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship
from sqlalchemy.dialects.postgresql import TEXT
from .common import Base
from .book_genre import BookGenre

if TYPE_CHECKING:
    from .books import Book

class Genre(Base, table=True):

    __tablename__ = "tbl_genres"

    name: str = Field(nullable=False, min_length=3, max_length=50, unique=True, index=True)
    description: str | None = Field(default=None, sa_type=TEXT)

    books: list["Book"] = Relationship(back_populates='genres', link_model=BookGenre)