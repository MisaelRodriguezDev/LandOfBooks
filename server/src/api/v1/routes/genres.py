from uuid import UUID
from fastapi import APIRouter, Depends
from src.services.genres import GenreService
from src.schemas.books import GenreIn, GenreUpdate, GenreOut
from src.exceptions.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin

router = APIRouter(prefix='/genres', tags=['Genres'])

@router.get('', response_model=ApiResponse[list[GenreOut]], responses=GET_RESPONSES)
def get_all_genres(service: GenreService = Depends(get_service(GenreService))):
    genres = service.get_all_genres()
    return ApiResponse(data=genres)

@router.get('/admin', response_model=ApiResponse[list[GenreOut]], responses=GET_RESPONSES)
def get_all_genres(service: GenreService = Depends(get_service(GenreService))):
    genres = service.get_all_genres_from_admin()
    return ApiResponse(data=genres)

@router.get('/{id}', response_model=ApiResponse[GenreOut], responses=GET_RESPONSES)
def get_genre_by_id(id: UUID, service: GenreService = Depends(get_service(GenreService))):
    genre = service.get_genre_by_id(id)
    return ApiResponse(data=genre)

@router.post('', response_model=ApiResponse[str], responses=POST_RESPONSES)
def create_genre(data: GenreIn ,service: GenreService = Depends(get_service(GenreService)), _ = Depends(is_librarian_or_admin)):
    response = service.create_genre(data)
    return ApiResponse(data=response)

@router.patch('/{id}', response_model=ApiResponse, responses=PUT_RESPONSES)
def update_genre(id: UUID, data: GenreUpdate, service: GenreService = Depends(get_service(GenreService)), _ = Depends(is_librarian_or_admin)):
    genre = service.update_genre(id, data)
    return ApiResponse(data=genre)

@router.delete('/{id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def delete_genre(id: UUID, service: GenreService = Depends(get_service(GenreService)), _ = Depends(is_librarian_or_admin)):
    response = service.delete_genre(id)
    return ApiResponse(data=response)