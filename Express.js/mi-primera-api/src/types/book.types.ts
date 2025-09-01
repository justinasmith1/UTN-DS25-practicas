// ===================
// Tipos del dominio
// ===================

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  posts?: Post[];
  createdAt: Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
}

export interface Author {
  id: number;
  name: string;
  books?: Book[];
}

export interface Category {
  id: number;
  name: string;
  books?: Book[];
}

// ===================
// Book y DTOs
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
