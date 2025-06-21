from sqlmodel import Field
from .common import Base

class Category(Base, table=True):

    __tablename__ = "tbl_categories"

    name: str = Field(nullable=False, min_length=3, max_length=15)