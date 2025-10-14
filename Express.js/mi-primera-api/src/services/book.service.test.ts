import { getBookById, getAllBooks, createBook, updateBook, deleteBook, getFeaturedBooks, getBookStats } from './book.service';
import prisma from '../config/prisma';
import type { CreateBookInput, UpdateBookInput } from '../validations/book.validation';

// ARRANGE GLOBAL: Mockeamos el cliente de Prisma para que no use la base de datos real
// Esto nos permite controlar lo que Prisma 'devuelve' en cada test
jest.mock('../config/prisma', () => ({
    book: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
    },
    author: {
        findUnique: jest.fn(),
        count: jest.fn(),
    },
    category: {
        count: jest.fn(),
    }
}));

// ARRANGE GLOBAL: Usamos un hook para limpiar los mocks después de cada test
// Esto asegura que cada test se ejecute con un 'estado limpio'
afterEach(() => {
    jest.clearAllMocks();
});

// Test para getBookById
describe('BookService - getBookById', () => {
    test('debe retornar un libro cuando existe', async () => {
    // ARRANGE: Datos de prueba para simular un libro encontrado
        const mockBook = {
        id: 1,
        title: 'El Señor de los Anillos',
        author: { id: 10, name: 'Tolkien' },
        categories: [],
        };
    // Le decimos al mock de Prisma que 'devuelva' nuestro mockBook
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(mockBook);

    // ACT: Ejecutamos la función a testear con un ID que sabemos que 'existe'
    const result = await getBookById(1);

    // ASSERT: Verificamos el resultado
    // 1. Que el resultado sea exactamente el mockBook
    expect(result).toEqual(mockBook);
    // 2. Que la función de Prisma haya sido llamada con los argumentos correctos
    expect(prisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: Number(1) },
        include: { author: true, categories: true },
    });
});

test('debe lanzar un error 404 cuando el libro no existe', async () => {
    // ARRANGE: Configuramos el mock para que 'devuelva' null, simulando un libro no encontrado
    (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);

    // ACT & ASSERT: Usamos la sintaxis .rejects.toThrow para verificar que la función lance un error
    await expect(getBookById(999)).rejects.toThrow('Libro no encontrado');
    });
});

// Test para getAllBooks
describe('BookService - getAllBooks', () => {
    test('debe retornar una lista de libros con relaciones', async () => {
        // ARRANGE: Mockeamos el resultado esperado de la base de datos
        const mockBooks = [
        { id: 1, title: 'Book 1', author: { id: 10, name: 'Author A' }, categories: [] },
        { id: 2, title: 'Book 2', author: { id: 11, name: 'Author B' }, categories: [] },
        ];
        (prisma.book.findMany as jest.Mock).mockResolvedValue(mockBooks); //Le estoy diciendo a Jest cómo debe comportarse el mock de Prisma

        // ACT: Llamamos a la función.
        const result = await getAllBooks();

        // ASSERT: Verificamos el resultado y que la función de Prisma se llamó correctamente.
        expect(result).toEqual(mockBooks); //toma el valor que devolvió la función (result) y lo compara con lo que esperas
        expect(prisma.book.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
        include: { author: true, categories: true },
        });
    });

    test('debe retornar un array vacío si no hay libros', async () => {
        // ARRANGE: Configuramos el mock para devolver un array vacío.
        (prisma.book.findMany as jest.Mock).mockResolvedValue([]);

        // ACT: Llamamos a la función.
        const result = await getAllBooks();

        // ASSERT: Verificamos que el resultado sea un array vacío.
        expect(result).toEqual([]); 
        expect(prisma.book.findMany).toHaveBeenCalledTimes(1);
    });
});

// Test para createBook
describe('BookService - createBook', () => {
    const newBookInput = {
        title: 'Nuevo Libro',
        price: 25,
        authorId: 10,
        categoryIds: [1, 2],
    };

    test('debe crear un libro exitosamente si el autor existe', async () => {
        // ARRANGE: Mockeamos que el autor existe y que la creación del libro es exitosa.
        const mockCreatedBook = { ...newBookInput, id: 101, author: { id: 10, name: 'Autor A' }, categories: [] };
        (prisma.author.findUnique as jest.Mock).mockResolvedValue({ id: 10 });
        (prisma.book.create as jest.Mock).mockResolvedValue(mockCreatedBook);

        // ACT: Llamamos a la función.
        const result = await createBook(newBookInput);

        // ASSERT: Verificamos el resultado.
        expect(result).toEqual(mockCreatedBook);
        expect(prisma.author.findUnique).toHaveBeenCalledWith({ where: { id: Number(newBookInput.authorId) } });
        expect(prisma.book.create).toHaveBeenCalledWith(expect.any(Object));
    });

    test('debe lanzar un error 404 si el autor no existe', async () => {
        // ARRANGE: Mockeamos que el autor no se encuentra.
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que se lance el error esperado.
        await expect(createBook(newBookInput)).rejects.toThrow('El autor no existe');
        expect(prisma.author.findUnique).toHaveBeenCalledWith({ where: { id: Number(newBookInput.authorId) } });
        expect(prisma.book.create).not.toHaveBeenCalled();
    });
});

