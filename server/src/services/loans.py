from uuid import UUID
from sqlmodel import Session
from src.schemas.loans import LoanIn, LoanUpdate, LoanOut, LoanStatus
from src.models import Loan
from src.repositories.loans import LoanRepository
from .copies import BookCopyService
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class LoanService:
    def __init__(self, session: Session):
        self.repository = LoanRepository(session)
        self.book_copy_service = BookCopyService(session)

    def get_loan_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            return LoanOut.model_validate(result)
        except SQLAlchemyError:
            logger.error(f"Error al obtener el préstamo {id}", exc_info=True)
            raise ServerError()
        
    def get_all_loans(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
            
            return [LoanOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener los préstamos", exc_info=True)
            raise ServerError()
        
    def get_loans_by_user(self, user_id: UUID):
        try:
            result = self.repository.get_by_user(user_id)
            if not result:
                raise NotFound()
            
            return [LoanOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener los préstamos", exc_info=True)
            raise ServerError()        

    def create_loan(self, data: LoanIn, user_id: UUID):
        try:
            book_copy = self.book_copy_service.get_all_book_copies_available_by_book(data.book_id)
            loan = Loan(**data.model_dump(exclude={'book_id'}), user_id=user_id, copy_id=book_copy[0].id)
            self.repository.create(loan)
            return "Préstamo creado correctamente"
        except IntegrityError:
            logger.error("Préstamo duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear préstamo", exc_info=True)
            raise ServerError()
        
    def update_loan(self, id: UUID, data: LoanUpdate, user_id: UUID | None = None):
        try:
            LoanUpdate()
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
            if user_id:
                loan.user_id = user_id
            new_data = data.model_dump(exclude_unset=True)
            for key, value in new_data.items():
                setattr(loan, key, value)
            result = self.repository.update(loan)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al actualizar el préstamo: {id}", exc_info=True)
            raise ServerError()
        
    def delete_loan(self, id: UUID):
        try:
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
            result = self.repository.delete(loan)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar el préstamo {id}", exc_info=True)
            raise ServerError()
        
    def active_loan(self, id: UUID):
        try:
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
            result = self.repository.update_status(loan, LoanStatus.ACTIVE)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al activar el préstamo {id}", exc_info=True)
            raise ServerError()
        
    def cancel_loan(self, id: UUID):
        try:
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
            result = self.repository.update_status(loan, LoanStatus.CANCELED)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al cancelar el préstamo {id}", exc_info=True)
            raise ServerError()
        
    def mark_loan_as_returned(self, id: UUID):
        try:
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
            result = self.repository.update_status(loan, LoanStatus.RETURNED)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al devolver el préstamo {id}", exc_info=True)
            raise ServerError()
    
    def mark_loan_as_overdue(self, id: UUID):
        try:
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
            result = self.repository.update_status(loan, LoanStatus.OVERDUE)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al devolver el préstamo {id}", exc_info=True)
            raise ServerError()