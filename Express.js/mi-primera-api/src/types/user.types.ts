import e from "express";

export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    role: 'USER' | 'ADMIN' | 'MODERATOR';  
    createdAt: Date;
}

export interface  CreateUserRequest {
    email: string;
    name: string;
    password: string;
    role: 'USER' | 'ADMIN' | 'MODERATOR';  
}

export interface UpdateUserRequest {
    email?: string;
    name?: string;
    password?: string;
    role?: 'USER' | 'ADMIN' | 'MODERATOR';  
}

export interface UserResponse {
    user: User;
    message: string;
}

export interface UserData {
    id: number;
    name: string;
    email: string;
    role:  'USER' | 'ADMIN' | 'MODERATOR';
    createdAt: Date;
}

export interface UsersListResponse {
    users: UserData[];
    total: number;   
    message: string;   
}