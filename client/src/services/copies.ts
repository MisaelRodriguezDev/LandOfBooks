import api from "./axios";
import type { CreateBookCopyFormData, UpdateBookCopyFormData } from "@/schemas/copies";
import type { CreateBookCopyResponse, GetAllBookCopiesAvailableByBookResponse } from "@/types/copies";
import type { UUID } from "crypto";

export const createBookCopyRequest = async (data: CreateBookCopyFormData): Promise<CreateBookCopyResponse> => await api.post("/copies", data)
export const getAllBookCopiesAvailableByBookRequest = async (book_id: UUID)
    : Promise<GetAllBookCopiesAvailableByBookResponse> => await api.get(`/copies/${book_id}/available`)
export const getAllBookCopiesFromAdminRequest = async () => await api.get("copies/admin")
export const updateBookCopyRequest = async (id: UUID, data: UpdateBookCopyFormData) => await api.patch(`/copies/${id}`, data)
export const deleteBookCopyRequest = async (id: UUID) => await api.delete(`/copies/${id}`)