import api from "./axios"
import type {  GBooksResponse } from "@/types/gbooks"

export const getGBooksRequest = async (q: string): Promise<GBooksResponse> => await api.get("/search-google-books", {
    params: { q }
})