import { login, verifyToken } from './auth.service';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ARRANGE GLOBAL: Mockeamos Prisma, bcrypt y jsonwebtoken para aislar la lógica.
jest.mock('../config/prisma', () => ({
    user: {
        findUnique: jest.fn(),
    },
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

// ARRANGE GLOBAL: Hook para limpiar los mocks después de cada test.
afterEach(() => {
    jest.clearAllMocks();
});

// Tests para la función login
describe('AuthService - login', () => {
    test('debe retornar un usuario y un token con credenciales válidas', async () => {
        // ARRANGE: Mockeamos los datos de un usuario y el comportamiento de las dependencias.
        const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        password: 'hashed_password',
        createdAt: new Date(),
        };
        const mockToken = 'mocked.jwt.token';
        const loginData = { email: 'test@example.com', password: 'password123' };

        // Simular que el usuario es encontrado y la contraseña es correcta.
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);

        // ACT: Ejecutamos la función de login.
        const result = await login(loginData);

        // ASSERT: Verificamos los resultados.
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginData.email } });
        expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
        expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        expect.any(String), // No verificamos el secreto, solo que sea un string.
        { expiresIn: '24h' }
        );
        expect(result).toEqual({ user: { id: 1, email: 'test@example.com', name: 'Test User', role: 'USER', createdAt: expect.any(Date) }, token: mockToken });
    });

    test('debe lanzar un error 401 si el usuario no es encontrado', async () => {
        // ARRANGE: Mockeamos que prisma.user.findUnique devuelve null.
        const loginData = { email: 'nonexistent@example.com', password: 'password123' };
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que la función lance el error esperado.
        await expect(login(loginData)).rejects.toThrow('Credenciales inválidas');
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('debe lanzar un error 401 si la contraseña es incorrecta', async () => {
        // ARRANGE: Mockeamos un usuario encontrado, pero con contraseña incorrecta.
        const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', role: 'USER', password: 'hashed_password', createdAt: new Date() };
        const loginData = { email: 'test@example.com', password: 'wrong_password' };
        
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simula que la comparación falla.

        // ACT & ASSERT: Verificamos que la función lance el error esperado.
        await expect(login(loginData)).rejects.toThrow('Credenciales inválidas');
        expect(jwt.sign).not.toHaveBeenCalled();
    });
});

// Tests para la función verifyToken
describe('AuthService - verifyToken', () => {
    test('debe retornar el payload decodificado para un token válido', () => {
        // ARRANGE: Mockeamos un payload válido y el comportamiento de jwt.verify.
        const validToken = 'valid.jwt.token';
        const decodedPayload = { id: 1, email: 'test@example.com', role: 'USER' };
        (jwt.verify as jest.Mock).mockReturnValue(decodedPayload);

        // ACT: Llamamos a la función.
        const result = verifyToken(validToken);

        // ASSERT: Verificamos que el resultado sea el payload y que jwt.verify fue llamado.
        expect(jwt.verify).toHaveBeenCalledWith(validToken, expect.any(String));
        expect(result).toEqual(decodedPayload);
    });

    test('debe lanzar un error si el token es inválido', () => {
        // ARRANGE: Mockeamos que jwt.verify lanza un error.
        const invalidToken = 'invalid.jwt.token';
        (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('jwt malformed');
        });

        // ACT & ASSERT: Verificamos que la función lance el error esperado.
        expect(() => verifyToken(invalidToken)).toThrow('Token inválido');
    });
});