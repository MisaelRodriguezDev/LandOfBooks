import api from "./axios"

export const getBookByIdRequest = async (bookId: string) => api.get(`/books/${bookId}`)
export const getBooksRequest = async () => api.get('/books')
export const searchBooksRequest = async(q:string) => api.get('/books/search', {params: {q}})