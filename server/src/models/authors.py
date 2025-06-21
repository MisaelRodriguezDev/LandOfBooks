from sqlmodel import Field
from .common import Base

class Author(Base, table=True):
    name: str = Field()
    last_name: str = Field()
    photo: str = Field()
    biographty: str = Field()