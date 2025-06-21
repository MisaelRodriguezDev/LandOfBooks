from fastapi import APIRouter, Depends
from src.services.librarian import LibrarianService
from src.schemas.users import UserOut
from src.exceptions.exceptions import GET_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_librarian_service, get_current_active_account

router = APIRouter(prefix="/librarian", tags=["librarian"])

@router.get("/users",response_model=ApiResponse[list[UserOut]], responses=GET_RESPONSES)
async def get_all(service: LibrarianService = Depends(get_librarian_service)):
    users = service.list_users()
    return ApiResponse(data=users)