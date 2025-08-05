import api from  "./axios"
import type { CreateUserResponse, UpdateUserFromAdminResponse } from "@/types/admin"
import type { CreateUserFromAdminFormData } from "@/schemas/admin"
import type { UpdateUserFormData } from "@/schemas/user"
import type { UUID } from "crypto"

export const createUserRequest = async(data: CreateUserFromAdminFormData): Promise<CreateUserResponse> => await api.post('admin/users', data);
export const updateUserRequest = async(id: UUID, data: UpdateUserFormData): Promise<UpdateUserFromAdminResponse> => await api.patch(`admin/users/${id}`, data);
export const deleteUserFromAdminRequest = async(id: UUID) => await api.delete(`admin/users/${id}`)