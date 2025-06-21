from pydantic import Field, PrivateAttr
from .users import Roles, UserBase, UserUpdate, UserIn

class UserUpdateFromAdmin(UserUpdate):
    role: Roles | None = Field(default=None, min_length=4, max_length=9)

class UserInFromAdmin(UserBase):
    """Validación de registro desde el adminsitrador en el back-end"""
    password: str = Field(min_length=8, max_length=50)
    confirm_password: str = Field(min_length=8, max_length=50)
    role: Roles = Field(default=Roles.USER)
    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "Misael",
                "last_name": "Rodríguez",
                "username": "Mictla",
                "email": "elgranmictla@gmail.com",
                "role": "user",
                "password": "ContraseñaSegura147",
                "confirm_password": "ContraseñaSegura147",
            }
        }