import {z} from "zod";

export const createAuthorSchema = z.object({
    first_name: z.string()
        .min(1, "Debe tener almenos 1 caracter")
        .max(50, "Debe tener máximo 50 caracteres"),
    last_name: z.string()
        .min(1, "Debe tener almenos 1 caracter")
        .max(50, "Debe tener máximo 50 caracteres"),
    pseudonym: z.string()
        .max(20, "Debe tener máximo 20 caracteres")
        .optional(),
    photo: z.string()
        .url("No es un enlace válido")
        .max(255, "El enlace debe tener ")
        .optional(),
    birth_date: z.string().optional(),
    biography: z.string().max(2500, "Debe tener máximo 2500 caracteres").optional(),
    nationality: z.string().optional()
});

export const updateAuthorSchema = z.object({
    first_name: z.string()
        .min(1, "Debe tener almenos 1 caracter")
        .max(50, "Debe tener máximo 50 caracteres")
        .optional(),
    last_name: z.string()
        .min(1, "Debe tener almenos 1 caracter")
        .max(50, "Debe tener máximo 50 caracteres")
        .optional(),
    pseudonym: z.string()
        .max(20, "Debe tener máximo 20 caracteres")
        .optional(),
    photo: z.string()
        .url("No es un enlace válido")
        .max(255, "El enlace debe tener ")
        .optional(),
    birth_date: z.string().optional(),
    biography: z.string()
        .max(2500, "Debe tener máximo 2500 caracteres")
        .optional(),
    nationality: z.string().optional()
});

export type CreateAuthorFormData = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorFormData = z.infer<typeof updateAuthorSchema>;