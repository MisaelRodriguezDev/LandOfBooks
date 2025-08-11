import api from "./axios";
import type { CreateGenreFormData, UpdateGenreFormData } from "@/schemas/genres";
import type { UUID } from "crypto";

export const getAllGenresRequest = async () => await api.get("/genres")
export const getAllGenresFromAdminRequest = async () => await api.get("/genres/admin")
export const createGenreRequest = async (data: CreateGenreFormData) => await api.post("/genres", data)
export const updateGenreRequest = async (id: UUID, data: UpdateGenreFormData) => await api.patch(`/genres/${id}`, data)
export const deleteGenreRequest = async (id: UUID) => await api.delete(`genres/${id}`)