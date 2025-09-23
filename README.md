Perfecto 🚀 Te actualizo el **README** con la sección de **Docker Desktop**, de modo que quede claro cómo levantar todo el stack (frontend + backend + base de datos) sin instalar dependencias localmente.

---

# 📚 MiauBooks - Librería Online

Una aplicación web completa de librería desarrollada con **React** (frontend) y **Express.js** (backend) con **Prisma** como ORM.

## 🚀 Características

* **Frontend**: React con Vite, React Router para navegación
* **Backend**: Express.js con TypeScript
* **Base de datos**: PostgreSQL con Prisma ORM
* **Navegación**: Sistema de rutas completo
* **Categorías**: Ficción, Novela, Historia, Arte
* **Funcionalidades**:

  * CRUD completo de libros, autores y categorías
  * Autenticación y Autorización con JWT
  * Manejo de roles (USER, ADMIN, MODERATOR) con distintos niveles de acceso

## 🛠️ Tecnologías Utilizadas

### Frontend

* React 18
* Vite
* React Router DOM
* CSS3
* Context/Custom Hooks para manejo de sesión y token JWT

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Zod (validación)
* CORS
* jsonwebtoken (JWT) para autenticación
* bcrypt para encriptación de contraseñas

---

## 🐳 Ejecución con Docker Desktop

Ahora la aplicación puede levantarse fácilmente con **Docker Desktop** (sin necesidad de instalar Node ni PostgreSQL en tu máquina).

### 1. Prerrequisitos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
* Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd UTN-DS25-practicas
```

### 2. Levantar los servicios

En la raíz del proyecto ejecutar:

```bash
docker compose up --build
```

Esto levanta:

* **Frontend** (React) en [http://localhost:5173](http://localhost:5173)
* **Backend** (Express) en [http://localhost:3000](http://localhost:3000)
* **Prisma Studio** [http://localhost:5555](http://localhost:5555) (si está configurado)
* **Base de datos** PostgreSQL en el puerto `5432`

### 3. Ejecutar migraciones y seed

Una vez corriendo, dentro del contenedor `backend` podés correr:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend node prisma/seed.js
```

Esto crea las tablas y carga usuarios, autores, categorías y libros de ejemplo.

---

## 🚀 Instalación Manual (sin Docker)

> Si preferís levantarlo de forma manual, seguí estos pasos:

### Prerrequisitos

* Node.js (v16 o superior)
* PostgreSQL
* npm o yarn

### 1. Backend

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

### 2. Frontend

```bash
cd ../../react
npm install
```

### 3. Ejecutar la aplicación

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

---

## ✅ Puesta en marcha con datos de ejemplo

Para ver la app con datos ya cargados (seed incluido):

1. Backend

```bash
cd Express.js/mi-primera-api
npm run db:sync   # crea tablas y ejecuta el seed
npm run dev       # servidor en http://localhost:3000
```

2. Frontend

```bash
cd react
npm run dev       # abre la app en http://localhost:5173
```

Notas:

* El seed crea usuarios (USER, MODERATOR, ADMIN), autores, categorías y libros con portadas.

---

## 📖 API Endpoints

### Libros

* `GET /api/books`
* `GET /api/books/:id`
* `POST /api/books`
* `PUT /api/books/:id`
* `DELETE /api/books/:id`

### Autenticación

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/users`

---

## 🔒 Matriz de Permisos por Rol

| Funcionalidad                      | USER | MODERATOR | ADMIN |
| ---------------------------------- | :--: | :-------: | :---: |
| Ver libros                         |   ✅  |     ✅     |   ✅   |
| Crear / Editar libros              |   ❌  |     ✅     |   ✅   |
| Eliminar libros                    |   ❌  |     ❌     |   ✅   |
| Ver lista de usuarios              |   ❌  |     ✅     |   ✅   |
| Ver usuario específico             |   ❌  |     ✅     |   ✅   |
| Crear / Editar / Eliminar usuarios |   ❌  |     ❌     |   ✅   |
| Ver estadísticas                   |   ❌  |     ❌     |   ✅   |

---

## 🎨 Páginas de la Aplicación

* **Inicio** (`/`)
* **Catálogo** (`/catalogo`)
* **Ficción** (`/ficcion`)
* **Novela** (`/novela`)
* **Historia** (`/historia`)
* **Arte** (`/arte`)
* **Registro** (`/registro`)
* **Iniciar Sesión** (`/iniciar-sesion`)
* **Contacto** (`/contacto`)
* **Panel de Moderación** (`/moderador`)
* **Panel de Administración** (`/admin`)

---

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como práctica para la materia **Desarrollo de Software** de la **UTN** (2025).

### Funcionalidades Implementadas

* ✅ CRUD de libros
* ✅ Sistema de categorías
* ✅ Navegación con React Router
* ✅ Validación con Zod
* ✅ Manejo de errores
* ✅ Interfaz responsive
* ✅ Integración frontend-backend
* ✅ Autenticación y autorización con JWT
* ✅ Gestión de roles (USER, ADMIN, MODERATOR)

---

**Desarrollado por Justina Smith para UTN - Desarrollo de Software 2025**
