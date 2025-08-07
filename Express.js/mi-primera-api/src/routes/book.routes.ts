import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
    
const router = Router();

// GET /api/books
router.get('/', bookController.getAllBooks);

// GET /api/books/:id 
router.get('/:id', bookController.getBookById);

// POST /api/books
router.post('/', bookController.createBook);

// PUT /api/books/:id
router.put('/:id', bookController.updateBook);

export const bookRoutes = router;