import { Request, Response, NextFunction } from 'express';
import { Book, CreateBookRequest, UpdateBookRequest, BookResponse, BooksListResponse } from '../types/book.types';
import * as bookService from '../services/book.service';
    
export async function getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
        const books = await bookService.getAllBooks();
        res.json({ success: true, books: books });
    } catch (error) { next(error); } 
}
    
export async function getBookById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        const book = await bookService.getBookById(id);
        res.json({ success: true, data: book });
    } catch (error) { next(error); }
}

export async function createBook(req: Request, res: Response, next: NextFunction) {
    try {
        const book = await bookService.createBook(req.body);
        res.status(201).json({ success: true, message: 'Libro creado exitosamente', data: book });
    } catch (error) { next(error); }
}

export async function updateBook(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        const book = await bookService.updateBook(id, req.body);
        res.json({ success: true, message: 'Libro actualizado exitosamente', data: book });
    } catch (error) { next(error); }
}

export async function deleteBook(req: Request, res:  Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        await bookService.deleteBook(id);
        res.json({ success: true, message: 'Libro eliminado exitosamente' });
    } catch (error) { next(error); }
}

// Endpoint público - obtener libros destacados
export async function getFeaturedBooks(req: Request, res: Response, next: NextFunction) {
    try {
        const books = await bookService.getFeaturedBooks();
        res.json({ 
            success: true, 
            message: 'Libros destacados obtenidos exitosamente',
            data: books 
        });
    } catch (error) { next(error); }
}

// Endpoint seguro - obtener estadísticas de libros (solo para admins)
export async function getBookStats(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('🔍 Intentando obtener estadísticas de libros...');
        const stats = await bookService.getBookStats();
        console.log('✅ Estadísticas obtenidas:', stats);
        res.json({ 
            success: true, 
            message: 'Estadísticas obtenidas exitosamente',
            data: stats 
        });
    } catch (error) { 
        console.error('❌ Error en getBookStats:', error);
        next(error); 
    }
}