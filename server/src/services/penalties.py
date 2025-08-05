from uuid import UUID
from sqlmodel import Session
from src.schemas.penalties import PenaltyIn, PenaltyUpdate, PenaltyOut
from src.models import Penalty
from src.repositories.penalties import PenaltyRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class PenaltyService:
    def __init__(self, session: Session):
        self.repository = PenaltyRepository(session)

    def get_penalty_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            return PenaltyOut.model_validate(result)
        except SQLAlchemyError:
            logger.error(f"Error al obtener la multa {id}", exc_info=True)
            raise ServerError()
        
    def get_all_penalties(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
            
            return [PenaltyOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener las multaciones", exc_info=True)
            raise ServerError()

    def create_penalty(self, data: PenaltyIn):
        try:
            penalty = Penalty(**data.model_dump())
            self.repository.create(penalty)
            return "Multa creada correctamente"
        except IntegrityError:
            logger.error("Multa duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear multa", exc_info=True)
            raise ServerError()
        
    def update_penalty(self, id: UUID, data: PenaltyUpdate):
        try:
            penalty = self.repository.get_by_id(id)
            if not penalty:
                raise NotFound()
            new_data = data.model_dump(exclude_unset=True)
            for key, value in new_data.items():
                setattr(penalty, key, value)
            result = self.repository.update(penalty)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al actualizar la multa: {id}", exc_info=True)
            raise ServerError()
        
    def delete_penalty(self, id: UUID):
        try:
            penalty = self.repository.get_by_id(id)
            if not penalty:
                raise NotFound()
            result = self.repository.delete(penalty)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar la multa {id}", exc_info=True)
            raise ServerError()
        