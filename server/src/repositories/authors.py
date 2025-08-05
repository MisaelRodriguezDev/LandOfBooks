from uuid import UUID
from sqlmodel import Session, select
from src.models import Author

class AuthorRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Author).where(Author.id == id, Author.enabled)
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Author).where(Author.enabled)
        return self.session.exec(stmt)
    
    def create(self, author: Author):
        self.session.add(author)
        self.session.commit()
        return author
    
    def update(self, author: Author):
        self.session.add(author)
        self.session.commit()
        self.session.refresh(author)
        return author
    
    def delete(self, author: Author):
        author.enabled = False
        self.session.add(author)
        self.session.commit()
        self.session.refresh(author)
        return "Author deleted successfully"