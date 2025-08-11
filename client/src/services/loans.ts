import api from "./axios"

export const createLoanRequest = async (data: unknown) => api.post("/loans", data)