from uuid import UUID
from fastapi import APIRouter, Depends
from src.services.reservations import ReservationService
from src.schemas.reservations import ReservationIn, ReservationUpdate, ReservationOut
from src.exceptions.exceptions import PROTECTED_GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin

router = APIRouter(prefix='/reservations', tags=['Reservations'])

@router.get('', responses=PROTECTED_GET_RESPONSES)
def get_all_reservations(service: ReservationService = Depends(get_service(ReservationService))):
    reservations = service.get_all_reservations()
    return ApiResponse(data=reservations)

@router.get('/{id}',  responses=PROTECTED_GET_RESPONSES)
def get_reservation_by_id(id: UUID, service: ReservationService = Depends(get_service(ReservationService))):
    reservation = service.get_reservation_by_id(id)
    return ApiResponse(data=reservation)

@router.post('', response_model=ApiResponse[str], responses=POST_RESPONSES)
def create_reservation(data: ReservationIn ,service: ReservationService = Depends(get_service(ReservationService))):
    response = service.create_reservation(data)
    return ApiResponse(data=response)

@router.patch('/{id}', response_model=ApiResponse, responses=PUT_RESPONSES)
def update_reservation(id: UUID, data: ReservationUpdate, service: ReservationService = Depends(get_service(ReservationService))):
    reservation = service.update_reservation(id, data)
    return ApiResponse(data=reservation)

@router.delete('/{id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def delete_reservation(id: UUID, service: ReservationService = Depends(get_service(ReservationService))):
    response = service.delete_reservation(id)
    return ApiResponse(data=response)