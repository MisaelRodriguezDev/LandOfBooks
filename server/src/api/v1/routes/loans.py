from uuid import UUID
from fastapi import APIRouter, Depends, Query
from src.services.loans import LoanService
from src.schemas.loans import LoanIn, LoanUpdate, LoanOut
from src.schemas.security import SecurityContext
from src.exceptions.exceptions import (
    GET_RESPONSES, 
    POST_RESPONSES, 
    PUT_RESPONSES, 
    DELETE_RESPONSES,
    ForbiddenError
)
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_service, is_librarian_or_admin, get_security_context

router = APIRouter(prefix='/loans', tags=['Loans'])

@router.get('')
def get_all_loans(service: LoanService = Depends(get_service(LoanService)), _ = Depends(is_librarian_or_admin)):
    loans = service.get_all_loans()
    return ApiResponse(data=loans)

@router.get("/{id}")
def get_loan_by_id(id: UUID, service: LoanService = Depends(get_service(LoanService))):
    loan = service.get_loan_by_id(id)
    return ApiResponse(data=loan)

@router.get('/user')
def get_user_loans(
    id: UUID | None = Query(default=None), 
    service: LoanService = Depends(get_service(LoanService)), 
    security: SecurityContext = Depends(get_security_context)
):
    user_id = id or security.user.id

    if id and user_id != security.user.id and not (security.is_admin or security.is_librarian):
        raise ForbiddenError("No tienes permisos para acceder a los préstamos de este usuario")

    loans = service.get_loans_by_user(user_id)
    return ApiResponse(data=loans)

@router.post('')
def create_loan(
    data: LoanIn,
    id: UUID | None = Query(default=None), 
    service: LoanService = Depends(get_service(LoanService)), 
    security: SecurityContext = Depends(get_security_context)
):
    user_id = id or security.user.id

    if id and user_id != security.user.id and not (security.is_admin or security.is_librarian):
        raise ForbiddenError("No tienes permisos para agregar préstamos a este usuario")
    result = service.create_loan(data)
    return ApiResponse(data=result)