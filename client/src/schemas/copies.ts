import { z } from "zod";
import { BCStatus } from "@/types/copies";

const BookCopyStatusSchema = z.enum([
    BCStatus.AVAILABLE,
    BCStatus.LOANED,
    BCStatus.LOST,
    BCStatus.REMOVED
]).default(BCStatus.AVAILABLE)

export const createBookCopySchema = z.object({
    book_id: z
        .string({ required_error: "El campo 'book_id' es obligatorio", invalid_type_error: "El 'book_id' debe ser una cadena" })
        .uuid({ message: "El 'book_id' debe tener un formato UUID válido" }),
    barcode: z.string({invalid_type_error: " El 'barcode' debe ser una cadena"}).optional(),
    status: BookCopyStatusSchema.optional()
});

export const updateBookCopySchema = z.object({
    barcode: z.string({invalid_type_error: " El 'barcode' debe ser una cadena"}).optional(),
    status: BookCopyStatusSchema.optional()
})

export type CreateBookCopyFormData = z.infer<typeof createBookCopySchema>;
export type UpdateBookCopyFormData = z.infer<typeof updateBookCopySchema>;