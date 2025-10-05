import {Router} from 'express';
import * as categoryController from '../controllers/category.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { CategoryCreateSchema, CategoryUpdateSchema, type CreateCategoryInput, type UpdateCategoryInput } from '../validations/category.validation';

const router = Router();
// GET /api/categories - Todas las categorías (público)
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Categoría por ID (público)
router.get('/:id', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), categoryController.getCategoryById); 

// POST /api/categories - Crear categoría (moderador o admin)
router.post('/', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), validate(CategoryCreateSchema), categoryController.createCategory);

// PUT /api/categories/:id - Actualizar categoría (moderador o admin)
router.put('/:id', authenticateToken, requireRole(['MODERATOR', 'ADMIN']), validate(CategoryUpdateSchema), categoryController.updateCategory);

// DELETE /api/categories/:id - Eliminar categoría (solo admin)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), categoryController.deleteCategory);

export const categoryRoutes = router; 
