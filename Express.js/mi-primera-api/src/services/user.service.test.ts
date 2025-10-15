import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './user.service';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import type { CreateUserRequest, UpdateUserRequest, User, UserData } from '../types/user.types';

// ARRANGE GLOBAL: Mockeamos el cliente de Prisma para no usar la base de datos real.
// Esto nos permite controlar lo que la base de datos "devuelve".
jest.mock('../config/prisma', () => ({
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}));

// ARRANGE GLOBAL: Mockeamos bcrypt para no hashear contraseñas reales.
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password_mock'),
    compare: jest.fn(),
}));

// ARRANGE GLOBAL: Hook para limpiar los mocks después de cada test.
afterEach(() => {
    jest.clearAllMocks();
});

// Test para getAllUsers
describe('UserService - getAllUsers', () => {
    test('debe retornar una lista de usuarios', async () => {
        // ARRANGE: Datos de prueba para simular usuarios encontrados.
        const mockUsers = [
            { id: 1, name: 'User A', email: 'a@mail.com', role: 'USER' as const, createdAt: new Date() },
            { id: 2, name: 'User B', email: 'b@mail.com', role: 'MODERATOR' as const, createdAt: new Date() },
        ];
        (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

        // ACT: Llamamos a la función a testear.
        const result = await getAllUsers();

        // ASSERT: Verificamos el resultado.
        expect(result).toEqual(mockUsers);
        expect(prisma.user.findMany).toHaveBeenCalledWith({
            orderBy: { id: "asc" },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    });

    test('debe retornar un array vacío si no hay usuarios', async () => {
        // ARRANGE: Configuramos el mock para que devuelva un array vacío.
        (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

        // ACT: Llamamos a la función.
        const result = await getAllUsers();

        // ASSERT: Verificamos que el resultado sea un array vacío.
        expect(result).toEqual([]);
        expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
});

// Test para getUserById
describe('UserService - getUserById', () => {
    test('debe retornar un usuario cuando existe', async () => {
        // ARRANGE: Datos de prueba para simular un usuario encontrado.
        const mockUser = {
            id: 1,
            name: 'Test User',
            email: 'test@mail.com',
            role: 'USER' as const,
            createdAt: new Date(),
        };
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

        // ACT: Ejecutamos la función a testear.
        const result = await getUserById(1);

        // ASSERT: Verificamos que el resultado sea el esperado y la llamada a Prisma.
        expect(result).toEqual(mockUser);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test('debe lanzar un error 404 cuando el usuario no existe', async () => {
        // ARRANGE: Configuramos el mock para que devuelva null.
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que la función lance un error 404.
        await expect(getUserById(999)).rejects.toThrow('Usuario no encontrado');
    });
});

// Test para createUser
describe('UserService - createUser', () => {
    const newUserInput: CreateUserRequest = {
        name: 'New User',
        email: 'new@mail.com',
        password: 'password123',
        role: 'USER',
    };
    const mockCreatedUser: User = {
        ...newUserInput,
        id: 1,
        password: 'hashed_password_mock',
        createdAt: new Date(),
    };

    test('debe crear un usuario exitosamente', async () => {
        // ARRANGE: Mockeamos que el usuario no existe y que la creación es exitosa.
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);
        
        // ACT: Llamamos a la función.
        const result = await createUser(newUserInput);

        // ASSERT: Verificamos el resultado.
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: newUserInput.email } });
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: { ...newUserInput, password: 'hashed_password_mock' },
        });
        expect(result).toEqual(mockCreatedUser);
    });

    test('debe lanzar un error 409 si el usuario ya existe', async () => {
        // ARRANGE: Mockeamos que el usuario ya existe.
        const mockExistingUser = { id: 1, name: 'Existing', email: 'new@mail.com', password: 'hash', role: 'USER' as const, createdAt: new Date() };
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockExistingUser);

        // ACT & ASSERT: Verificamos que se lance el error esperado.
        await expect(createUser(newUserInput)).rejects.toThrow('Email ya registrado');
        expect(prisma.user.create).not.toHaveBeenCalled();
    });
});

// Test para updateUser
describe('UserService - updateUser', () => {
    const updateInput: UpdateUserRequest = { name: 'Updated Name' };
    const updatePasswordInput: UpdateUserRequest = { password: 'new_password' };
    const userId = 1;

    test('debe actualizar un usuario sin cambiar la contraseña', async () => {
        // ARRANGE: Mockeamos la actualización exitosa.
        const mockUpdatedUser = { id: userId, ...updateInput, password: 'old_hash', role: 'USER' as const, createdAt: new Date() };
        (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

        // ACT: Llamamos a la función.
        const result = await updateUser(userId, updateInput);

        // ASSERT: Verificamos que la función de Prisma fue llamada y bcrypt no.
        expect(result).toEqual(mockUpdatedUser);
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: updateInput,
        });
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });
    
    test('debe actualizar un usuario y hashear la nueva contraseña', async () => {
        // ARRANGE: Mockeamos la actualización con un nuevo hash.
        const mockUpdatedUser = { id: userId, ...updatePasswordInput, password: 'hashed_password_mock', role: 'USER' as const, createdAt: new Date() };
        (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

        // ACT: Llamamos a la función.
        const result = await updateUser(userId, updatePasswordInput);

        // ASSERT: Verificamos que la función de Prisma fue llamada y bcrypt sí.
        expect(result).toEqual(mockUpdatedUser);
        expect(bcrypt.hash).toHaveBeenCalledWith('new_password', 10);
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: { password: 'hashed_password_mock' },
        });
    });

    test('debe lanzar un error 404 si el usuario a actualizar no existe', async () => {
        // ARRANGE: Mockeamos que la actualización de un usuario no existente lanza un error P2025 de Prisma.
        const prismaError = new Error('Usuario no encontrado.');
        (prismaError as any).code = 'P2025';
        (prisma.user.update as jest.Mock).mockRejectedValue(prismaError);

        // ACT & ASSERT: Verificamos que la función maneja el error de Prisma y lanza un error 404.
        await expect(updateUser(999, updateInput)).rejects.toThrow('Usuario no encontrado');
    });
});

// Test para deleteUser
describe('UserService - deleteUser', () => {
    const userId = 1;

    test('debe eliminar un usuario exitosamente', async () => {
        // ARRANGE: No se necesita mockear findUnique en este caso porque la lógica de tu servicio
        // lo hace internamente y si no lo encuentra lanza un error.
        (prisma.user.delete as jest.Mock).mockResolvedValue({ id: userId });

        // ACT: Llamamos a la función.
        await deleteUser(userId);

        // ASSERT: Verificamos que la función de Prisma fue llamada correctamente.
        expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    });

    test('debe lanzar un error 404 si el usuario a eliminar no existe', async () => {
        // ARRANGE: Mockeamos que el borrado de un usuario no existente lanza un error P2025.
        const prismaError = new Error('Usuario no encontrado');
        (prismaError as any).code = 'P2025';
        (prisma.user.delete as jest.Mock).mockRejectedValue(prismaError);

        // ACT & ASSERT: Verificamos que se lance el error 404.
        await expect(deleteUser(999)).rejects.toThrow('Usuario no encontrado');
    });
});