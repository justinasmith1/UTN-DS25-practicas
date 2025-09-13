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
    where: { id: Number(id) },
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

  const authorExists = await prisma.author.findUnique({ where: { id: Number(authorId) } });
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
      author: { connect: { id: Number(authorId) } },
      ...(categoryIds && categoryIds.length
        ? { categories: { connect: categoryIds.map((id) => ({ id: Number(id) })) } }
        : {}),
    },
    include: { author: true, categories: true },
  });

  return created as unknown as BookDTO;
}

export async function updateBook(id: number, input: UpdateBookInput): Promise<BookDTO> {
  const { title, price, authorId, categoryIds, img, published } = input;

  if (authorId !== undefined) {
    const authorExists = await prisma.author.findUnique({ where: { id: Number(authorId) } });
    if (!authorExists) {
      const err: any = new Error('El autor no existe');
      err.statusCode = 404;
      throw err;
    }
  }

  try {
    const updated = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(published !== undefined ? { published } : {}),
        ...(img !== undefined ? { img } : {}),
        ...(authorId !== undefined ? { author: { connect: { id: Number(authorId) } } } : {}),
        ...(categoryIds !== undefined
          ? { categories: { set: categoryIds.map((cid) => ({ id: Number(cid) })) } }
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
    await prisma.book.delete({ where: { id: Number(id) } });
  } catch (e: any) {
    if (e.code === 'P2025') {
      const err: any = new Error('Libro no encontrado');
      err.statusCode = 404;
      throw err;
    }
    throw e;
  }
}

// Obtener libros destacados (público)
export async function getFeaturedBooks(): Promise<BookDTO[]> {
  const books = await prisma.book.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 5, // Solo los 5 más recientes
    include: { author: true, categories: true },
  });
  return books as unknown as BookDTO[];
}

// Obtener estadísticas de libros (solo para admins)
export async function getBookStats(): Promise<any> {
  try {
    console.log('📊 Obteniendo estadísticas de libros...');
    
    console.log('📚 Contando total de libros...');
    const totalBooks = await prisma.book.count();
    console.log('Total libros:', totalBooks);
    
    console.log('📖 Contando libros publicados...');
    const publishedBooks = await prisma.book.count({ where: { published: true } });
    console.log('Libros publicados:', publishedBooks);
    
    console.log('👤 Contando autores...');
    const totalAuthors = await prisma.author.count();
    console.log('Total autores:', totalAuthors);
    
    console.log('🏷️ Contando categorías...');
    const totalCategories = await prisma.category.count();
    console.log('Total categorías:', totalCategories);
    
    console.log('💰 Calculando precio promedio...');
    const averagePrice = await prisma.book.aggregate({
      _avg: { price: true }
    });
    console.log('Precio promedio:', averagePrice._avg.price);

    const stats = {
      totalBooks,
      publishedBooks,
      unpublishedBooks: totalBooks - publishedBooks,
      totalAuthors,
      totalCategories,
      averagePrice: averagePrice._avg.price || 0
    };
    
    console.log('✅ Estadísticas calculadas:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error en getBookStats:', error);
    throw error;
  }
}