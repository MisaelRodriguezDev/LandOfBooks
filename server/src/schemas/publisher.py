from typing import TYPE_CHECKING
from pydantic import BaseModel, Field
from .common import BaseOut

if TYPE_CHECKING:
    from .books import BookOut

class PublisherBase(BaseModel):
    phone: str | None = Field(default=None, min_length=13, max_length=13)
    image_url: str | None = Field(default=None, max_length=255)

class PublisherIn(PublisherBase):
    name: str = Field(min_length=5, max_length=50)

class PublisherUpdate(PublisherBase):
    name: str | None = Field(default=None, min_length=5, max_length=50)

class PublisherOut(BaseOut, PublisherIn):
    class Config:
        json_schema_extra = {
            'example': {

            }
        }