import {z} from "zod";
import {passwordSchema} from "./auth"
import { Roles } from "@/types/user";

const roleSchema = z.enum([
  Roles.ADMIN,
  Roles.LIBRARIAN,
  Roles.USER
]).default(Roles.USER)

export const createUserFromAdminSchema = z.object({
  first_name: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  last_name: z.string().min(5, 'El apellido debe tener al menos 5 caracteres'),
  username: z.string().min(6, 'El nick debe tener al menos 6 caracteres'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  confirm_password: z.string(),
  role: roleSchema.optional()
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

export const updateUserFromAdminSchema = z.object({
  first_name: z.string().min(5, 'El nombre debe tener al menos 5 cracteres').optional(),
  last_name: z.string().min(5, 'El apellido debe tener al menos 5 cracteres').optional(),
  username: z.string().min(6, 'El nick debe tener al menos 6 cracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  role: roleSchema.optional()
});

export type CreateUserFromAdminFormData = z.infer<typeof createUserFromAdminSchema>;
export type UpdateUserFromAdminFormData = z.infer<typeof updateUserFromAdminSchema>;