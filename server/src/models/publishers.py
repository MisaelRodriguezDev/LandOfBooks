from typing import TYPE_CHECKING
from sqlmodel import Field, Relationship
from .common import Base

if TYPE_CHECKING:
    from .books import Book

IMAGE = "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"

class Publisher(Base, table=True):
    __tablename__ = 'tbl_publishers'

    name: str = Field(min_length=5, max_length=50)
    phone: str | None = Field(default=None, nullable=True, min_length=13,  max_length=13)
    image_url: str = Field(default=IMAGE, nullable=False, max_length=255)

    books: list["Book"] = Relationship(back_populates='publisher')
