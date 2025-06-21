from sqlmodel import Field
from .common import Base

class Book(Base, table=True):
    __tablename__ = "tbl_books"

    name: str = Field(nullable=False, min_length=5, max_length=100)
    