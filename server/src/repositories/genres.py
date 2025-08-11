from uuid import UUID
from sqlmodel import Session, select
from src.models import Genre

class GenreRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Genre).where(Genre.id == id, Genre.enabled)
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Genre).where(Genre.enabled)
        return self.session.exec(stmt).all()
    
    def get_all_from_admin(self):
        stmt = select(Genre)
        return self.session.exec(stmt).all()
    
    def get_by_name(self, name: str):
        stmt = select(Genre).where(Genre.name == name, Genre.enabled)
        return self.session.exec(stmt).first()
    
    def create(self, genre: Genre):
        self.session.add(genre)
        self.session.commit()
        return genre
    
    def update(self, genre: Genre):
        self.session.add(genre)
        self.session.commit()
        self.session.refresh(genre)
        return genre
    
    def delete(self, genre: Genre):
        genre.enabled = False
        self.session.add(genre)
        self.session.commit()
        self.session.refresh(genre)
        return "Genre deleted successfully"