from uuid import UUID
from sqlmodel import Session, select
from src.models import Loan
from src.schemas.loans import LoanStatus as Status


class LoanRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Loan).where(Loan.id == id, Loan.enabled)
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Loan).where(Loan.enabled)
        return self.session.exec(stmt).all()
    
    def get_by_user(self, user_id: UUID):
        stmt = select(Loan).where(Loan.user_id == user_id, Loan.enabled)
        return self.session.exec(stmt).all()
    
    def create(self, loan: Loan):
        self.session.add(loan)
        self.session.commit(loan)
        return loan
    
    def update(self, loan: Loan):
        self.session.add(loan)
        self.session.commit()
        self.session.refresh(loan)
        return loan
    
    def delete(self, loan: Loan):
        loan.enabled = False
        self.session.add(loan)
        self.session.commit()
        return 'Loan deleted successfully'
    
    def update_status(self, loan: Loan, status: Status):
        loan.status = status
        self.session.add(loan)
        self.session.commit()
        self.session.refresh(loan)
        return loan