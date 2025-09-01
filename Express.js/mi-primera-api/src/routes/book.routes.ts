import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { validate } from '../middlewares/validation.middleware';
import { BookCreateSchema, BookUpdateSchema, type CreateBookInput, type UpdateBookInput } from '../validations/book.validation';

const router = Router();

 // GET /api/books
router.get('/', bookController.getAllBooks);
 // GET /api/books/:id 
router.get('/:id', bookController.getBookById);
 // POST /api/books
router.post('/', validate(BookCreateSchema), bookController.createBook);
 // PUT /api/books/:id
router.put('/:id', validate(BookUpdateSchema), bookController.updateBook);
 // DELETE /api/books/:id
router.delete('/:id', bookController.deleteBook);

export const bookRoutes = router;