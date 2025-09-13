import { Request, Response, NextFunction } from "express";
import * as authService from '../services/auth.service';
import { LoginRequest, LoginResponse } from "../types/auth.types";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export async function login(
  req: Request<{}, any, LoginRequest>,
  res: Response<LoginResponse>,
  next: NextFunction
) {
    try {
        console.log('=== LOGIN REQUEST ===');
        console.log('Body:', req.body);
        console.log('Email:', req.body.email);
        console.log('Password length:', req.body.password?.length);
        
        const result = await authService.login(req.body);
        console.log('Login successful for user:', result.user.email);
        res.json({ data: result });
    } catch (error: any) {
        console.error('Login error:', error.message);
        console.error('Error status:', error.statusCode);
        next(error);
    }    
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Nombre, email y contraseña son requeridos'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'El email ya está registrado'
            });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER'
            }
        });

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token
            }
        });
    } catch (error: any) {
        next(error);
    }
}
