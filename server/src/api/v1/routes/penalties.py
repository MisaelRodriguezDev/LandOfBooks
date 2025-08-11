from uuid import UUID
from fastapi import APIRouter, Depends
from src.services.penalties import PenaltyService
from src.schemas.penalties import PenaltyIn, PenaltyUpdate, PenaltyOut
from src.exceptions.exceptions import PROTECTED_GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin

router = APIRouter(prefix='/penalties', tags=['Penalties'])

@router.get('', responses=PROTECTED_GET_RESPONSES)
def get_all_penalties(service: PenaltyService = Depends(get_service(PenaltyService))):
    penalties = service.get_all_penalties()
    return ApiResponse(data=penalties)

@router.get('/{id}', responses=PROTECTED_GET_RESPONSES)
def get_penalty_by_id(id: UUID, service: PenaltyService = Depends(get_service(PenaltyService))):
    penalty = service.get_penalty_by_id(id)
    return ApiResponse(data=penalty)

@router.post('', response_model=ApiResponse[str], responses=POST_RESPONSES)
def create_penalty(data: PenaltyIn ,service: PenaltyService = Depends(get_service(PenaltyService))):
    response = service.create_penalty(data)
    return ApiResponse(data=response)

@router.patch('/{id}', response_model=ApiResponse, responses=PUT_RESPONSES)
def update_penalty(id: UUID, data: PenaltyUpdate, service: PenaltyService = Depends(get_service(PenaltyService))):
    penalty = service.update_penalty(id, data)
    return ApiResponse(data=penalty)

@router.delete('/{id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def delete_penalty(id: UUID, service: PenaltyService = Depends(get_service(PenaltyService))):
    response = service.delete_penalty(id)
    return ApiResponse(data=response)