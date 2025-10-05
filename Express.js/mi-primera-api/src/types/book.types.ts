
import { Role } from "@prisma/client";

// ===================
// Autor
// ===================


export interface Author {
  id: number;
  name: string;
  books?: Book[];
}

export interface CreateAuthorRequest {
  name: string;
}

export interface UpdateAuthorRequest {
  name?: string;
}

export interface AuthorResponse {
  author: Author;
  message: string;
}

export interface AuthorsListResponse {
  authors: Author[];
  total: number;
}
// ===================
// Categoria
// ===================

export interface Category {
  id: number;
  name: string;
  books?: Book[];
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export interface CategoryResponse {
  category: Category;
  message: string;
}

export interface CategoriesListResponse {
  categories: Category[];
  total: number;
}

// ===================
// Libro
// ===================

export interface Book {
  id: number;
  title: string;
  img: string | null;
  price: number;
  createdAt: Date;
  published: boolean;
  authorId: number;
  author: Author;            // Relación con autor
  categories: Category[];    // Relación con categorías
}

// Crear libro
export interface CreateBookRequest {
  title: string;
  img?: string | null;
  price: number;
  published?: boolean;
  authorId: number;          // se pasa el ID del autor
  categoryIds?: number[];    // opcional: IDs de categorías
}

// Actualizar libro
export interface UpdateBookRequest {
  title?: string;
  img?: string | null;
  price?: number;
  published?: boolean;
  authorId?: number;
  categoryIds?: number[];
}

// Respuestas
export interface BookResponse {
  book: Book;
  message: string;
}

export interface BooksListResponse {
  books: Book[];
  total: number;
}
