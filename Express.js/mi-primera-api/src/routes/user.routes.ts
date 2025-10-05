import { Router } from 'express';
import * as userController from '../controllers/user.controller'; 
import { validate } from '../middlewares/validation.middleware';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';

const router = Router();

// GET /api/users - Todos los usuarios (admin o moderador)
router.get(
    '/',
    authenticateToken,
    requireRole(['ADMIN', 'MODERATOR']),
    userController.getAllUsers
);

// GET /api/users/:id - Usuario por ID (admin o moderador)
router.get(
    '/:id',
    authenticateToken,
    requireRole(['MODERATOR', 'ADMIN']),
    userController.getUserById
);
// POST /api/users - Crear usuario (solo admin)
router.post('/',
    authenticateToken,
    requireRole(['ADMIN']),
    validate(createUserSchema),
    userController.createUser
);
// PUT /api/users/:id - Actualizar usuario (admin o moderador)
router.put('/:id',
    authenticateToken,
    requireRole(['ADMIN']),
    validate(updateUserSchema),
    userController.updateUser
);
// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id',
    authenticateToken,
    requireRole(['ADMIN']),
    userController.deleteUser
);

export const userRoutes = router;