from uuid import UUID
from sqlmodel import Session
from src.schemas.books import BookCopyIn, BookCopyUpdate, BookCopyOut
from src.models import BookCopy
from src.repositories.copies import BookCopyRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class BookCopyService:
    def __init__(self, session: Session):
        self.repository = BookCopyRepository(session)

    def get_book_copy_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            return BookCopyOut.model_validate(result)
        except SQLAlchemyError:
            logger.error(f"Error al obtener la copia del libro {id}", exc_info=True)
            raise ServerError()
        
    def get_all_book_copies(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
            
            return [BookCopyOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener las copia de librociones", exc_info=True)
            raise ServerError()
        
    def get_all_book_copies_from_admin(self):
        try:
            result = self.repository.get_all_from_admin()
            if not result:
                raise NotFound()
            
            return [BookCopyOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener las copia de librociones", exc_info=True)
            raise ServerError()
        
    def get_all_book_copies_available(self):
        try:
            result = self.repository.get_all_available()
            if not result:
                raise NotFound()
            
            return [BookCopyOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener las copia de librociones", exc_info=True)
            raise ServerError()
        
    def get_all_book_copies_available_by_book(self, book_id: UUID):
        try:
            result = self.repository.get_available_by_book(book_id)
            if not result:
                raise NotFound()
            
            return [BookCopyOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener las copia de librociones", exc_info=True)
            raise ServerError()

    def create_book_copy(self, data: BookCopyIn):
        try:
            bookcopy = BookCopy(**data.model_dump())
            self.repository.create(bookcopy)
            return "Copia de libro creado correctamente"
        except IntegrityError:
            logger.error("Copia de libro duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear copia de libro", exc_info=True)
            raise ServerError()
        
    def update_book_copy(self, id: UUID, data: BookCopyUpdate):
        try:
            bookcopy = self.repository.get_by_id(id)
            if not bookcopy:
                raise NotFound()
            new_data = data.model_dump(exclude_unset=True)
            for key, value in new_data.items():
                setattr(bookcopy, key, value)
            result = self.repository.update(bookcopy)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al actualizar la copia del libro: {id}", exc_info=True)
            raise ServerError()
        
    def delete_book_copy(self, id: UUID):
        try:
            bookcopy = self.repository.get_by_id(id)
            if not bookcopy:
                raise NotFound()
            result = self.repository.delete(bookcopy)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar la copia del libro {id}", exc_info=True)
            raise ServerError()
        
    def delete_book_copy_by_book(self, book_id: UUID):
        try:
            result = self.repository.delete_by_book(book_id)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar la copia del libro {book_id}", exc_info=True)
            raise ServerError()
        