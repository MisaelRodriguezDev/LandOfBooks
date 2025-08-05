from uuid import UUID
from sqlmodel import Session, select
from src.models import Reservation
from src.schemas.reservations import ReservationStatus as Status

class ReservationRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, id: UUID):
        stmt = select(Reservation).where(Reservation.id == id, Reservation.enabled)
        return self.session.exec(stmt).first()
    
    def get_all(self):
        stmt = select(Reservation).where(Reservation.enabled)
        return self.session.exec(stmt).all()
    
    def get_by_user(self, user_id: UUID):
        stmt = select(Reservation).where(Reservation.user_id == user_id, Reservation.enabled)
        return self.session.exec(stmt).all()
    
    def create(self, reservation: Reservation):
        self.session.add(reservation)
        self.session.commit(reservation)
        return reservation
    
    def update(self, reservation: Reservation):
        self.session.add(reservation)
        self.session.commit()
        self.session.refresh(reservation)
        return reservation
    
    def delete(self, reservation: Reservation):
        reservation.enabled = False
        self.session.add(reservation)
        self.session.commit()
        return 'Reservation deleted successfully'
    
    def change_reservation_state(self, reservation: Reservation, state: Status):
        reservation.state = state
        self.session.add(reservation)
        self.session.commit()
        self.session.refresh(reservation)
        return reservation