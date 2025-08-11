from uuid import UUID
from sqlmodel import Session, select, or_
from sqlalchemy.orm import selectinload
from src.models import Loan
from src.schemas.loans import LoanStatus as Status


class LoanRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Loan).where(Loan.id == id, Loan.enabled).options(
            selectinload(Loan.book_copy),
            selectinload(Loan.user)
        )
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Loan).where(Loan.enabled).options(
            selectinload(Loan.book_copy),
            selectinload(Loan.user)
        )
        return self.session.exec(stmt).all()
    
    def get_by_user(self, user_id: UUID):
        stmt = select(Loan).where(Loan.user_id == user_id, Loan.enabled).options(
            selectinload(Loan.book_copy)
        )
        return self.session.exec(stmt).all()
    
    def user_can_request_loans(self, user_id: UUID):
        stmt = select(Loan).where(
            Loan.user_id == user_id, 
            Loan.enabled, 
            or_(Loan.status == Status.PENDING, Loan.status == Status.OVERDUE, Loan.status == Status.ACTIVE)
        )
        result = self.session.exec(stmt).all()
        return  False if len(result) > 0 else True
    
    def create(self, loan: Loan):
        self.session.add(loan)
        self.session.commit()
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