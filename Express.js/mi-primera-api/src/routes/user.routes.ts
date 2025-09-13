import { Router } from 'express';
import * as userController from '../controllers/user.controller'; 
import { validate } from '../middlewares/validation.middleware';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';

const router = Router();

router.get(
    '/',
    authenticateToken,
    requireRole(['ADMIN', 'MODERATOR']),
    userController.getAllUsers
);
router.get(
    '/:id',
    authenticateToken,
    requireRole(['MODERATOR', 'ADMIN']),
    userController.getUserById
);
router.post('/',
    authenticateToken,
    requireRole(['ADMIN']),
    validate(createUserSchema),
    userController.createUser
);
router.put('/:id',
    authenticateToken,
    requireRole(['ADMIN']),
    validate(updateUserSchema),
    userController.updateUser
);
router.delete('/:id',
    authenticateToken,
    requireRole(['ADMIN']),
    userController.deleteUser
);

export const userRoutes = router;