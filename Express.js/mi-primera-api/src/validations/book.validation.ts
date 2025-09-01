// src/schemas/book.schema.ts
import { z } from "zod";

// helper: convierte null/"" a undefined
const toUndef = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((v) => (v === null || v === "" ? undefined : v), schema);

// CREATE
export const BookCreateSchema = z.object({
    title: z.string().min(1, "El título es obligatorio"),
    price: z.coerce.number().int("Debe ser entero").nonnegative(">= 0"), //.coerce = convierte valores antes de validarlos.
    authorId: z.coerce.number().int().positive(),
    categoryIds: z
        .array(z.coerce.number().int().positive())
        .default([])
        .optional()
        .transform((v) => v ?? []),
    img: toUndef(z.string().url("URL inválida").optional()),
    published: z
    .preprocess((v) => (v === null || v === "" ? undefined : v), z.boolean().optional()),
});

export type CreateBookInput = z.infer<typeof BookCreateSchema>;

// UPDATE (al menos un campo)
export const BookUpdateSchema = z
    .object({
        title: z.string().min(1).optional(),
        price: z.coerce.number().int().nonnegative().optional(),
        authorId: z.coerce.number().int().positive().optional(),
        categoryIds: z.array(z.coerce.number().int().positive()).optional(),
        img: toUndef(z.string().url().optional()),
        published: z.preprocess(
            (v) => (v === null || v === "" ? undefined : v),
            z.boolean().optional()
        ),
})
.refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "Debes enviar al menos un campo para actualizar",
});

export type UpdateBookInput = z.infer<typeof BookUpdateSchema>;
