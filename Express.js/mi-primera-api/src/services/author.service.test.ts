import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from './author.service';
import prisma from '../config/prisma';
import type { CreateAuthorInput, UpdateAuthorInput } from '../validations/author.validation';

// ARRANGE GLOBAL: Mockeamos el cliente de Prisma para que no use la base de datos real.
// Esto nos permite controlar lo que Prisma 'devuelve' en cada test.
jest.mock('../config/prisma', () => ({
    author: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(), // fn es una función mockeada
    }
}));

// ARRANGE GLOBAL: Hook para limpiar los mocks después de cada test.
// Esto asegura que cada test se ejecute con un 'estado limpio'.
afterEach(() => {
    jest.clearAllMocks();
});

// Test para getAllAuthors
describe('AuthorService - getAllAuthors', () => {
    test('debe retornar una lista de autores con sus libros', async () => {
        // ARRANGE: Datos de prueba para simular autores encontrados.
        const mockAuthors = [
            { id: 1, name: 'Author A', books: [] },
            { id: 2, name: 'Author B', books: [] },
        ];
        (prisma.author.findMany as jest.Mock).mockResolvedValue(mockAuthors);

        // ACT: Llamamos a la función a testear.
        const result = await getAllAuthors();

        // ASSERT: Verificamos el resultado y que la función de Prisma se llamó correctamente.
        expect(result).toEqual(mockAuthors);
        expect(prisma.author.findMany).toHaveBeenCalledWith({
            orderBy: { id: 'asc' },
            include: { books: true },
        });
    });

    test('debe retornar un array vacío si no hay autores', async () => {
        // ARRANGE: Configuramos el mock para que devuelva un array vacío.
        (prisma.author.findMany as jest.Mock).mockResolvedValue([]);

        // ACT: Llamamos a la función.
        const result = await getAllAuthors();

        // ASSERT: Verificamos que el resultado sea un array vacío.
        expect(result).toEqual([]);
        expect(prisma.author.findMany).toHaveBeenCalledTimes(1);
    });
});

// Test para getAuthorById
describe('AuthorService - getAuthorById', () => {
    test('debe retornar un autor cuando existe', async () => {
        // ARRANGE: Datos de prueba para simular un autor encontrado.
        const mockAuthor = { id: 1, name: 'J.K. Rowling', books: [] };
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(mockAuthor);

        // ACT: Ejecutamos la función a testear.
        const result = await getAuthorById(1);

        // ASSERT: Verificamos que el resultado sea el esperado y la llamada a Prisma.
        expect(result).toEqual(mockAuthor);
        expect(prisma.author.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { books: true },
        });
    });

    test('debe lanzar un error 404 cuando el autor no existe', async () => {
        // ARRANGE: Configuramos el mock para que devuelva null.
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que la función lance un error 404.
        await expect(getAuthorById(999)).rejects.toThrow('Autor no encontrado');
    });
});

// Test para createAuthor
describe('AuthorService - createAuthor', () => {
    const newAuthorInput: CreateAuthorInput = { name: 'J.R.R. Tolkien' };
    const mockCreatedAuthor = { id: 1, name: 'J.R.R. Tolkien', books: [] };

    test('debe crear un autor exitosamente', async () => {
        // ARRANGE: Mockeamos la creación exitosa del autor.
        (prisma.author.create as jest.Mock).mockResolvedValue(mockCreatedAuthor);

        // ACT: Llamamos a la función.
        const result = await createAuthor(newAuthorInput);

        // ASSERT: Verificamos el resultado y que la función de Prisma fue llamada.
        expect(result).toEqual(mockCreatedAuthor);
        expect(prisma.author.create).toHaveBeenCalledWith({
            data: { name: newAuthorInput.name },
            include: { books: true },
        });
    });
});

// Test para updateAuthor
describe('AuthorService - updateAuthor', () => {
    const updateInput: UpdateAuthorInput = { name: 'George Orwell' };
    const authorId = 1;

    test('debe actualizar un autor exitosamente cuando existe', async () => {
        // ARRANGE: Mockeamos la existencia del autor y la actualización.
        const mockUpdatedAuthor = { id: authorId, name: 'George Orwell', books: [] };
        (prisma.author.findUnique as jest.Mock).mockResolvedValue({ id: authorId });
        (prisma.author.update as jest.Mock).mockResolvedValue(mockUpdatedAuthor);

        // ACT: Llamamos a la función.
        const result = await updateAuthor(authorId, updateInput);

        // ASSERT: Verificamos el resultado y las llamadas a Prisma.
        expect(result).toEqual(mockUpdatedAuthor);
        expect(prisma.author.findUnique).toHaveBeenCalledWith({ where: { id: authorId } });
        expect(prisma.author.update).toHaveBeenCalledWith({
            where: { id: authorId },
            data: { name: updateInput.name },
            include: { books: true },
        });
    });

    test('debe lanzar un error 404 si el autor a actualizar no existe', async () => {
        // ARRANGE: Mockeamos que el autor no existe.
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que se lance el error esperado.
        await expect(updateAuthor(999, updateInput)).rejects.toThrow('Autor no encontrado');
        expect(prisma.author.update).not.toHaveBeenCalled(); // Nos aseguramos de que update no se ejecute
    });
});

// Test para deleteAuthor
describe('AuthorService - deleteAuthor', () => {
    const authorId = 1;

    test('debe eliminar un autor exitosamente', async () => {
        // ARRANGE: Mockeamos la existencia del autor.
        (prisma.author.findUnique as jest.Mock).mockResolvedValue({ id: authorId });

        // ACT: Llamamos a la función.
        await deleteAuthor(authorId);

        // ASSERT: Verificamos que la función de Prisma fue llamada correctamente.
        expect(prisma.author.findUnique).toHaveBeenCalledWith({ where: { id: authorId } });
        expect(prisma.author.delete).toHaveBeenCalledWith({ where: { id: authorId } });
    });

    test('debe lanzar un error 404 si el autor a eliminar no existe', async () => {
        // ARRANGE: Mockeamos que el autor no se encuentra.
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que se lance el error esperado.
        await expect(deleteAuthor(999)).rejects.toThrow('Autor no encontrado');
        expect(prisma.author.delete).not.toHaveBeenCalled(); // Nos aseguramos de que delete no se ejecute
    });
});