import { Book, CreateBookRequest, UpdateBookRequest } from 
'../types/book.types';

// Mock data (próxima clase: PostgreSQL real)
let books: Book[] = [
    { id: 1, title: 'Don Quixote', author: 'Cervantes', 
        price: 1500, createdAt: new Date() },
    { id: 2, title: '1984', author: 'Orwell', 
        price: 1200, createdAt: new Date() }
];
export async function getAllBooks(): Promise<Book[]> {
    return books;
}
export async function getBookById(id: number): Promise<Book> {
    const book = books.find(b => b.id === id);
    if (!book) {
        const error = new Error('Book not found');
        (error as any).statusCode = 404;
        throw error;
    }
    return book;
}

export async function createBook(bookData: CreateBookRequest): 
Promise<Book> {
    // Validación de reglas de negocio
if (bookData.price <= 0) {
    const error = new Error('Price must be greater than 0');
    (error as any).statusCode = 400;
    throw error;
}
const newBook: Book = {
    id: Math.max(...books.map(b => b.id)) + 1,
    ...bookData,
    createdAt: new Date(),
};
books.push(newBook);
return newBook;
}

export async function updateBook(id: number, updateData: 
UpdateBookRequest): Promise<Book> {
const bookIndex = books.findIndex(b => b.id === id);
if (bookIndex === -1) {
    const error = new Error('Book not found');
    (error as any).statusCode = 404;
    throw error;
}
    // Validar precio si viene en el update
if (updateData.price !== undefined && updateData.price <= 0) {
    const error = new Error('Price must be greater than 0');
    (error as any).statusCode = 400;
    throw error;
}
books[bookIndex] = { ...books[bookIndex], ...updateData };
return books[bookIndex];
}