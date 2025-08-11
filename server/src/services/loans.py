from uuid import UUID
from datetime import datetime, timezone
from sqlmodel import Session
from src.schemas.loans import LoanIn, LoanUpdate, LoanOut, LoanStatus
from src.schemas.books import BookCopyStatus
from src.models import Loan
from src.repositories.loans import LoanRepository
from src.repositories.copies import BookCopyRepository
from .copies import BookCopyService
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class LoanService:
    def __init__(self, session: Session):
        self.repository = LoanRepository(session)
        self.book_copy_service = BookCopyService(session)
        self.book_copy_repo = BookCopyRepository(session)

    def get_loan_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            data = result.model_dump()
            data['book_title'] = (
                result.book_copy.book.title 
                if result.book_copy and result.book_copy.book else "Título no disponible"
            )
            data['user'] = (
                f"{result.user.first_name} {result.user.last_name}" 
                if result.user else "Desconocido"
            )
            return LoanOut.model_validate(data)
        except SQLAlchemyError:
            logger.error(f"Error al obtener el préstamo {id}", exc_info=True)
            raise ServerError()
        
    def get_all_loans(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
    
            loans_out = []
            for res in result:
                data = res.model_dump()
                data['book_title'] = (
                    res.book_copy.book.title 
                    if res.book_copy and res.book_copy.book else "Título no disponible"
                )
                data['user'] = (
                    f"{res.user.first_name} {res.user.last_name}" 
                    if res.user else "Desconocido"
                )
                loans_out.append(LoanOut.model_validate(data))
            
            return loans_out
        except SQLAlchemyError:
            logger.error("Error al obtener los préstamos", exc_info=True)
            raise ServerError()

    def get_loans_by_user(self, user_id: UUID):
        try:
            result = self.repository.get_by_user(user_id)
            if not result:
                raise NotFound()
            
            loans_out = []
            for res in result:
                data = res.model_dump()
                data['book_title'] = (
                    res.book_copy.book.title 
                    if res.book_copy and res.book_copy.book else "Título no disponible"
                )
                loans_out.append(LoanOut.model_validate(data))

            return loans_out
        except SQLAlchemyError:
            logger.error("Error al obtener los préstamos", exc_info=True)
            raise ServerError()        

    def create_loan(self, data: LoanIn, user_id: UUID):
        try:
            if not self.repository.user_can_request_loans(user_id):
                raise ConflictError("El usuario tiene préstamos pendientes, activos o vencidos.")
            book_copies = self.book_copy_repo.get_available_by_book(data.book_id)
            if len(book_copies) == 0:
                raise NotFound(message="No hay copias disponibles")
            self.book_copy_repo.update_status(book_copies[0], BookCopyStatus.LOANED)
            loan_data = data.model_dump(exclude={'book_id'})
            loan = Loan(**loan_data, user_id=user_id, copy_id=book_copies[0].id)
            res = self.repository.create(loan)
            return res
        except IntegrityError:
            logger.error("Préstamo duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear préstamo", exc_info=True)
            raise ServerError()
        
    def update_loan(self, id: UUID, data: LoanUpdate):
        try:
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
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
            self._mark_bc_as_available(loan.copy_id)
            result = self.repository.update_status(loan, LoanStatus.CANCELLED)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al cancelar el préstamo {id}", exc_info=True)
            raise ServerError()
        
    def mark_loan_as_returned(self, id: UUID):
        try:
            loan = self.repository.get_by_id(id)
            if not loan:
                raise NotFound()
            self._mark_bc_as_available(loan.copy_id)
            loan.return_date = datetime.now(timezone.utc)
            loan.status = LoanStatus.RETURNED
            result = self.repository.update(loan)
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
            logger.error(f"Error al marcar el préstamo como vencido {id}", exc_info=True)
            raise ServerError()
        
    def _mark_bc_as_available(self, book_copy_id: UUID):
        book_copy = self.book_copy_repo.get_by_id(book_copy_id)
        if not book_copy:
            raise BadRequest()
        self.book_copy_repo.update_status(book_copy, BookCopyStatus.AVAILABLE)
