import { Role } from '@prisma/client';
import { email, z } from 'zod';

//Schema para crear usuario
export const createUserSchema = z.object({
    email: z.email('Email invalido')
        .toLowerCase().trim(),
    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
        .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre debe tener como máximo 50 caracteres')
        .trim(),
    role: z.enum(['USER', 'ADMIN', 'MODERATOR'])
        .optional()
        .default('USER')
});

//Schema para actualizar usuario (todos los campos opcionales)
export const updateUserSchema = createUserSchema.partial();