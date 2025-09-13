import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { CreateUserRequest, UpdateUserRequest, User, UserData } from '../types/user.types';


export async function getAllUsers(): Promise<UserData[]> {
    try {
        console.log('📊 Obteniendo todos los usuarios de la base de datos...');
        const users = await prisma.user.findMany({
            orderBy: { id: "asc" },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        console.log('✅ Usuarios encontrados:', users.length);
        return users;
    } catch (error) {
        console.error('❌ Error en getAllUsers:', error);
        throw error;
    }
}

export async function getUserById(id: number): Promise<User> {
    const user = await prisma.user.findUnique(
        { where: { id } }
    );
    if (!user) {
        const error = new Error('Usuario no encontrado') as any;
        error.statusCode = 404;
        throw error;
    }
    return user;
}

export async function createUser(data: CreateUserRequest): Promise<User> {
    // 1. Verificar si existe
    const exists = await prisma.user.findUnique({ where: { email: data.email }});
    if (exists) {
        const error = new Error('Email ya registrado') as any;
        error.statusCode = 409;
        throw error;
    }
    // 2. Hashear password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // 3. Crear usuario
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword
        },
    });
    return user;
}   

export async function updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    try {
        const updateData: Partial<UpdateUserRequest> = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        } else {
            delete (updateData as any).password;
        }
        return await prisma.user.update({
            where: { id },
            data: updateData,
        });
    } catch (e: any) {
        if (e.code === 'P2025') {
            const error = new Error('Usuario no encontrado') as any;
            error.statusCode = 404;
            throw error;
        }
        throw e;
    }
}

export async function deleteUser(id: number): Promise<void> {
    try {
        await prisma.user.delete({ where: { id } });
    } catch (e: any) {
        if (e.code === 'P2025') {
            const error = new Error('Usuario no encontrado') as any;
            error.statusCode = 404;
            throw error;
        }
        throw e;
    }
}