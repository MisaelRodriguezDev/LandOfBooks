from sqlmodel import Session, select
from sqlalchemy import func
from src.models.users import User
from src.core.config import CONFIG
from uuid import UUID
from typing import Sequence

class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(
            User,
            func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")
        ).where(User.id == id)
        return self.session.exec(stmt).first()

    def get_by_email(self, email: str):
        stmt = select(
            User,
            func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")
        ).where(func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY) == email)
        return self.session.exec(stmt).first()

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete(self, user: User) -> None:
        user.disabled = True
        self.session.commit()
        self.session.refresh(user)
