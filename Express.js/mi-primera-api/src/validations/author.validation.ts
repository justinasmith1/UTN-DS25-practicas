import { z } from "zod";

// helper: convierte null/"" a undefined
const toUndef = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((v) => (v === null || v === "" ? undefined : v), schema);
// CREATE
export const AuthorCreateSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
});

export type CreateAuthorInput = z.infer<typeof AuthorCreateSchema>; 
// UPDATE (al menos un campo)
export const AuthorUpdateSchema = z
    .object({
        name: z.string().min(1).optional(),
    })
    .refine((d) => Object.values(d).some((v) => v !== undefined), {
        message: "Debes enviar al menos un campo para actualizar",
        });

export type UpdateAuthorInput = z.infer<typeof AuthorUpdateSchema>;
