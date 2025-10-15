import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from './category.service';
import prisma from '../config/prisma';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validations/category.validation';

// ARRANGE GLOBAL: Mockeamos el cliente de Prisma para que no use la base de datos real.
// Esto nos permite controlar lo que Prisma 'devuelve' en cada test.
jest.mock('../config/prisma', () => ({
    category: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}));

// ARRANGE GLOBAL: Hook para limpiar los mocks después de cada test.
afterEach(() => {
    jest.clearAllMocks();
});

// Test para getAllCategories
describe('CategoryService - getAllCategories', () => {
    test('debe retornar una lista de categorías con sus libros', async () => {
        // ARRANGE: Datos de prueba para simular categorías encontradas.
        const mockCategories = [
            { id: 1, name: 'Ficción', books: [] },
            { id: 2, name: 'Ciencia', books: [] },
        ];
        (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

        // ACT: Llamamos a la función a testear.
        const result = await getAllCategories();

        // ASSERT: Verificamos el resultado y que la función de Prisma se llamó correctamente.
        expect(result).toEqual(mockCategories);
        expect(prisma.category.findMany).toHaveBeenCalledWith({
            orderBy: { id: 'asc' },
            include: { books: true },
        });
    });

    test('debe retornar un array vacío si no hay categorías', async () => {
        // ARRANGE: Configuramos el mock para que devuelva un array vacío.
        (prisma.category.findMany as jest.Mock).mockResolvedValue([]);

        // ACT: Llamamos a la función.
        const result = await getAllCategories();

        // ASSERT: Verificamos que el resultado sea un array vacío.
        expect(result).toEqual([]);
        expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });
});

// Test para getCategoryById
describe('CategoryService - getCategoryById', () => {
    test('debe retornar una categoría cuando existe', async () => {
        // ARRANGE: Datos de prueba para simular una categoría encontrada.
        const mockCategory = { id: 1, name: 'Ficción', books: [] };
        (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

        // ACT: Ejecutamos la función a testear.
        const result = await getCategoryById(1);

        // ASSERT: Verificamos que el resultado sea el esperado y la llamada a Prisma.
        expect(result).toEqual(mockCategory);
        expect(prisma.category.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { books: true },
        });
    });

    test('debe lanzar un error 404 cuando la categoría no existe', async () => {
        // ARRANGE: Configuramos el mock para que devuelva null.
        (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que la función lance un error 404.
        await expect(getCategoryById(999)).rejects.toThrow('Categoría no encontrada');
    });
});

// Test para createCategory
describe('CategoryService - createCategory', () => {
    const newCategoryInput: CreateCategoryInput = { name: 'Aventura' };
    const mockCreatedCategory = { id: 1, name: 'Aventura', books: [] };

    test('debe crear una categoría exitosamente', async () => {
        // ARRANGE: Mockeamos la creación exitosa de la categoría.
        (prisma.category.create as jest.Mock).mockResolvedValue(mockCreatedCategory);

        // ACT: Llamamos a la función.
        const result = await createCategory(newCategoryInput);

        // ASSERT: Verificamos el resultado y que la función de Prisma fue llamada.
        expect(result).toEqual(mockCreatedCategory);
        expect(prisma.category.create).toHaveBeenCalledWith({
            data: { name: newCategoryInput.name },
            include: { books: true },
        });
    });
});

// Test para updateCategory
describe('CategoryService - updateCategory', () => {
    const updateInput: UpdateCategoryInput = { name: 'Aventura Moderna' };
    const categoryId = 1;

    test('debe actualizar una categoría exitosamente cuando existe', async () => {
        // ARRANGE: Mockeamos la existencia de la categoría y la actualización.
        const mockUpdatedCategory = { id: categoryId, name: 'Aventura Moderna', books: [] };
        (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: categoryId });
        (prisma.category.update as jest.Mock).mockResolvedValue(mockUpdatedCategory);

        // ACT: Llamamos a la función.
        const result = await updateCategory(categoryId, updateInput);

        // ASSERT: Verificamos el resultado y las llamadas a Prisma.
        expect(result).toEqual(mockUpdatedCategory);
        expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: categoryId } });
        expect(prisma.category.update).toHaveBeenCalledWith({
            where: { id: categoryId },
            data: { name: updateInput.name },
            include: { books: true },
        });
    });

    test('debe lanzar un error 404 si la categoría a actualizar no existe', async () => {
        // ARRANGE: Mockeamos que la categoría no existe.
        (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que se lance el error esperado.
        await expect(updateCategory(999, updateInput)).rejects.toThrow('Categoría no encontrada');
        expect(prisma.category.update).not.toHaveBeenCalled();
    });
});

// Test para deleteCategory
describe('CategoryService - deleteCategory', () => {
    const categoryId = 1;

    test('debe eliminar una categoría exitosamente', async () => {
        // ARRANGE: Mockeamos la existencia de la categoría.
        (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: categoryId });

        // ACT: Llamamos a la función.
        await deleteCategory(categoryId);

        // ASSERT: Verificamos que la función de Prisma fue llamada correctamente.
        expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: categoryId } });
        expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: categoryId } });
    });

    test('debe lanzar un error 404 si la categoría a eliminar no existe', async () => {
        // ARRANGE: Mockeamos que la categoría no se encuentra.
        (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

        // ACT & ASSERT: Verificamos que se lance el error esperado.
        await expect(deleteCategory(999)).rejects.toThrow('Categoría no encontrada');
        expect(prisma.category.delete).not.toHaveBeenCalled();
    });
});