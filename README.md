# 📚 MiauBooks - Librería Online

Una aplicación web completa de librería desarrollada con **React** (frontend) y **Express.js** (backend) con **Prisma** como ORM.

## 🚀 Características

- **Frontend**: React con Vite, React Router para navegación
- **Backend**: Express.js con TypeScript
- **Base de datos**: PostgreSQL con Prisma ORM
- **Navegación**: Sistema de rutas completo
- **Categorías**: Ficción, Novela, Historia, Arte
- **Funcionalidades**: CRUD completo de libros, autores y categorías

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- React Router DOM
- CSS3

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (validación)
- CORS

## 📁 Estructura del Proyecto

```
UTN-DS25-practicas/
├── react/                    # Frontend React
│   ├── src/
│   │   ├── Pages/           # Páginas de la aplicación
│   │   ├── components/      # Componentes reutilizables
│   │   └── assets/          # Imágenes y recursos
│   └── package.json
├── Express.js/
│   └── mi-primera-api/      # Backend Express
│       ├── src/
│       │   ├── controllers/ # Controladores
│       │   ├── services/    # Lógica de negocio
│       │   ├── routes/      # Rutas de la API
│       │   ├── middlewares/ # Middlewares
│       │   └── validations/ # Validaciones con Zod
│       ├── prisma/          # Esquema y migraciones
│       └── package.json
└── README.md
```

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

## 📖 API Endpoints

### Libros
- `GET /api/books` - Obtener todos los libros
- `GET /api/books/:id` - Obtener libro por ID
- `POST /api/books` - Crear nuevo libro
- `PUT /api/books/:id` - Actualizar libro
- `DELETE /api/books/:id` - Eliminar libro

## 🎨 Páginas de la Aplicación

- **Inicio** (`/`) - Todos los libros
- **Ficción** (`/ficcion`) - Libros de ficción
- **Novela** (`/novela`) - Novelas
- **Historia** (`/historia`) - Libros de historia
- **Arte** (`/arte`) - Libros de arte
- **Registro** (`/registro`) - Página de registro
- **Contacto** (`/contacto`) - Información de contacto

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

## 📝 Notas

- El proyecto utiliza TypeScript en el backend para mayor robustez
- Prisma Studio está disponible para gestión visual de la base de datos
- La aplicación incluye manejo de CORS para desarrollo
- Validaciones implementadas tanto en frontend como backend

---

**Desarrollado por Justina Smith para UTN - Desarrollo de Software 2025**
