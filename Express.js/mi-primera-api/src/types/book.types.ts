export interface Book {
    id: number;
    title: string;
    img: string | null;  
    author: string;
    price: number;
    createdAt?: Date;
}
export interface CreateBookRequest {
    title: string;
    author: string;
    img: string | null;  
    price: number;
}
export interface UpdateBookRequest {
    title?: string;
    author?: string;
    price?: number;
}
export interface BookResponse {
    book: Book;
    message: string;
}
export interface BooksListResponse {
    books: Book[];
    total: number;
}