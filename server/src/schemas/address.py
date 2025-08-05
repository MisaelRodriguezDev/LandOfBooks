from pydantic import BaseModel, Field
from .common import BaseOut

class AddressIn(BaseModel):
    street: str = Field(min_length=10, max_length=100)
    postal_code: int = Field(max_digits=5)
    exterior_number: str = Field(min_length=1, max_length=15)
    interior_number: str | None = Field(default=None, max_length=15)
    city: str = Field(min_length=1, max_length=50)
    state: str = Field(min_length=1, max_length=50)

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class AddressUpdate(BaseModel):
    street: str | None = Field(default=None, max_length=100)
    postal_code: int | None = Field(default=None, max_digits=5)
    exterior_number: str | None = Field(default=None, max_length=15)
    interior_number: str | None = Field(default=None, max_length=15)
    city: str | None = Field(default=None, max_length=50)
    state: str | None = Field(default=None, max_length=50)

    class Config:
        json_schema_extra = {
            'example': {

            }
        }

class AddressOut(BaseOut, AddressIn):
    
    class Config:
        json_schema_extra = {
            'example': {

            }
        }