import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(50, 'La contraseña solo puede tener 50 caracteres o menos')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial')
  .refine((val) => {
    // Validar que no tenga números consecutivos como 12, 45...
    const numbers = val.match(/\d+/g);
    if (numbers) {
      for (const group of numbers) {
        for (let i = 1; i < group.length; i++) {
          const a = parseInt(group[i - 1], 10);
          const b = parseInt(group[i], 10);
          if (a + 1 === b) return false;
        }
      }
    }
    return true;
  }, {
    message: 'No se permiten números consecutivos en la contraseña',
  })
  .refine((val) => {
    // Validar que no tenga letras consecutivas como ab, cd...
    const letters = val.toLowerCase().split('');
    for (let i = 1; i < letters.length; i++) {
      const a = letters[i - 1];
      const b = letters[i];
      if (/[a-z]/.test(a) && /[a-z]/.test(b) && a.charCodeAt(0) + 1 === b.charCodeAt(0)) {
        return false;
      }
    }
    return true;
  }, {
    message: 'No se permiten letras consecutivas en la contraseña',
  });

export const registerSchema = z.object({
  first_name: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  last_name: z.string().min(5, 'El apellido debe tener al menos 5 caracteres'),
  username: z.string().min(6, 'El nick debe tener al menos 6 caracteres'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  confirm_password: z.string(),
  recaptcha: z.string().min(1, 'Debes verificar que no eres un robot')
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});



export const loginSchema = z.object({
  username: z.string().min(6, 'El nick es requerido').max(50, 'El usuario es muy largo'),
  password: passwordSchema,
  recaptcha: z.string().min(1, 'Debes verificar que no eres un robot')
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;