// Test para updateBook
describe('BookService - updateBook', () => {
    const updateInput = { title: 'Título Actualizado', price: 30 };
    const bookId = 1;

    test('debe actualizar un libro exitosamente', async () => {
        // ARRANGE: Mockeamos la actualización exitosa.
        const mockUpdatedBook = { id: bookId, title: 'Título Actualizado', price: 30, author: null, categories: [] };
        (prisma.book.update as jest.Mock).mockResolvedValue(mockUpdatedBook);

        // ACT: Llamamos a la función.
        const result = await updateBook(bookId, updateInput);

        // ASSERT: Verificamos que el libro se actualizó correctamente.
        expect(result).toEqual(mockUpdatedBook);
        expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: Number(bookId) },
        data: {
            title: updateInput.title,
            price: updateInput.price,
        },
        include: { author: true, categories: true },
        });
    });

    test('debe lanzar un error 404 si el libro a actualizar no existe', async () => {
        // ARRANGE: Mockeamos que la actualización de un libro no existente lanza un error P2025 de Prisma.
        const prismaError = new Error('Libro no encontrado.');
        (prismaError as any).code = 'P2025';
        (prisma.book.update as jest.Mock).mockRejectedValue(prismaError);

        // ACT & ASSERT: Verificamos que la función maneja el error de Prisma y lanza un error 404.
        await expect(updateBook(999, updateInput)).rejects.toThrow('Libro no encontrado');
    });

    test('debe lanzar un error 404 si el nuevo autor no existe', async () => {
        // ARRANGE: Mockeamos que el autor no existe.
        (prisma.author.findUnique as jest.Mock).mockResolvedValue(null);
        const updateInputWithAuthor = { authorId: 999 };

        // ACT & ASSERT: Verificamos que la función lanza un error.
        await expect(updateBook(bookId, updateInputWithAuthor)).rejects.toThrow('El autor no existe');
    });
});

// Test para deleteBook
describe('BookService - deleteBook', () => {
    const bookId = 1;

    test('debe eliminar un libro exitosamente', async () => {
        // ARRANGE: Mockeamos el resultado del borrado.
        (prisma.book.delete as jest.Mock).mockResolvedValue({ id: bookId });

        // ACT: Llamamos a la función.
        await deleteBook(bookId);

        // ASSERT: Verificamos que la función de Prisma fue llamada.
        expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: Number(bookId) } });
    });

    test('debe lanzar un error 404 si el libro a eliminar no existe', async () => {
        // ARRANGE: Mockeamos que el borrado de un libro no existente lanza un error P2025.
        const prismaError = new Error('Libro no encontrado');
        (prismaError as any).code = 'P2025';
        (prisma.book.delete as jest.Mock).mockRejectedValue(prismaError);

        // ACT & ASSERT: Verificamos que se lance el error 404.
        await expect(deleteBook(999)).rejects.toThrow('Libro no encontrado');
    });
});

// Tests para getFeaturedBooks y getBookStats
describe('BookService - getFeaturedBooks', () => {
    test('debe retornar los 5 libros publicados más recientes', async () => {
        // ARRANGE: Mockeamos los libros que cumplen con los criterios.
        const mockFeaturedBooks = Array(5).fill({ id: 1, published: true, createdAt: new Date() });
        (prisma.book.findMany as jest.Mock).mockResolvedValue(mockFeaturedBooks);

        // ACT: Llamamos a la función.
        const result = await getFeaturedBooks();

        // ASSERT: Verificamos que el resultado y la llamada a Prisma sean correctos.
        expect(result.length).toBe(5);
        expect(prisma.book.findMany).toHaveBeenCalledWith({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { author: true, categories: true },
        });
    });
    });

    describe('BookService - getBookStats', () => {
    test('debe retornar las estadísticas correctas de los libros', async () => {
        // ARRANGE: Mockeamos cada una de las llamadas a la base de datos.
        (prisma.book.count as jest.Mock).mockResolvedValueOnce(10).mockResolvedValueOnce(7);
        (prisma.author.count as jest.Mock).mockResolvedValue(5);
        (prisma.category.count as jest.Mock).mockResolvedValue(3);
        (prisma.book.aggregate as jest.Mock).mockResolvedValue({ _avg: { price: 25.5 } });

        // ACT: Llamamos a la función.
        const stats = await getBookStats();

        // ASSERT: Verificamos que las estadísticas calculadas sean las esperadas.
        expect(stats).toEqual({
        totalBooks: 10,
        publishedBooks: 7,
        unpublishedBooks: 3, // 10 - 7
        totalAuthors: 5,
        totalCategories: 3,
        averagePrice: 25.5,
        });
        // Verificamos que se hicieron todas las llamadas correctas a Prisma.
        expect(prisma.book.count).toHaveBeenCalledTimes(2);
        expect(prisma.author.count).toHaveBeenCalledTimes(1);
        expect(prisma.category.count).toHaveBeenCalledTimes(1);
        expect(prisma.book.aggregate).toHaveBeenCalledTimes(1);
    });
});