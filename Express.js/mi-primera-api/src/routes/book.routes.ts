import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { BookCreateSchema, BookUpdateSchema, type CreateBookInput, type UpdateBookInput } from '../validations/book.validation';

const router = Router();

// Rutas públicas
// GET /api/books/featured - Libros destacados (público)
router.get('/featured', bookController.getFeaturedBooks);

// GET /api/books/stats - Estadísticas (solo admins) - DEBE IR ANTES DE /:id
router.get('/stats', authenticateToken, requireRole(['ADMIN']), bookController.getBookStats);

// GET /api/books - Todos los libros (público)
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - Libro por ID (público) - DEBE IR AL FINAL
router.get('/:id', bookController.getBookById);

// Rutas de moderación (requieren rol MODERATOR o ADMIN)
// POST /api/books - Crear libro (requiere moderador o admin)
router.post('/', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), validate(BookCreateSchema), bookController.createBook);

// PUT /api/books/:id - Actualizar libro (requiere moderador o admin)
router.put('/:id', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), validate(BookUpdateSchema), bookController.updateBook);

// Rutas de administración (requieren rol ADMIN)
// DELETE /api/books/:id - Eliminar libro (solo admin)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), bookController.deleteBook);

export const bookRoutes = router;