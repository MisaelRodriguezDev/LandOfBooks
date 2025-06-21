from sqlmodel import Session
from src.models.users import User
from .librarian import LibrarianRepository

class AdminRepository(LibrarianRepository):
    def __init__(self, session: Session):
        super().__init__(session)
    
