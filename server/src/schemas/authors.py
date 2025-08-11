from datetime import date
from typing import TYPE_CHECKING
from pydantic import BaseModel, Field
from fastapi import File, UploadFile
from .common import BaseOut

if TYPE_CHECKING:
    from .books import BookOut

class AuthorBase(BaseModel):
    pseudonym: str | None = Field(default=None, max_length=20)
    photo: str | None = File(default=None)
    birth_date: date | None = Field(default=None)
    biography: str | None = Field(default=None, max_length=2500)
    nationality: str | None = Field(max_length=100, default=None)

class AuthorIn(AuthorBase):
    first_name: str = Field(min_length=1, max_length=50)
    last_name: str = Field(max_length=50)

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class AuthorUpdate(AuthorBase):
    first_name: str | None = Field(default=None, max_length=50)
    last_name: str | None = Field(default=None, max_length=50)

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class AuthorOut(AuthorIn, BaseOut):

    class Config:
        json_schema_extra = {
            'example': {
                "id": "9a60c12a-1224-442e-a7cb-07df1e3e761b",
                'first_name': '',
                "created_at": "2025-02-03 14:23:45.678901+00:00",
                "updated_at": "2025-02-03 14:23:45.678901+00:00"
            }
        }