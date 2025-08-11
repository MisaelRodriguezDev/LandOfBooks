import type { UUID } from "crypto";
import api from "./axios";
import type { CreatePublisherFormData, UpdatePublisherFormData } from "@/schemas/publishers";
import type { GetAllPublishersResponse } from "@/types/publishers";

export const getAllPublishersRequest = async (): Promise<GetAllPublishersResponse> => await api.get("/publishers")
export const getAllPublishersFromAdminRequest = async (): Promise<GetAllPublishersResponse> => await api.get("/publishers")
export const createPublisherRequest = async (data: CreatePublisherFormData) => await api.post("/publishers", data)
export const updatePublisherRequest = async (id: UUID, data: UpdatePublisherFormData) => await api.patch(`/publishers/${id}`, data)
export const deletePublisherRequest = async (id: UUID) => await api.delete(`/publishers/${id}`)