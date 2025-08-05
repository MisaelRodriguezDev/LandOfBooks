from uuid import UUID
from sqlmodel import Field
from .common import Base

class BookGenre(Base, table=True):
    __tablename__ = "tbl_book_genre"

    book_id: UUID = Field(nullable=False, foreign_key='tbl_books.id', index=True)
    genre_id: UUID = Field(nullable=False, foreign_key='tbl_genres.id', index=True)