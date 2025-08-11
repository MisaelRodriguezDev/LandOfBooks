import type { UUID } from "crypto";
import api from "./axios";
import type { CreateAuthorFormData, UpdateAuthorFormData } from "@/schemas/authors";
import type { GetAllAuthorResponse } from "@/types/authors";

export const getAllAuthorsRequest = async (): Promise<GetAllAuthorResponse> => await api.get("/authors")
export const getAllAuthorsFromAdminRequest = async (): Promise<GetAllAuthorResponse> => await api.get("/authors/admin")
export const createAuthorRequest = async (data: CreateAuthorFormData) => await api.post("/authors", data)
export const updateAuthorRequest = async (id: UUID, data: UpdateAuthorFormData) => await api.patch(`/authors/${id}`, data)
export const deleteAuthorRequest = async (id: UUID) => await api.delete(`/authors/${id}`)