// /Express.js/mi-primera-api/src/config/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['error', 'warn', 'query'] });
export default prisma;
