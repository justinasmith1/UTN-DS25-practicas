import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';
import { LoginRequest, LoginResponse } from '../types/auth.types';

export async function login(data: LoginRequest): Promise<LoginResponse['data']> {
  // 1. Buscar usuario
    console.log('Searching for user with email:', data.email);
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });
    if (!user) {
        console.log('User not found');
        const error = new Error('Credenciales inválidas') as any;
        error.statusCode = 401;
        throw error;
    }
    console.log('User found:', user.email, 'Role:', user.role);
   // 2. Verificar password
    console.log('Comparing passwords...');
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
        console.log('Invalid password');
        const error = new Error('Credenciales inválidas') as any;
        error.statusCode = 401;
        throw error;
    }
    console.log('Password is valid');
   // 3. Generar JWT
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
    );
   // 4. Retornar sin password
    const { password: _, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token
    };
}

// Verificar token JWT
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
        throw new Error('Token inválido');
    }
}
