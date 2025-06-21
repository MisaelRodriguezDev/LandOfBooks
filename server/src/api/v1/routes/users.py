from fastapi import APIRouter, Depends, Response

from src.models.users import User
from src.services.users import UserService
from src.schemas.users import UserIn, UserOut, UserUpdate
from src.exceptions.exceptions import GET_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_user_service, get_current_active_account

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=ApiResponse[UserOut], responses=GET_RESPONSES)
async def get_user(current_user: User = Depends(get_current_active_account)):
    return ApiResponse(data=current_user)

@router.post("", response_model=ApiResponse[str])
async def create( data: UserIn, service: UserService = Depends(get_user_service)):
    response = service.create_user(data)

    return ApiResponse(data=response)

@router.patch("", response_model=ApiResponse[UserOut])
async def update(data: UserUpdate, service: UserService = Depends(get_user_service), current_user: User = Depends(get_current_active_account)):
    print("current user",current_user)
    response = service.update_user(current_user.id, data)
    return ApiResponse(data=response)