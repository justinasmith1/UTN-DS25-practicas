const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function hashModeratorPassword() {
    try {
        // Reemplaza 'email_del_moderador@ejemplo.com' con el email real del moderador
        const moderatorEmail = 'noviecito@gmail.com'; // CAMBIA ESTO
        
        // Reemplaza 'contraseña_plana' con la contraseña que le pusiste
        const plainPassword = 'noviecito'; // CAMBIA ESTO
        
        console.log('Buscando moderador...');
        
        // Buscar el moderador por email
        const moderator = await prisma.user.findUnique({
            where: { email: moderatorEmail }
        });
        
        if (!moderator) {
            console.error('❌ No se encontró el moderador con email:', moderatorEmail);
            return;
        }
        
        console.log('Moderador encontrado:', moderator.email);
        console.log('Email:', moderator.email);
        console.log('Nombre:', moderator.name);
        console.log('Rol:', moderator.role);
        
        // Hashear la contraseña
        console.log('Hasheando contraseña...');
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
        // Actualizar la contraseña en la base de datos
        console.log('Actualizando contraseña en la base de datos...');
        await prisma.user.update({
            where: { email: moderatorEmail },
            data: { password: hashedPassword }
        });
        
        console.log('¡Contraseña actualizada exitosamente :)))))!');
        console.log('Contraseña hasheada:', hashedPassword);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

hashModeratorPassword();
