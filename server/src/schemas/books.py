"""This module contains the input, output, and book 
update schemes, copies of the books, and genres due to the 
simplicity of the latter two.
"""
from enum import StrEnum
from uuid import UUID
from pydantic import BaseModel, Field
from .common import BaseOut
from .authors import AuthorOut
from .publisher import PublisherOut

class BookCopyStatus(StrEnum):
    AVAILABLE = 'available'
    LOANED = 'loaned'
    LOST = 'lost'
    REMOVED = 'removed'

class BookBase(BaseModel):
    isbn: str = Field(min_length=10, max_length=13)
    title: str = Field(min_length=5, max_length=100)
    description: str = Field(min_length=50, max_length=500)
    cover: str = Field(min_length=50, max_length=255)
    year_of_publication: int = Field(ge=0, le=2100)

class BookIn(BookBase):
    genre_ids: list[UUID]
    author_ids: list[UUID]
    publisher_id: UUID

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class BookUpdate(BaseModel):
    isbn: str | None = Field(default=None, min_length=10, max_length=13)
    title: str | None = Field(default=None, min_length=5, max_length=100)
    description: str | None = Field(default=None, min_length=50, max_length=500)
    cover: str | None = Field(default=None, min_length=50, max_length=255)
    year_of_publication: int | None = Field(default=None, ge=0, le=2100)
    publisher_id: UUID | None = Field(default=None)

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class BookOut(BaseOut, BookBase):
    genres: list["GenreOut"]
    publisher: "PublisherOut"
    authors: list[AuthorOut]

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class BookCopyIn(BaseModel):
    book_id: UUID
    barcode: str = Field(max_length=50)
    status: BookCopyStatus = Field(default=BookCopyStatus.AVAILABLE, min_length=4, max_length=9)

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class BookCopyUpdate(BaseModel):
    barcode: str | None = Field(default=None, max_length=50)
    status: BookCopyStatus | None = Field(default=None, min_length=4, max_length=9)

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class BookCopyOut(BaseOut, BookCopyIn):
    book: BookOut

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class GenreIn(BaseModel):
    name: str = Field(min_length=3, max_length=15)
    description: str | None = Field(default=None)

class GenreUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=15)
    description: str | None = Field(default=None)

class GenreOut(BaseOut, GenreIn):

    class Config:
        json_schema_extra = {
            'example': {

            }
        }