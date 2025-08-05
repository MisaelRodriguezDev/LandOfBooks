from pydantic import BaseModel
from src.models import User

class SecurityContext(BaseModel):
    user: User
    is_admin: bool
    is_librarian: bool