from uuid import UUID
from fastapi import APIRouter, Depends
from src.services.copies import BookCopyService
from src.schemas.books import BookCopyIn, BookCopyUpdate, BookCopyOut, BookCopyStatus
from src.exceptions.exceptions import GET_RESPONSES, POST_RESPONSES, PUT_RESPONSES, DELETE_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin

router = APIRouter(prefix='/copies', tags=['Book Copies'])

@router.get('')
def get_all_book_copies(service: BookCopyService = Depends(get_service(BookCopyService))):
    copies = service.get_all_book_copies()
    return ApiResponse(data=copies)

@router.get('/admin')
def get_all_book_copies(service: BookCopyService = Depends(get_service(BookCopyService))):
    copies = service.get_all_book_copies_from_admin()
    return ApiResponse(data=copies)

@router.get('/{id}')
def get_book_copy_by_id(id: UUID, service: BookCopyService = Depends(get_service(BookCopyService)), _ = Depends(is_librarian_or_admin)):
    copy = service.get_book_copy_by_id(id)
    return ApiResponse(data=copy)

@router.get('/available')
def get_all_book_copies_available(service: BookCopyService = Depends(get_service(BookCopyService))):
    copies = service.get_all_book_copies_available()
    return ApiResponse(data=copies)

@router.get('/{book_id}/available')
def get_all_book_copies_available(book_id: UUID, service: BookCopyService = Depends(get_service(BookCopyService))):
    copies = service.get_all_book_copies_available_by_book(book_id)
    return ApiResponse(data=copies)

@router.post('', responses=POST_RESPONSES)
def create_book_copy(data: BookCopyIn, service: BookCopyService = Depends(get_service(BookCopyService)), _ = Depends(is_librarian_or_admin)):
    response = service.create_book_copy(data)
    return ApiResponse(data=response)

@router.patch('/{id}')
def update_book_copy(id: UUID, data: BookCopyUpdate, service: BookCopyService = Depends(get_service(BookCopyService)), _ = Depends(is_librarian_or_admin)):
    response = service.update_book_copy(id, data)
    return ApiResponse(data=response)

@router.delete('/{id}')
def delete_book_copy(id: UUID, service: BookCopyService = Depends(get_service(BookCopyService)), _ = Depends(is_librarian_or_admin)):
    response = service.delete_book_copy(id)
    return ApiResponse(data=response)