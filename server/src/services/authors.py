from uuid import UUID
from sqlmodel import Session
from src.schemas.authors import AuthorIn, AuthorUpdate, AuthorOut
from src.models import Author
from src.repositories.authors import AuthorRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class AuthorService:
    def __init__(self, session: Session):
        self.repository = AuthorRepository(session)

    def get_author_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound(id)
            return AuthorOut.model_validate(result)
        except SQLAlchemyError:
            logger.error(f"Error al obtener el autore {id}", exc_info=True)
            raise ServerError()
        
    def get_all_authors(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
            
            return [AuthorOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener los autores", exc_info=True)
            raise ServerError()

    def create_author(self, data: AuthorIn):
        try:
            author = Author(**data.model_dump())
            self.repository.create(author)
            return "Usuario creado correctamente"
        except IntegrityError:
            logger.error("Usuario duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear usuario", exc_info=True)
            raise ServerError()
        
    def update_author(self, id: UUID, data: AuthorUpdate):
        try:
            author = self.repository.get_by_id(id)
            if not author:
                raise NotFound()
            new_data = data.model_dump(exclude_unset=True)
            for key, value in new_data.items():
                setattr(author, key, value)
            result = self.repository.update(author)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al actualizar el autore: {id}", exc_info=True)
            raise ServerError()
        
    def delete_author(self, id: UUID):
        try:
            author = self.repository.get_by_id(id)
            if not author:
                raise NotFound()
            result = self.repository.delete(author)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar el autore {id}", exc_info=True)
            raise ServerError()