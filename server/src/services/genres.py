from uuid import UUID
from sqlmodel import Session
from src.schemas.books import GenreIn, GenreUpdate, GenreOut
from src.models import Genre
from src.repositories.genres import GenreRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class GenreService:
    def __init__(self, session: Session):
        self.repository = GenreRepository(session)

    def get_genre_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            return GenreOut.model_validate(result)
        except SQLAlchemyError:
            logger.error(f"Error al obtener el género {id}", exc_info=True)
            raise ServerError()
        
    def get_all_genres(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
            
            return [GenreOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener los géneros", exc_info=True)
            raise ServerError()
    
    def get_all_genres_from_admin(self):
        try:
            result = self.repository.get_all_from_admin()
            if not result:
                raise NotFound()
            
            return [GenreOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener los géneros", exc_info=True)
            raise ServerError()

    def create_genre(self, data: GenreIn):
        try:
            genre = Genre(**data.model_dump())
            self.repository.create(genre)
            return "Género creado correctamente"
        except IntegrityError:
            logger.error("Género duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear género", exc_info=True)
            raise ServerError()
        
    def update_genre(self, id: UUID, data: GenreUpdate):
        try:
            genre = self.repository.get_by_id(id)
            if not genre:
                raise NotFound()
            new_data = data.model_dump(exclude_unset=True)
            for key, value in new_data.items():
                setattr(genre, key, value)
            result = self.repository.update(genre)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al actualizar el género: {id}", exc_info=True)
            raise ServerError()
        
    def delete_genre(self, id: UUID):
        try:
            genre = self.repository.get_by_id(id)
            if not genre:
                raise NotFound()
            result = self.repository.delete(genre)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar el género {id}", exc_info=True)
            raise ServerError()
        