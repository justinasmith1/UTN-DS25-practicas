import prisma from '../config/prisma';
import { Author, Prisma } from '@prisma/client';
import type { CreateAuthorInput, UpdateAuthorInput } from '../validations/author.validation';
import { Author as AuthorDTO } from '../types/book.types';

// Tipo con relaciones incluidas
type AuthorWithRelations = Prisma.AuthorGetPayload<{
    include: { books: true };
}>;

export async function getAllAuthors(): Promise<AuthorDTO[]> {
    const authors = await prisma.author.findMany({
        orderBy: { id: 'asc' },
        include: { books: true },
    });
    return authors as unknown as AuthorDTO[];
}

export async function getAuthorById(id: number): Promise<AuthorDTO> {
    const author = await prisma.author.findUnique({
        where: { id: Number(id) },
        include: { books: true },
    });  
    if (!author) {
        const err: any = new Error('Autor no encontrado');
        err.statusCode = 404;
        throw err;
    }
    return author as unknown as AuthorDTO;
}

export async function createAuthor(input: CreateAuthorInput): Promise<AuthorDTO> {
    const { name } = input;
    const created = await prisma.author.create({
        data: { name },
        include: { books: true },
    });
    return created as unknown as AuthorDTO;
}  

export async function updateAuthor(id: number, input: UpdateAuthorInput): Promise<AuthorDTO> {
    const { name } = input;
    const author = await prisma.author.findUnique({ where: { id: Number(id) } });
    if (!author) {
        const err: any = new Error('Autor no encontrado');
        err.statusCode = 404;
        throw err;
    }
    const updated = await prisma.author.update({
        where: { id: Number(id) },
        data: { name },
        include: { books: true },
    });
    return updated as unknown as AuthorDTO;
}       

export async function deleteAuthor(id: number): Promise<void> {
    const author = await prisma.author.findUnique({ where: { id: Number(id) } });
    if (!author) {
        const err: any = new Error('Autor no encontrado');
        err.statusCode = 404;
        throw err;
    }
    await prisma.author.delete({ where: { id: Number(id) } });
}
