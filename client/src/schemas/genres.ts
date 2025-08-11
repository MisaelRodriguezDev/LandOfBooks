import {z} from "zod";

export const createGenreSchema = z.object({
    name: z.string()
        .min(3, "Debe tenar almenos 3 caracteres.")
        .max(50, "Deber tener máximo 50 caracteres"),
    description: z.string({invalid_type_error: "Debe ser una cadena de texto"}).optional()
});

export const updateGenreSchema = z.object({
    name: z.string()
        .min(3, "Debe tenar almenos 3 caracteres.")
        .max(50, "Deber tener máximo 50 caracteres")
        .optional(),
    description: z.string({invalid_type_error: "Debe ser una cadena de texto"}).optional()
});

export type CreateGenreFormData = z.infer<typeof createGenreSchema>;
export type UpdateGenreFormData = z.infer<typeof updateGenreSchema>;