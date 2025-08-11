from uuid import UUID
from sqlmodel import Session, select
from src.models import Publisher

class PublisherRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Publisher).where(Publisher.id == id, Publisher.enabled)
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Publisher).where(Publisher.enabled)
        return self.session.exec(stmt).all()
    
    def get_all_from_admin(self):
        stmt = select(Publisher)
        return self.session.exec(stmt).all()
    
    def create(self, publisher: Publisher):
        self.session.add(publisher)
        self.session.commit(publisher)
        return publisher
    
    def update(self, publisher: Publisher):
        self.session.add(publisher)
        self.session.commit()
        self.session.refresh(publisher)
        return publisher
    
    def delete(self, publisher: Publisher):
        publisher.enabled = False
        self.session.add(publisher)
        self.session.commit()
        return 'Publisher deleted successfully'