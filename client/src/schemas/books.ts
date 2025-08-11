import { z } from "zod";

export const createBookSchema = z.object({
  isbn: z.string()
    .min(10, "Debe tener al menos 10 caracteres")
    .max(13, "Debe tener máximo 13 caracteres"),
  title: z.string()
    .min(5, "Debe tener al menos 5 caracteres")
    .max(100, "Debe tener máximo 100 caracteres"),
  description: z.string()
    .min(50, "Debe tener al menos 50 caracteres")
    .max(500, "Debe tener máximo 500 caracteres"),
  cover: z.string()
    .min(50, "Debe tener al menos 50 caracteres")
    .max(255, "Debe tener máximo 255 caracteres"),
  year_of_publication: z.number()
    .min(0, "Debe ser mayor o igual a 0")
    .max(2100, "Debe ser menor o igual a 2100"),
  publisher_id: z.string().uuid("Debe ser un UUID válido"),
  author_ids: z.array(z.string().uuid("Debe ser un UUID válido")),
  genre_ids: z.array(z.string().uuid("Debe ser un UUID válido")),
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookFormData = z.infer<typeof createBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
