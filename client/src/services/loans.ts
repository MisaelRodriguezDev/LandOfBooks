import api from "./axios"

export const createLoanRequest = async (data) => api.post("/loans", data)