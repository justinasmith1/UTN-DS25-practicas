import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { bookRoutes } from './routes/book.routes';
import { userRoutes } from './routes/user.routes';
import { handleError } from './middlewares/error.middleware' ;
import { logRequest } from './middlewares/logger.middleware' ;
import { categoryRoutes } from './routes/category.routes';
import { authorRoutes } from './routes/author.routes';

dotenv.config();

const app = express();
// Middlewares globales
app.use(cors()); // CORS abierto temporalmente para debug
app.use(express.json());
app.use(logRequest);

 // Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/authors', authorRoutes);

 // Error handler (siempre al final)
app.use(handleError);


export default app;