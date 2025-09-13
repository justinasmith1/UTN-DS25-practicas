export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'mi-clave-secreta-super-segura',
  expiresIn: '24h'
};
