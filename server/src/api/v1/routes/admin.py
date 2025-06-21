from uuid import UUID
from fastapi import APIRouter, Depends
from src.services.admin import AdminService
from src.schemas.users import UserOut
from src.schemas.admin import UserInFromAdmin, UserUpdateFromAdmin
from src.exceptions.exceptions import POST_RESPONSES, PUT_RESPONSES
from src.core.response import ApiResponse
from src.api.dependencies.dependencies import get_admin_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/users", response_model=ApiResponse[str], responses=POST_RESPONSES)
async def create(data: UserInFromAdmin, service: AdminService = Depends(get_admin_service)):
    response = service.create_user(data)
    return ApiResponse(data=response)

@router.patch("/users/{id}", response_model=ApiResponse[UserOut], responses=PUT_RESPONSES)
async def update(id: UUID, data: UserUpdateFromAdmin, service: AdminService = Depends(get_admin_service)):
    response = service.update_user(id, data)
    return ApiResponse(data=response)


@router.delete("/users/{id}", response_model=ApiResponse[str])
async def delete_user(id: UUID, service: AdminService = Depends(get_admin_service)):
    response = service.delete_user(id)
    return ApiResponse(data=response)