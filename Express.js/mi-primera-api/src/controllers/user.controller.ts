import { Request, Response, NextFunction } from 'express';
import { CreateUserRequest, UpdateUserRequest, UserResponse, UsersListResponse } from '../types/user.types';
import * as userService from '../services/user.service';

export async function getAllUsers(req: Request, res: Response<UsersListResponse>, next: NextFunction) {
    try {
        console.log('🔍 Obteniendo todos los usuarios...');
        const users = await userService.getAllUsers();
        console.log('✅ Usuarios obtenidos:', users.length);
        res.json({
            users: users,
            total: users.length, 
            message: 'Users retrieved successfully' 
        });   
    } catch (error) { 
        console.error('❌ Error en getAllUsers:', error);
        next(error); 
    }
}

export async function getUserById(req: Request<{ id: string }>, res: Response<UserResponse>, next: NextFunction) {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(parseInt(id));
        res.json({ user, message: 'User retrieved successfully' });
    } catch (error) { next(error); }
}

export async function createUser(req: Request<{}, {}, CreateUserRequest>, res: Response<UserResponse>, next: NextFunction) {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ user: user, message: 'User created successfully' });
    } catch (error) { next(error); }
}

export async function updateUser(req: Request<{ id: string }, {}, UpdateUserRequest>, res: Response<UserResponse>, next: NextFunction) {
    try {
        const { id } = req.params;
        const updatedUser = await userService.updateUser(parseInt(id), req.body);
        res.json({ user: updatedUser, message: 'User updated successfully' });
    } catch (error) { next(error); }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        await userService.deleteUser(parseInt(id));
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) { next(error); }
}

