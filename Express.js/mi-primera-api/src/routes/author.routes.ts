import {Router} from 'express';
import * as authorController from '../controllers/author.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { AuthorCreateSchema, AuthorUpdateSchema, type CreateAuthorInput, type UpdateAuthorInput } from '../validations/author.validation';

const router = Router();
// GET /api/authors - Todos los autores (público)
router.get('/', authorController.getAllAuthors);

// GET /api/authors/:id - Autor por ID (moderador o admin)
router.get('/:id', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), authorController.getAuthorById);

// POST /api/authors - Crear autor (moderador o admin)
router.post('/', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), validate(AuthorCreateSchema), authorController.createAuthor);

// PUT /api/authors/:id - Actualizar autor (moderador o admin)
router.put('/:id', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), validate(AuthorUpdateSchema), authorController.updateAuthor);

// DELETE /api/authors/:id - Eliminar autor (solo admin)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), authorController.deleteAuthor);

export const authorRoutes = router;