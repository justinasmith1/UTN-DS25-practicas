import {Request, Response} from 'express';  
import * as categoryService from '../services/category.service';
import { CategoryResponse, CategoriesListResponse } from '../types/book.types';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types/book.types';

export async function getAllCategories(req: Request, res: Response) {
    const categories = await categoryService.getAllCategories();
    const response: CategoriesListResponse = {
        categories: categories,
        total: categories.length
    };
    res.json(response);
}
export async function getCategoryById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const category = await categoryService.getCategoryById(id);
    const response: CategoryResponse = {
        category: category,
        message: 'Category retrieved successfully'
    };
    res.json(response);
}
export async function createCategory(req: Request, res: Response) {
    const input: CreateCategoryRequest = req.body;
    const category = await categoryService.createCategory(input);
    const response: CategoryResponse = {
        category: category,
        message: 'Category created successfully'
    };
    res.status(201).json(response);
}
export async function updateCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const input: UpdateCategoryRequest = req.body;
    const category = await categoryService.updateCategory(id, input);
    const response: CategoryResponse = {
        category: category,
        message: 'Category updated successfully'
    };
    res.json(response);
}
export async function deleteCategory(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await categoryService.deleteCategory(id);
    res.json({ message: 'Category deleted successfully' });
}
