// src/services/book.service.ts
import prisma from '../config/prisma';
import { Prisma } from '@prisma/client'; // si generaste en ruta custom, ajusta el import
import type { CreateBookInput, UpdateBookInput } from '../validations/book.validation';
import { Book as BookDTO } from '../types/book.types';

// Tipo con relaciones incluidas
type BookWithRelations = Prisma.BookGetPayload<{
  include: { author: true; categories: true };
}>;

export async function getAllBooks(): Promise<BookDTO[]> {
  const books = await prisma.book.findMany({
    orderBy: { id: 'asc' },
    include: { author: true, categories: true },
  });
  return books as unknown as BookDTO[];
}

export async function getBookById(id: number): Promise<BookDTO> {
  const book = await prisma.book.findUnique({
    where: { id },
    include: { author: true, categories: true },
  });
  if (!book) {
    const err: any = new Error('Libro no encontrado');
    err.statusCode = 404;
    throw err;
  }
  return book as unknown as BookDTO;
}

export async function createBook(input: CreateBookInput): Promise<BookDTO> {
  const { title, price, authorId, categoryIds, img, published } = input;

  const authorExists = await prisma.author.findUnique({ where: { id: authorId } });
  if (!authorExists) {
    const err: any = new Error('El autor no existe');
    err.statusCode = 404;
    throw err;
  }

  const created = await prisma.book.create({
    data: {
      title,
      price,                         // Int en schema (ya validado por Zod)
      published,                     // boolean | undefined (nunca null)
      img,                           // string | undefined (nunca null/"")
      author: { connect: { id: authorId } },
      ...(categoryIds && categoryIds.length
        ? { categories: { connect: categoryIds.map((id) => ({ id })) } }
        : {}),
    },
    include: { author: true, categories: true },
  });

  return created as unknown as BookDTO;
}

export async function updateBook(id: number, input: UpdateBookInput): Promise<BookDTO> {
  const { title, price, authorId, categoryIds, img, published } = input;

  if (authorId !== undefined) {
    const authorExists = await prisma.author.findUnique({ where: { id: authorId } });
    if (!authorExists) {
      const err: any = new Error('El autor no existe');
      err.statusCode = 404;
      throw err;
    }
  }

  try {
    const updated = await prisma.book.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(published !== undefined ? { published } : {}),
        ...(img !== undefined ? { img } : {}),
        ...(authorId !== undefined ? { author: { connect: { id: authorId } } } : {}),
        ...(categoryIds !== undefined
          ? { categories: { set: categoryIds.map((cid) => ({ id: cid })) } }
          : {}),
      },
      include: { author: true, categories: true },
    });

    return updated as unknown as BookDTO;
  } catch (e: any) {
    if (e.code === 'P2025') {
      const err: any = new Error('Libro no encontrado');
      err.statusCode = 404;
      throw err;
    }
    throw e;
  }
}

export async function deleteBook(id: number): Promise<void> {
  try {
    await prisma.book.delete({ where: { id } });
  } catch (e: any) {
    if (e.code === 'P2025') {
      const err: any = new Error('Libro no encontrado');
      err.statusCode = 404;
      throw err;
    }
    throw e;
  }
}
