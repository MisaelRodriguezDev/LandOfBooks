import {z} from "zod";

export const createPublisherSchema = z.object({
    name: z.string()
        .min(5, "Debe tener almenos 5 caracteres")
        .max(50, "Debe tener máximo 50 caracteres"),
    phone: z.string()
        .min(13, "Debe tener 13 caracteres")
        .max(13, "Debe tener 13 caracteres")
        .optional(),
    image_url: z.string()
        .url("Debe ser un enlace válido")
        .max(255, "Debe tener máximo 255 cracteres")
        .optional()
})

export const updatePublisherSchema = z.object({
    name: z.string()
        .min(5, "Debe tener almenos 5 caracteres")
        .max(50, "Debe tener máximo 50 caracteres")
        .optional(),
    phone: z.string()
        .min(13, "Debe tener 13 caracteres")
        .max(13, "Debe tener 13 caracteres")
        .optional(),
    image_url: z.string()
        .url("Debe ser un enlace válido")
        .max(255, "Debe tener máximo 255 cracteres")
        .optional()
});

export type CreatePublisherFormData = z.infer<typeof createPublisherSchema>;
export type UpdatePublisherFormData = z.infer<typeof updatePublisherSchema>;