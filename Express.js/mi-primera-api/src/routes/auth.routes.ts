import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema } from "../validations/auth.validation";

const router = Router();

// Ruta de login
router.post('/login',
    validate(loginSchema),
    authController.login
);

// Ruta de registro
router.post('/register', authController.register);

export const authRoutes = router
