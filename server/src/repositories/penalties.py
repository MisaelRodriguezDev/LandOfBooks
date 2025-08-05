from uuid import UUID
from sqlmodel import Session, select
from src.models import Penalty

class PenaltyRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Penalty).where(Penalty.id == id, Penalty.enabled)
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Penalty).where(Penalty.enabled)
        return self.session.exec(stmt).all()
    
    def get_by_user(self, user_id: UUID):
        stmt = select(Penalty).where(Penalty.user_id == user_id, Penalty.enabled)
        return self.session.exec(stmt).all()
    
    def create(self, penalty: Penalty):
        self.session.add(penalty)
        self.session.commit(penalty)
        return penalty
    
    def update(self, penalty: Penalty):
        self.session.add(penalty)
        self.session.commit()
        self.session.refresh(penalty)
        return penalty
    
    def delete(self, penalty: Penalty):
        penalty.enabled = False
        self.session.add(penalty)
        self.session.commit()
        return 'Penalty deleted successfully'