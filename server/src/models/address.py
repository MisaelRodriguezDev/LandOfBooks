from typing import TYPE_CHECKING
from uuid import UUID
from sqlmodel import Field, Relationship
from sqlalchemy import event, inspect
from .common import Base
from src.core.security import encrypt_data

if TYPE_CHECKING:
    from .users import User

class Address(Base, table=True):

    __tablename__ = 'tbl_addresses'

    user_id: UUID = Field(foreign_key="tbl_users.id")
    street: str = Field(min_length=10, max_length=100)
    postal_code: int = Field(max_digits=5)
    exterior_number: str = Field(min_length=1, max_length=15)
    interior_number: str | None = Field(default=None, max_length=15)
    city: str = Field(min_length=1, max_length=50)
    state: str = Field(min_length=1, max_length=50)

    user: "User" = Relationship(back_populates='address')

FIELDS_TO_ENCRYPT = ['street', 'postal_code', 'exterior_number', 'interior_number', 'city', 'state']

@event.listens_for(Address, "before_insert")
def encrypt_data_on_insert(mapper, connection, target: Address):
    for field in FIELDS_TO_ENCRYPT:
        value = getattr(target, field, None)
        if value is not None:
            encrypted_value = encrypt_data(str(value))
            setattr(target, field, encrypted_value)

@event.listens_for(Address, "before_update")
def encrypt_data_on_update(mapper, connection, target: Address):
    insp = inspect(target)
    for field in FIELDS_TO_ENCRYPT:
        attr = insp.attrs.get(field)
        if attr and attr.history.has_changes():
            value = getattr(target, field, None)
            if value is not None:
                encrypted_value = encrypt_data(str(value))
                setattr(target, field, encrypted_value)