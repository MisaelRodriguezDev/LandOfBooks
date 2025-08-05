from uuid import UUID
from fastapi import APIRouter, Depends
from src.services.authors import AuthorService
from src.schemas.authors import AuthorIn, AuthorUpdate, AuthorOut
from src.exceptions.exceptions import PROTECTED_GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin

router = APIRouter(prefix='/authors', tags=['Authors'], dependencies=[Depends(is_librarian_or_admin)])

@router.get('', response_model=ApiResponse[list[AuthorOut]], responses=PROTECTED_GET_RESPONSES)
def get_all_authors(service: AuthorService = Depends(get_service(AuthorService))):
    authors = service.get_all_authors()
    return ApiResponse(data=authors)

@router.get('/{id}', response_model=ApiResponse[AuthorOut], responses=PROTECTED_GET_RESPONSES)
def get_author_by_id(id: UUID, service: AuthorService = Depends(get_service(AuthorService))):
    author = service.get_author_by_id(id)
    return ApiResponse(data=author)

@router.post('', response_model=ApiResponse[str], responses=POST_RESPONSES)
def create_author(data: AuthorIn ,service: AuthorService = Depends(get_service(AuthorService))):
    response = service.create_author(data)
    return ApiResponse(data=response)

@router.patch('/{id}', response_model=ApiResponse, responses=PUT_RESPONSES)
def update_author(id: UUID, data: AuthorUpdate, service: AuthorService = Depends(get_service(AuthorService))):
    author = service.update_author(id, data)
    return ApiResponse(data=author)

@router.delete('/{id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def delete_author(id: UUID, service: AuthorService = Depends(get_service(AuthorService))):
    response = service.delete_author(id)
    return ApiResponse(data=response)