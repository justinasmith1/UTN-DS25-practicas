import {Request, Response} from 'express';  
import * as authorService from '../services/author.service';
import { AuthorResponse, AuthorsListResponse } from '../types/book.types';
import { CreateAuthorRequest, UpdateAuthorRequest } from '../types/book.types';

export async function getAllAuthors(req: Request, res: Response) {
    const authors = await authorService.getAllAuthors();
    const response: AuthorsListResponse = {
        authors: authors,
        total: authors.length
    };
    res.json(response);
}   
export async function getAuthorById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const author = await authorService.getAuthorById(id);
    const response: AuthorResponse = {
        author: author,
        message: 'Author retrieved successfully'
    };
    res.json(response);
}
export async function createAuthor(req: Request, res: Response) {
    const input: CreateAuthorRequest = req.body;
    const author = await authorService.createAuthor(input);
    const response: AuthorResponse = {
        author: author,
        message: 'Author created successfully'
    };
    res.status(201).json(response);
}
export async function updateAuthor(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const input: UpdateAuthorRequest = req.body;
    const author = await authorService.updateAuthor(id, input);
    const response: AuthorResponse = {
        author: author,
        message: 'Author updated successfully'
    };
    res.json(response);
}
export async function deleteAuthor(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await authorService.deleteAuthor(id);
    res.json({ message: 'Author deleted successfully' });
}   
