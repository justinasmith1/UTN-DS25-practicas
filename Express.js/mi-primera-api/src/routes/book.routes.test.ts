import request from 'supertest';
import  app  from '../app';
import { Request, Response, NextFunction } from 'express';

// Mocks combinados de servicios y middlewares en un solo lugar.
// Esto asegura que todos los componentes mockeados estén disponibles para todos los tests.
jest.mock('../services/book.service', () => ({
    getAllBooks: jest.fn(),
    getBookById: jest.fn(),
    getFeaturedBooks: jest.fn(),
    getBookStats: jest.fn(),
    createBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
}));

jest.mock('../middlewares/validation.middleware', () => ({
    validate: () => (req: Request, res: Response, next: NextFunction) => next(),
}));

jest.mock('../middlewares/auth.middleware', () => ({
    authenticateToken: (req: Request, res: Response, next: NextFunction) => {
        (req as any).user = { id: 1, role: 'ADMIN' };
        next();
    },
    requireRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
        if (roles.includes((req as any).user.role)) {
        next();
        } else {
        res.sendStatus(403);
        }
    },
}));

// ---
// Tests para rutas públicas (no requieren autenticación)
// ---

describe('Public Routes', () => {
    test('GET /api/books/featured debe retornar una lista de libros destacados', async () => {
        const mockFeaturedBooks = [{ id: 1, title: 'Destacado' }];
        (require('../services/book.service').getFeaturedBooks as jest.Mock).mockResolvedValue(mockFeaturedBooks);

        const response = await request(app).get('/api/books/featured');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockFeaturedBooks);
        expect(response.body).toHaveProperty('success', true);
        expect(require('../services/book.service').getFeaturedBooks).toHaveBeenCalledTimes(1);
    });

    test('GET /api/books debe retornar una lista de todos los libros', async () => {
        const mockBooks = [{ id: 1, title: 'Libro 1' }, { id: 2, title: 'Libro 2' }];
        (require('../services/book.service').getAllBooks as jest.Mock).mockResolvedValue(mockBooks);

        const response = await request(app).get('/api/books');

        expect(response.status).toBe(200);
        expect(response.body.books).toEqual(mockBooks);
        expect(response.body).toHaveProperty('success', true);
        expect(require('../services/book.service').getAllBooks).toHaveBeenCalledTimes(1);
    });

    test('GET /api/books/:id debe retornar un libro existente', async () => {
        const mockBook = { id: 1, title: 'Libro de prueba' };
        (require('../services/book.service').getBookById as jest.Mock).mockResolvedValue(mockBook);

        const response = await request(app).get('/api/books/1');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockBook);
        expect(response.body).toHaveProperty('success', true);
        expect(require('../services/book.service').getBookById).toHaveBeenCalledWith(1);
    });

    test('GET /api/books/:id debe retornar 404 para un libro inexistente', async () => {
        const error = new Error('Libro no encontrado') as any;
        error.statusCode = 404;
        (require('../services/book.service').getBookById as jest.Mock).mockRejectedValue(error);

        const response = await request(app).get('/api/books/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Libro no encontrado');
    });
});

// ---
// Tests para rutas protegidas (requieren autenticación y roles específicos)
// ---

describe('Protected Routes', () => {
    test('GET /api/books/stats debe retornar estadísticas (rol ADMIN)', async () => {
        const mockStats = { totalBooks: 10 };
        (require('../services/book.service').getBookStats as jest.Mock).mockResolvedValue(mockStats);

        const response = await request(app).get('/api/books/stats');

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockStats);
        expect(response.body).toHaveProperty('success', true);
        expect(require('../services/book.service').getBookStats).toHaveBeenCalledTimes(1);
    });

    test('POST /api/books debe crear un libro', async () => {
        const newBook = { title: 'Nuevo', price: 20 };
        (require('../services/book.service').createBook as jest.Mock).mockResolvedValue({ id: 1, ...newBook });

        const response = await request(app).post('/api/books').send(newBook);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body).toHaveProperty('success', true);
        expect(require('../services/book.service').createBook).toHaveBeenCalledWith(newBook);
    });
});