import type { UUID } from "crypto"
import api from "./axios"
import type { CreateBookFormData, UpdateBookFormData } from "@/schemas/books"

export const getBookByIdRequest = async (bookId: string) => await api.get(`/books/${bookId}`)
export const getBooksRequest = async () => await api.get('/books')
export const searchBooksRequest = async(q:string) => await api.get('/books/search', {params: {q}})
export const createBookRequest = async (data: CreateBookFormData) => await api.post("/books", data)
export const updateBookRequest = async (id: UUID, data: UpdateBookFormData) => await api.patch(`books/${id}`, data)
export const deleteBookRequest = async (id: UUID) => await api.delete(`/books/${id}`)