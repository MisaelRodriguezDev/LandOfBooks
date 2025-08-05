from uuid import UUID
from sqlmodel import Session
from src.schemas.reservations import ReservationIn, ReservationUpdate, ReservationOut
from src.models import Reservation
from src.repositories.reservations import ReservationRepository
from src.exceptions.exceptions import ConflictError, ServerError, NotFound, BadRequest
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from src.libs.logger import logger

class ReservationService:
    def __init__(self, session: Session):
        self.repository = ReservationRepository(session)

    def get_reservation_by_id(self, id: UUID):
        try:
            result = self.repository.get_by_id(id)
            if not result:
                raise NotFound()
            return ReservationOut.model_validate(result)
        except SQLAlchemyError:
            logger.error(f"Error al obtener la reservación {id}", exc_info=True)
            raise ServerError()
        
    def get_all_reservations(self):
        try:
            result = self.repository.get_all()
            if not result:
                raise NotFound()
            
            return [ReservationOut.model_validate(res) for res in result]
        except SQLAlchemyError:
            logger.error("Error al obtener las reservaciones", exc_info=True)
            raise ServerError()

    def create_reservation(self, data: ReservationIn):
        try:
            reservation = Reservation(**data.model_dump())
            self.repository.create(reservation)
            return "Reserva creado correctamente"
        except IntegrityError:
            logger.error("Reserva duplicado", exc_info=True)
            raise ConflictError()
        except SQLAlchemyError:
            logger.error("Error al crear reserva", exc_info=True)
            raise ServerError()
        
    def update_reservation(self, id: UUID, data: ReservationUpdate):
        try:
            reservation = self.repository.get_by_id(id)
            if not reservation:
                raise NotFound()
            new_data = data.model_dump(exclude_unset=True)
            for key, value in new_data.items():
                setattr(reservation, key, value)
            result = self.repository.update(reservation)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al actualizar la reservación: {id}", exc_info=True)
            raise ServerError()
        
    def delete_reservation(self, id: UUID):
        try:
            reservation = self.repository.get_by_id(id)
            if not reservation:
                raise NotFound()
            result = self.repository.delete(reservation)
            return result
        except SQLAlchemyError:
            logger.error(f"Error al eliminar la reservación {id}", exc_info=True)
            raise ServerError()
        