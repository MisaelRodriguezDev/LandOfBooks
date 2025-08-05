import api from  "./axios"
import type { GetAllUsers } from "@/types/user"

export const getAllUsers = async(): Promise<GetAllUsers> => await api.get('librarian/users')