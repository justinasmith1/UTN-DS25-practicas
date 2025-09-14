# 📚 MiauBooks - Librería Online

Una aplicación web completa de librería desarrollada con **React** (frontend) y **Express.js** (backend) con **Prisma** como ORM.

## 🚀 Características

- **Frontend**: React con Vite, React Router para navegación
- **Backend**: Express.js con TypeScript
- **Base de datos**: PostgreSQL con Prisma ORM
- **Navegación**: Sistema de rutas completo
- **Categorías**: Ficción, Novela, Historia, Arte
- **Funcionalidades**: 
    - CRUD completo de libros, autores y categorías
    - Autenticación y Autorización con JWT
    - Manejo de roles (USER, ADMIN, MODERATOR) con distintos niveles de acceso

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- React Router DOM
- CSS3
- Context/Custom Hooks para manejo de sesión y token JWT

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validación)
- CORS
- jsonwebtoken (JWT) para autenticación
- bcrypt para encriptación de contraseñas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd UTN-DS25-practicas
```

### 2. Configurar el Backend
```bash
cd Express.js/mi-primera-api
npm install
```

Crear archivo `.env`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/miaubooks"
DIRECT_URL="postgresql://usuario:password@localhost:5432/miaubooks"
```

Configurar la base de datos:
```bash
npx prisma db push
npx prisma generate
```

### 3. Configurar el Frontend
```bash
cd ../../react
npm install
```

### 4. Ejecutar la aplicación

**Terminal 1 - Backend:**
```bash
cd Express.js/mi-primera-api
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd react
npm run dev
```

## ✅ Puesta en marcha con datos de ejemplo

Para ver la app con datos ya cargados (seed incluido):

1) Backend
```bash
cd Express.js/mi-primera-api
npm install
# Asegúrate de tener configurado el archivo .env (ver sección "Instalación y Configuración").

npm run db:sync   # crea tablas y ejecuta el seed con libros
npm run dev       # levanta el servidor en http://localhost:3000
```

2) Frontend
```bash
cd react
npm install
npm run dev       # abre la app (Vite) en el navegador
```

Notas:
- El seed crea autores, categorías y varios libros con portadas.
- Si el backend no está levantado, el frontend puede mostrar datos en caché si ya los vio antes.

## 📖 API Endpoints

### Libros
- `GET /api/books` - Obtener todos los libros
- `GET /api/books/:id` - Obtener libro por ID
- `POST /api/books` - Crear nuevo libro
- `PUT /api/books/:id` - Actualizar libro
- `DELETE /api/books/:id` - Eliminar libro

### Autenticacion
- `POST /api/auth/register` - Registrar usuario 
- `POST /api/auth/login` - Login, devuelve token JWT
- `GET /api/users` - Obtener todos los usuarios

## 🔒 Matriz de Permisos por Rol

| Funcionalidad                  | USER | MODERATOR | ADMIN |
| ------------------------------- | :--: | :-------: | :---: |
| Ver libros                      | ✅   | ✅        | ✅    |
| Crear / Editar libros           | ❌   | ✅        | ✅    |
| Eliminar libros                 | ❌   | ❌        | ✅    |
| Ver lista de usuarios           | ❌   | ✅        | ✅    |
| Ver usuario específico          | ❌   | ✅        | ✅    |
| Crear / Editar / Eliminar usuarios | ❌   | ❌        | ✅    |
| Ver estadísticas                | ❌   | ❌        | ✅    |



## 🎨 Páginas de la Aplicación

- **Inicio** (`/`) - Algunos libros
- **Catalogo** (`/catalogo`) - Todos los libros
- **Ficción** (`/ficcion`) - Libros de ficción
- **Novela** (`/novela`) - Novelas
- **Historia** (`/historia`) - Libros de historia
- **Arte** (`/arte`) - Libros de arte
- **Registro** (`/registro`) - Página de registro
- **Iniciar Sesion** (`/iniciar-sesion`) - Página de inicio de sesion
- **Contacto** (`/contacto`) - Información de contacto
- **Panel de Moderación** (`/moderador`) - Página del moderador
- **Panel de Administración** (`/admin`) - Página del admin

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como práctica para la materia **Desarrollo de Software** de la **UTN** (2025).

### Funcionalidades Implementadas
- ✅ CRUD completo de libros
- ✅ Sistema de categorías
- ✅ Navegación con React Router
- ✅ Validación de datos con Zod
- ✅ Manejo de errores
- ✅ Interfaz responsive
- ✅ Integración frontend-backend
- ✅ Autenticación y autorización con JWT
- ✅ Gestión de roles y accesos diferenciados (USER, ADMIN, MODERATOR)

## 📝 Notas

- El proyecto utiliza TypeScript en el backend para mayor robustez
- La aplicación incluye manejo de CORS para desarrollo
- Validaciones implementadas tanto en frontend como backend
- El control de accesos garantiza que cada rol solo pueda ver/modificar lo que le corresponde

---

**Desarrollado por Justina Smith para UTN - Desarrollo de Software 2025**
