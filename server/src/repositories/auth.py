from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy import func
from src.models.users import User
from src.core.config import CONFIG
from .users import UserRepository

class AuthRepository:
    def __init__(self, session: Session):
        self.session = session
        self.rp_user = UserRepository(session)

    