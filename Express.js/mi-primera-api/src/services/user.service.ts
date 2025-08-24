// ...existing code...
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createUser() {
    try {
        await prisma.user.create({
            data: { email: 'duplicate@email.com' }
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Email duplicado
            console.log('El email ya existe.');
        } else {
            throw error;
        }
    }
}

// Puedes llamar a la función así:
//createUser();
// ...existing code...