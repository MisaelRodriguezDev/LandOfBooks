from uuid import UUID
from fastapi import APIRouter, Depends, Query
from src.services.books import BookService
from src.schemas.books import BookIn, BookUpdate, BookOut
from src.exceptions.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin

router = APIRouter(prefix='/books', tags=['Books'])

# Rutas fijas / estáticas - primero
@router.get('/search', response_model=ApiResponse[list[BookOut]], responses=GET_RESPONSES)
def search_books(q: str = Query(...), service: BookService = Depends(get_service(BookService))):
    books = service.search_books(q)
    return ApiResponse(data=books)

@router.get('/by-genre', response_model=ApiResponse[list[BookOut]], responses=GET_RESPONSES)
def get_books_by_genre(genre: str | UUID = Query(...), service: BookService = Depends(get_service(BookService))):
    books = service.get_books_by_genre(genre)
    return ApiResponse(data=books)

@router.get('/by-author', response_model=ApiResponse[list[BookOut]], responses=GET_RESPONSES)
def get_books_by_author(author: str | UUID = Query(...), service: BookService = Depends(get_service(BookService))):
    books = service.get_books_by_author(author)
    return ApiResponse(data=books)

# Ruta raíz sin parámetros
@router.get('', response_model=ApiResponse[list[BookOut]], responses=GET_RESPONSES)
def get_books(service: BookService = Depends(get_service(BookService))):
    books = service.get_all_books()
    return ApiResponse(data=books)

# Rutas que modifican relaciones (deben ir antes que /{id} porque tienen más segmentos)
@router.patch('/{id}/add-genre/{genre_id}', response_model=ApiResponse, responses=PUT_RESPONSES)
def add_genre_to_book(id: UUID, genre_id: UUID, service: BookService = Depends(get_service(BookService)), _ = Depends(is_librarian_or_admin)):
    response = service.add_genre_to_book(id, genre_id)
    return ApiResponse(data=response)

@router.delete('/{id}/remove-genre/{genre_id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def remove_genre_from_book(id: UUID, genre_id: UUID, service: BookService = Depends(get_service(BookService)), _ = Depends(is_librarian_or_admin)):
    response = service.remove_genre_from_book(id, genre_id)
    return ApiResponse(data=response)

@router.patch('/{id}/add-author/{author_id}', response_model=ApiResponse, responses=PUT_RESPONSES)
def add_author_to_book(id: UUID, author_id: UUID, service: BookService = Depends(get_service(BookService)), _ = Depends(is_librarian_or_admin)):
    response = service.add_author_to_book(id, author_id)
    return ApiResponse(data=response)

@router.delete('/{id}/remove-author/{author_id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def remove_author_from_book(id: UUID, author_id: UUID, service: BookService = Depends(get_service(BookService)), _ = Depends(is_librarian_or_admin)):
    response = service.remove_author_from_book(id, author_id)
    return ApiResponse(data=response)

# Rutas con parámetro dinámico - deben ir al final
@router.get('/{id}', response_model=ApiResponse[BookOut], responses=GET_RESPONSES)
def get_book_by_id(id: UUID, service: BookService = Depends(get_service(BookService))):
    book = service.get_book_by_id(id)
    return ApiResponse(data=book)

@router.post('/', response_model=ApiResponse[str], responses=POST_RESPONSES)
def create_book(data: BookIn, service: BookService = Depends(get_service(BookService)), _ = Depends(is_librarian_or_admin)):
    response = service.create_book(data)
    return ApiResponse(data=response)

@router.patch('/{id}', response_model=ApiResponse[BookOut], responses=PUT_RESPONSES)
def update_book(id: UUID, data: BookUpdate, service: BookService = Depends(get_service(BookService)), _ = Depends(is_librarian_or_admin)):
    book = service.update_book(id, data)
    return ApiResponse(data=book)

@router.delete('/{id}', response_model=ApiResponse[str], responses=DELETE_RESPONSES)
def delete_book(id: UUID, service: BookService = Depends(get_service(BookService)), _ = Depends(is_librarian_or_admin)):
    response = service.delete_book(id)
    return ApiResponse(data=response)
