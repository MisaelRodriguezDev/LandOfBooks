import api from  "./axios"
import type { GetUser, UserUpdate } from "@/types/user"

export const userProfileRequest = async (): Promise<GetUser> => await api.get("users/me")
export const updateUserProfile = async(data: UserUpdate) => await api.patch(`users`, data)
