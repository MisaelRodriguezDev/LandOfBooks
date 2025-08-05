import api from "./axios"
import type { LoanIn } from "@/types/loans"

export const createLoanRequest = async (data: LoanIn) => api.post("/loans", data)