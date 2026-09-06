# DignaLearn

Plataforma educativa gamificada para la asignatura **"Derechos y Dignidad de la Mujer"** del MINED Nicaragua (7mo y 9no grado de secundaria). Desarrollada por el equipo **Rysteam** para el Hackathon Nicaragua 2026.

> Para conocer al equipo y la motivación del proyecto, ver [LÉAME.md](./LÉAME.md). Este documento es la guía técnica para levantar el proyecto localmente.

## ¿Qué hace la plataforma?

- **Estudiante**: recorre unidades y temas del currículo, completa actividades gamificadas (sopa de letras, quiz, conectores, clasificación, rompecabezas, escenarios de reflexión), desbloquea logros e insignias, mantiene una racha de actividad diaria, y accede a un Modo Historia narrativo.
- **Docente**: gestiona sus grupos, crea cuentas de estudiante, resetea PINs, y ve el progreso agregado de cada grupo.
- **Admin de Institución**: gestiona grupos y cuentas de docente dentro de su institución, y ve reportes agregados por grupo.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion |
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL, gestionado por Supabase (PostgREST + Supabase Auth) |
| Autenticación estudiante | JWT propio (PyJWT, HS256) — el estudiante no usa Supabase Auth |
| Autenticación docente / admin | Supabase Auth (email + contraseña) |

## Estructura del repositorio

```
DignaLearn/
├── frontend/          Next.js — páginas de estudiante, docente y admin
├── backend/           FastAPI — routers, servicios, cliente de Supabase
├── db/                schema.sql, seed.sql, migraciones de RLS
└── docs/curriculum/    contenido curricular de referencia (MINED)
```

## Requisitos previos

- Node.js 18+ y npm
- Python 3.11+
- Una cuenta y proyecto de [Supabase](https://supabase.com) (plan gratuito alcanza)

## Instalación

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Crear `backend/.env` con:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET_KEY=
FRONTEND_URL=http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
```

Crear `frontend/.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 3. Base de datos

En el SQL Editor de tu proyecto de Supabase, corré en orden:

1. `db/schema.sql` — crea todas las tablas, catálogos y constraints.
2. `db/seed.sql` — carga datos mínimos para poder loguear y probar (institución de prueba, grados, roles, tipos de actividad, un tema con actividades de ejemplo).
3. Las migraciones de `db/migrations/001_*.sql` a `005_*.sql`, en orden — agregan columnas (`tema_id` en logros) y las políticas de RLS reales.

Después de correr el seed, vas a necesitar crear manualmente en el SQL Editor (o en el dashboard de Supabase Auth) las cuentas de **docente** y **admin** de prueba — ver la sección de credenciales abajo. El estudiante de prueba sí queda creado por el seed (usa PIN, no Supabase Auth).

## Arranque (2 servidores en paralelo)

**Terminal 1 — backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```
Corre en `http://localhost:8000` (docs interactivas en `/docs`).

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
Corre en `http://localhost:3000`.

## Credenciales de prueba

| Rol | Cómo entra | Credenciales |
|---|---|---|
| Estudiante | `/login` → pestaña Estudiante | Código `DL-TEST` / PIN `1234` |
| Docente | `/login` → pestaña Docente | `docente@dignalearn.com` / `Docente1234` |
| Admin de Institución | `/admin` | `admin@dignalearn.com` / `AdminTest1234` |

Estas cuentas de docente y admin no las crea el seed automáticamente (requieren Supabase Auth) — creálas vos mismo con `supabase.auth.admin.create_user(...)` (ver comentario al final de `db/seed.sql`) o desde el dashboard de Supabase, y después insertá su fila correspondiente en `perfiles_docente` / `perfiles_admin_institucion`.

## Notas

- Nunca commitear `.env` / `.env.local` — ya están en `.gitignore`.
- El estudiante nunca usa Supabase Auth (JWT propio); docente y admin sí, con clientes de Supabase separados en el frontend (`supabaseDocente` / `supabaseEstudiante`) para evitar contaminación de sesión entre roles.
- `db/schema.sql` es la fuente de verdad de la estructura de tablas; las políticas de RLS viven en `db/migrations/`.
