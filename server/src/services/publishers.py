from uuid import UUID
from sqlmodel import Session
from src.schemas.publishers import PublisherIn, PublisherUpdate, PublisherOut
from src.models import Publisher
from src.repositories.publishers import PublisherRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class PublisherService:
    def __init__(self, session: Session):
        self.repository = PublisherRepository(session)

    def get_publisher_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            return PublisherOut.model_validate(result)
        except SQLAlchemyError:
            logger.error(f"Error al obtener el editorial {id}", exc_info=True)
            raise ServerError()
        
    def get_all_publishers(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
            
            return [PublisherOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener los editoriales", exc_info=True)
            raise ServerError()
        
    def get_all_publishers_from_admin(self):
        try:
            result = self.repository.get_all_from_admin()
            if not result:
                raise NotFound()
            
            return [PublisherOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener los editoriales", exc_info=True)
            raise ServerError()

    def create_publisher(self, data: PublisherIn):
        try:
            publisher = Publisher(**data.model_dump())
            self.repository.create(publisher)
            return "Editorial creado correctamente"
        except IntegrityError:
            logger.error("Editorial duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear editorial", exc_info=True)
            raise ServerError()
        
    def update_publisher(self, id: UUID, data: PublisherUpdate):
        try:
            publisher = self.repository.get_by_id(id)
            if not publisher:
                raise NotFound()
            new_data = data.model_dump(exclude_unset=True)
            for key, value in new_data.items():
                setattr(publisher, key, value)
            result = self.repository.update(publisher)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al actualizar el editorial: {id}", exc_info=True)
            raise ServerError()
        
    def delete_publisher(self, id: UUID):
        try:
            publisher = self.repository.get_by_id(id)
            if not publisher:
                raise NotFound()
            result = self.repository.delete(publisher)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar el editorial {id}", exc_info=True)
            raise ServerError()
        