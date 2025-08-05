from sqlalchemy import func
from sqlmodel import Session, select
from src.core.config import CONFIG
from src.models.users import User
from .users import UserRepository

class LibrarianRepository(UserRepository):
    def __init__(self, session: Session):
        super().__init__(session)
    
    def get_all(self) -> list[tuple[User, str]]:
        stmt = select(
            User,
            func.pgp_sym_decrypt(User.email, CONFIG.CIPHER_KEY).label("decrypted_email")
        )

        results = self.session.exec(stmt).all()

        response = [
            (user, decrypted_email.tobytes().decode() if isinstance(decrypted_email, memoryview) else decrypted_email)
            for user, decrypted_email in results
        ]

        return response