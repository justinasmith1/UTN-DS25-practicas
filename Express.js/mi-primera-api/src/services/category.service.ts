import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";
import type { CreateCategoryInput, UpdateCategoryInput } from "../validations/category.validation";
import { Category as CategoryDTO } from "../types/book.types";

// Tipo con relaciones incluidas
type CategoryWithRelations = Prisma.CategoryGetPayload<{
    include: { books: true };
}>;

export async function getAllCategories(): Promise<CategoryDTO[]> {
    const categories = await prisma.category.findMany({
        orderBy: { id: "asc" },
        include: { books: true },
    });
    return categories as unknown as CategoryDTO[];
}

export async function getCategoryById(id: number): Promise<CategoryDTO> {
    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { books: true },
    }); 
    if (!category) {
        const err: any = new Error("Categoría no encontrada");
        err.statusCode = 404;
        throw err;
    }
    return category as unknown as CategoryDTO;
}   

export async function createCategory(input: CreateCategoryInput): Promise<CategoryDTO> {
    const { name } = input;
    const created = await prisma.category.create({
        data: { name },
        include: { books: true },
    });
    return created as unknown as CategoryDTO;
}

export async function updateCategory(id: number, input: UpdateCategoryInput): Promise<CategoryDTO> {
    const { name } = input;
    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) {
        const err: any = new Error("Categoría no encontrada");
        err.statusCode = 404;
        throw err;
    }
    const updated = await prisma.category.update({
        where: { id: Number(id) },
        data: { name },
        include: { books: true },
    });
    return updated as unknown as CategoryDTO;
}   

export async function deleteCategory(id: number): Promise<void> {
    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) {
        const err: any = new Error("Categoría no encontrada");
        err.statusCode = 404;
        throw err;
    }
    await prisma.category.delete({ where: { id: Number(id) } });
}

