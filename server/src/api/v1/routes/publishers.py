from uuid import UUID
from fastapi import APIRouter, Depends
from src.services.publishers import PublisherService
from src.schemas.publishers import PublisherIn, PublisherUpdate, PublisherOut
from src.exceptions.exceptions import GET_RESPONSES, PROTECTED_GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin

router = APIRouter(prefix='/publishers', tags=['Publishers'])

@router.get('', responses=GET_RESPONSES)
def get_all_publishers(service: PublisherService = Depends(get_service(PublisherService))):
    publishers = service.get_all_publishers()
    return ApiResponse(data=publishers)

@router.get('/admin', responses=GET_RESPONSES)
def get_all_publishers(
    service: PublisherService = Depends(get_service(PublisherService)),
    _ = Depends(is_librarian_or_admin)
):
    publishers = service.get_all_publishers_from_admin()
    return ApiResponse(data=publishers)

@router.get('/{id}', responses=GET_RESPONSES)
def get_publisher_by_id(id: UUID, service: PublisherService = Depends(get_service(PublisherService))):
    publisher = service.get_publisher_by_id(id)
    return ApiResponse(data=publisher)

@router.post('', response_model=ApiResponse[str], responses=POST_RESPONSES)
def create_publisher(data: PublisherIn ,service: PublisherService = Depends(get_service(PublisherService))):
    response = service.create_publisher(data)
    return ApiResponse(data=response)

@router.patch('/{id}', response_model=ApiResponse, responses=PUT_RESPONSES)
def update_publisher(id: UUID, data: PublisherUpdate, service: PublisherService = Depends(get_service(PublisherService))):
    publisher = service.update_publisher(id, data)
    return ApiResponse(data=publisher)

@router.delete('/{id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def delete_publisher(id: UUID, service: PublisherService = Depends(get_service(PublisherService))):
    response = service.delete_publisher(id)
    return ApiResponse(data=response)