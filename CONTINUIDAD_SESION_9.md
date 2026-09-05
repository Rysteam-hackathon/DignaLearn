## DignaLearn — Documento de Continuidad Sesión 9

> Sos el asistente de arquitectura de DignaLearn. Leé TODO antes de responder.
> Calidad sobre velocidad. Confirmar antes de codear. Paso a paso siempre.

---

### Identidad del proyecto

**DignaLearn** es una página web educativa gamificada para la asignatura oficial del MINED Nicaragua **"Derechos y Dignidad de la Mujer"**, dirigida a estudiantes de 7mo y 9no grado de secundaria. Fue desarrollada por el **Equipo Rysteam** para el **Hackathon Nicaragua 2026**.

**No es una app móvil — es una página web responsive.**
**El verbo correcto es "fortalecemos" — no "transformamos".**
**La experiencia se llama "experiencia educativa" — no "plataforma".**

---

### Equipo (4 miembros — Ronald Dávila eliminado definitivamente)

| Miembro | Rol |
| ----- | ----- |
| Dirk Martinez | Backend — contacto técnico principal |
| Eddy Marenco | Líder, Marketing y Comunicaciones |
| Sharis Peralta | Diseño |
| Sidar Perez | Frontend y Modo Historia |

---

### Stack tecnológico

| Capa | Tecnología |
| ----- | ----- |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS + Framer Motion |
| Backend | FastAPI Python |
| BD + Auth | Supabase PostgreSQL (cloud) |
| Repo | github.com/Rysteam-hackathon/DignaLearn |
| Rama activa | `feature/monorepo-setup` |

**Rutas en la laptop de Dirk (HP nueva):**

- Proyecto: `C:\Users\USER\Desktop\DignaLearn`
- Backend: `C:\Users\USER\Desktop\DignaLearn\backend`
- Frontend: `C:\Users\USER\Desktop\DignaLearn\frontend`

**Arranque de servidores:**

```
Terminal 1: cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
Terminal 2: cd frontend && npm run dev
```

**URLs:**

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Supabase: https://mejylwssptaxsvbbwmya.supabase.co

---

### Credenciales de prueba

| Rol | Credencial |
| ----- | ----- |
| Estudiante 7mo | DL-TEST / PIN 1234 |
| Estudiante 9no | DL-A0NS / PIN desconocido (resetear si hace falta) |
| Docente | docente@dignalearn.com / Docente1234 |
| Email oficial | dignalearnRS@gmail.com |

---

### Colores del branding (INMUTABLES — nunca cambiar)

| Nombre | HEX |
| ----- | ----- |
| Púrpura Profundo | `#160B24` |
| Rosa Pastel | `#F0A8B6` |
| Celeste Pastel | `#A4CDD5` |
| Blanco | `#FFFFFF` |

**Tipografía:**

- Headings: `var(--font-heading)` = `'Sitka Small', 'Sitka', 'Cambria', Georgia, serif`
- Body: Nunito (Google Fonts)

**Reglas del logo (INMUTABLES):**

- "Digna" en fondo oscuro: `#FFFFFF`
- "Learn" SIEMPRE: `#F0A8B6` — nunca cambia sin importar el fondo
- Componente: `LogoDignaLearn.tsx` con prop `darkBackground`

---

### Arquitectura de datos real (modelo multi-institución)

```
instituciones
  └── perfiles_admin_institucion (usuario_id FK auth.users)
  └── perfiles_docente (institucion_id FK)
  └── grupos (institucion_id FK, grado_id, nombre ej: "7mo A")
        └── docente_grupos (docente_id FK, grupo_id FK)
        └── perfiles_estudiante (grupo_id FK, grado_id)
              └── progreso_estudiante (lectura_completada, actividad_completada, reflexion_respondida)
              └── actividad_diaria (fecha_actividad)
              └── estudiante_logros (logro_id FK)
```

**Datos de prueba en BD:**

- Institución: "Instituto Nacional de Prueba" (INP-2026, Managua)
  - id: `ecd9ef41-0bcd-434c-afc7-7df440c26291`
- Grupos: "7mo A" (`9696ed2b...`), "9no A" (`d3b92e8b...`)
- Docente: `654b7e85...` asignado a ambos grupos
- Estudiantes: DL-TEST y DL-E492/Ana García en 7mo A, DL-A0NS/Prueba 9no en 9no A

**Nombres reales de columnas importantes:**

- `perfiles_estudiante`: `codigo_acceso`, `pin_hash`, `grado_id`, `grupo_id`, `usuario_id`
- `progreso_estudiante`: `lectura_completada`, `actividad_completada`, `reflexion_respondida` (NO existe columna "completado")
- `actividad_diaria`: `fecha_actividad` (NO es "fecha")
- `logros`: `titulo`, `tipo_condicion`, `valor_condicion`, `nivel_logro_id` (NO es nombre/nivel/icono_tipo)
- `grados`: `numero_grado`, `nombre_display` (NO es "nombre")

---

### Sistema de autenticación — DOS flujos distintos

**ESTUDIANTE (sin email):**

- Login: `POST /api/auth/login-estudiante` con `codigo_acceso` + `pin`
- Backend verifica PIN con bcrypt — emite JWT propio (PyJWT, HS256, 7 días)
- Payload JWT: `{ sub: estudiante_id, grado_id, access_code, nombre }`
- Frontend guarda en `localStorage["dignalearn_token"]`
- Verificación en endpoints: `verificar_estudiante_autenticado(authorization, estudiante_id)` en `auth_service.py`
  - Valida header Bearer, decodifica token, compara `sub` contra `estudiante_id` recibido
  - Devuelve 401 si no coincide o falta el token
  - El endpoint usa el `estudiante_id` DEL TOKEN, nunca del body/URL directamente

**DOCENTE (con email):**

- Login: `supabase.auth.signInWithPassword(email, password)`
- Usa Supabase Auth estándar — JWT de Supabase
- Verificación: `verificar_docente_autenticado(authorization)` usando `supabase.auth.get_user(token)`

**Son dos sistemas completamente distintos y coexisten a propósito.**

---

### Endpoints del backend

```
POST /api/auth/login-estudiante       — JWT propio para estudiante
GET  /api/grupos/mis-grupos           — grupos del docente autenticado
GET  /api/grupos/{id}/estudiantes     — batch queries (NO N+1)
GET  /api/grupos/{id}/stats           — estadísticas del grupo
POST /api/docente/estudiantes         — crear estudiante con grupo_id
POST /api/docente/resetear-pin        — resetear PIN de estudiante
POST /api/progress/completar-elemento — progreso + evaluación de logros
POST /api/gamification/evaluar/{estudiante_id} — re-evaluar logros
```

**Archivos de backend relevantes:**

- `backend/app/routers/auth.py` — login estudiante
- `backend/app/routers/docente.py` — gestión de estudiantes
- `backend/app/routers/grupos.py` — endpoints de grupos (NUEVO)
- `backend/app/routers/progress.py` — progreso del estudiante
- `backend/app/routers/gamification.py` — evaluación de logros
- `backend/app/services/auth_service.py` — verificar_estudiante_autenticado, verificar_docente_autenticado
- `backend/app/services/gamification.py` — evaluar_logros(), _cantidad_unidades_desbloqueadas()
- `backend/app/supabase_client.py` — get_supabase_client()
- `backend/app/main.py` — CORS configurado para localhost:3000, 3001, 127.0.0.1:3000, 127.0.0.1:3001

---

### Flujo de navegación completo por rol

**ESTUDIANTE:**

```
/ (landing)
→ /login (código DL-XXXX + PIN de 4 dígitos)
→ /dashboard (racha, último logro, continuar donde quedó)
  → /niveles (4 unidades de su grado)
    → /niveles/[unitId] (temas de la unidad, secuenciales)
      → /niveles/[unitId]/[topicId]
          [1] Lectura → [2] Sopa de letras o Quiz → [3] Reflexión
          Al completar los 3: tema "dominado" → evaluación de logros
  → /historia (Modo Historia — placeholder "Próximamente")
  → /progreso (racha, calendario, colección de logros)
  → /extras (dark mode toggle, cambiar PIN, equipo, acerca de)
```

**DOCENTE:**

```
/ (landing)
→ /login (email + contraseña Supabase Auth)
→ /docente
  → Header: logo + nombre de institución + botón Salir
  → Tabs de grupos (7mo A | 9no A) con pill animado
  → Stats del grupo activo (total, promedio, activos, sin actividad)
  → Lista de estudiantes del grupo con barra de progreso
  → Click en estudiante → detalle expandible (código, logros, resetear PIN)
  → "+ Agregar estudiante" → modal (nombre, grado, PIN inicial)
  → Vista éxito del modal → muestra código DL-XXXX + PIN juntos
```

**ADMIN DE INSTITUCIÓN (pendiente de construir):**

```
→ /admin (panel de institución)
  → Crear/editar grupos ("7mo A", "9no B", etc.)
  → Crear docentes y asignarlos a grupos
  → Ver reportes agregados de toda la institución
```

**Regla de aislamiento:**

- El estudiante NUNCA ve datos de otros estudiantes
- El docente SOLO ve sus grupos asignados
- Una institución NUNCA ve datos de otra

---

### RLS (Row Level Security) — estado actual

**Tablas con RLS habilitado y políticas correctas:**

- `instituciones` — solo autenticados pueden leer
- `grupos` — solo autenticados pueden leer
- `docente_grupos` — solo el docente dueño puede leer
- `perfiles_admin_institucion` — solo el admin dueño puede leer
- `grados`, `unidades`, `temas` — cualquier autenticado puede leer
- `perfiles_docente`, `perfiles_estudiante` — con políticas

**⚠️ PENDIENTE CRÍTICO DE SEGURIDAD:**
`progreso_estudiante`, `actividad_diaria`, `estudiante_logros` tienen políticas `anon` con `USING (true)` — sin aislamiento real. Cualquier persona con la anon key pública (que está expuesta en el bundle del frontend) puede leer y escribir datos de cualquier estudiante directamente a la REST API de Supabase, sin pasar por el backend.

**Fix planeado:** mover TODAS las lecturas de progreso del frontend al backend mediante endpoints GET autenticados con JWT. Las escrituras ya están protegidas por el backend.

---

### Catálogo de logros (13 logros en BD)

**Nivel unidad (4 logros):**

- Guardianes de la Dignidad (Unidad I)
- Conocedores de la Ley (Unidad II)
- Defensores de la Equidad (Unidad III)
- Líderes en Acción (Unidad IV)

**Nivel especial (8 logros):**

- El Primer Paso, Constante (5 días), Semana Activa (7 días), Imparable (30 días)
- Coleccionista (3 logros de unidad), Ojo Alerta, Protagonismo de Nicaragua, Seriamente

**Nivel tema:** un logro por cada tema dominado (~16 por grado)

**LogroIcono.tsx:** 14 SVGs únicos con animaciones Framer Motion propias por tipo. Diferencia logros de unidad por `nombre_logro` (prop string) y logros de racha por `condicion_valor` (prop number).

---

### Componentes clave del frontend

```
frontend/
  app/
    page.tsx                          — Landing page completo
    (auth)/login/page.tsx             — Login con fondo animado
    (student)/
      layout.tsx                      — Sidebar sticky + nav móvil
      dashboard/page.tsx              — Dashboard del estudiante
      niveles/page.tsx                — Lista de unidades
      niveles/[unitId]/page.tsx       — Lista de temas
      niveles/[unitId]/[topicId]/page.tsx — Tema completo
      logros/page.tsx                 — Colección de logros
      progreso/page.tsx               — Racha y estadísticas
      extras/page.tsx                 — Configuración y equipo
      historia/page.tsx               — Placeholder "Próximamente"
    docente/page.tsx                  — Panel del docente (rediseñado)
    privacidad/page.tsx               — Política de privacidad
    terminos/page.tsx                 — Términos de uso
    contacto/page.tsx                 — Contacto con formulario
  components/
    ui/
      LogoDignaLearn.tsx              — Logo con prop darkBackground
      PaginaLegal.tsx + SeccionLegal  — Layout compartido páginas legales
    games/
      WordSearch.tsx                  — Sopa de letras
      Quiz.tsx                        — Quiz de opción múltiple
    LogroIcono.tsx                    — 14 SVGs únicos con animaciones
    LogroCelebracion.tsx              — Modal de celebración (Portal + AnimatePresence)
    FondoAnimado.tsx                  — Fondo con figuras SVG temáticas
  lib/
    auth.ts                           — getEstudianteLocal(), loginEstudiante()
    api.ts                            — apiFetch() con Bearer token
    progress.ts                       — marcarElementoCompletado(), mapLogrosDesbloqueados()
    supabase.ts                       — cliente Supabase
```

---

### Último commit pusheado

`d925b06` — "feat: rediseño panel docente con selector de grupos y fix CORS"
**Rama:** `feature/monorepo-setup`
**Push:** confirmado

---

### PENDIENTES — en orden de prioridad lógica

#### 🔴 PRIORIDAD 0 — Verificar ahora mismo

**Panel del docente en navegador** — el rediseño existe en el archivo pero NUNCA se confirmó visualmente que carga el diseño oscuro con tabs de grupos. El fix de CORS también está pendiente de verificación.

- Levantar servidores
- Login docente — confirmar fondo oscuro, tabs "7mo A" / "9no A", stats reales
- Si aparece versión blanca vieja: `rmdir /s /q .next` y reiniciar frontend

#### 🔴 PRIORIDAD 1 — Seguridad crítica

**RLS real por estudiante**

- `progreso_estudiante`, `actividad_diaria`, `estudiante_logros` con `qual: true`
- Solución: crear endpoints GET en `progress.py` y mover lecturas del frontend al backend
- Archivos a tocar: `backend/app/routers/progress.py`, `dashboard/page.tsx`, `progreso/page.tsx`, `logros/page.tsx`, `niveles/page.tsx`

#### 🟡 PRIORIDAD 2 — Mejoras del panel del docente

**Panel más profesional e interactivo** — el diseño actual funciona pero falta:

- Animaciones de entrada más perceptibles en stats y lista de estudiantes
- Mejor UX en el modal de agregar estudiante
- Integrar con el flujo de institución de forma más visible

#### 🟡 PRIORIDAD 3 — Verificaciones pendientes

**9no grado end-to-end** — DL-A0NS nunca probado en navegador

- Iniciar sesión con DL-A0NS en ventana incógnita
- Confirmar que ve las 4 unidades de 9no (no de 7mo)
- Confirmar que los temas son los de 9no

**Ilustraciones SVG de logros** — `LogroIcono.tsx` nunca verificado visualmente

- Ir a `/logros` con DL-TEST logueado
- Confirmar que cada logro muestra ícono distinto con animación propia

**Auditoría dark mode completa** — solo dashboard corregido puntualmente

#### 🟡 PRIORIDAD 4 — Funcionalidad nueva

**Panel de Admin de Institución**

- `perfiles_admin_institucion` existe en BD pero no hay UI ni endpoints
- Crear `frontend/app/admin/page.tsx`
- Crear `backend/app/routers/admin.py`
- Flujo: crear grupos, crear docentes, asignar docentes a grupos, ver reportes

**Rotación de variantes de actividades**

- `grupo_variante` 1/2/3 en `niveles/[unitId]/[topicId]/page.tsx`
- Si el tema ya fue completado, rotar al siguiente variant

**Nuevos tipos de actividad**

- `Rompecabezas.tsx`, `Conectores.tsx`, `ArrastrarOrdenar.tsx`
- Mismo contrato que `WordSearch.tsx` y `Quiz.tsx`
- Llaman a `marcarElementoCompletado` al terminar

**Mascota guía**

- Fixed esquina inferior derecha (~44×44px)
- Pistas progresivas desde tabla `pistas_actividad`
- Solo aparece en páginas de tema activo
- Animación idle Framer Motion: `animate={{ y: [0, -4, 0] }}` loop

**Acordeón de lectura expandible**

- Preview primeras 100 palabras de `contenido_lectura` en página de unidad
- AnimatePresence + motion.div height:auto
- Archivo: `frontend/app/(student)/niveles/[unitId]/page.tsx`

#### 🟢 PRIORIDAD 5 — Visual

**Revisión mobile completa** — Chrome DevTools → iPhone 12 Pro (390px)
**Modo Historia** — en espera de Sidar, sin acción nuestra

#### 🔵 PRIORIDAD 6 — Pre-despliegue

**README**, **seed.sql sincronizado**, **CORS producción** (URL de Vercel)

---

### Reglas que NUNCA se deben violar

1. **NUNCA @keyframes CSS** — siempre Framer Motion para animaciones
2. **NUNCA `.single()`** — siempre `.maybeSingle()` en Supabase queries
3. **NUNCA catches vacíos** — siempre `console.error(error)` real
4. **NUNCA z-index negativo** en fondos animados — usar `z-0` con `z-10` en contenido
5. **NUNCA hardcodear colores sin variante dark** — usar hook `esOscuro` o `var(--foreground)`
6. **NUNCA confiar en `estudiante_id` del body/URL** sin verificar JWT primero — usar `verificar_estudiante_autenticado()` de `auth_service.py` y operar con el `estudiante_id` que esa función retorna
7. **NUNCA commit sin `npx tsc --noEmit` → 0 errores**
8. **NUNCA commit/push sin instrucción explícita del usuario**
9. **NUNCA dar tarea por cerrada sin verificar en navegador real** — compilación exitosa NO garantiza funcionamiento
10. **NUNCA asumir que un archivo fue creado** — verificar con `ls` o `dir` después de cada creación
11. **NUNCA `npm run build` en desarrollo**
12. **NUNCA "insignias"** — el sistema usa "logros"
13. **NUNCA "plataforma"** — es una "experiencia educativa"
14. **NUNCA "Ronald"** — fue eliminado definitivamente del proyecto
15. **uvicorn `--reload` puede servir código viejo** — si los cambios no se reflejan, matar el proceso y relanzar limpio
16. **NUNCA hacer queries en loop (N+1)** — siempre batch queries con `.in_()` + diccionarios en memoria

---

### Validaciones obligatorias antes de cada commit

1. `npx tsc --noEmit` → 0 errores
2. Login `DL-TEST`/`1234` funciona en navegador
3. Si se tocó endpoint de estudiante: probar sin token (→ 401) y con token válido (→ 200)
4. No hay `.single()`: `grep -rn "\.single()" frontend/`
5. No hay `@keyframes`: `grep -rn "@keyframes\|animation:" frontend/app/`
6. Verificar visualmente en navegador los cambios de UI
7. Después de crear archivo nuevo: `ls <directorio>` para confirmar existencia
8. Después de cambio de BD: query de verificación real contra Supabase
9. Después de endpoint nuevo: curl real contra localhost con token válido

---

### Validaciones de existencia en BD que siempre hay que correr al hacer cambios de esquema

```sql
-- Verificar que no quedan estudiantes sin grupo
SELECT id, codigo_acceso FROM perfiles_estudiante WHERE grupo_id IS NULL;

-- Verificar que no hay mismatch grado estudiante vs grado grupo
SELECT pe.codigo_acceso, pe.grado_id, g.grado_id as grado_grupo
FROM perfiles_estudiante pe
JOIN grupos g ON g.id = pe.grupo_id
WHERE pe.grado_id != g.grado_id;

-- Verificar que todos los docentes tienen institución
SELECT pd.id FROM perfiles_docente pd WHERE pd.institucion_id IS NULL;

-- Verificar que no hay progreso huérfano
SELECT COUNT(*) FROM progreso_estudiante pr
LEFT JOIN perfiles_estudiante pe ON pe.id = pr.estudiante_id
WHERE pe.id IS NULL;

-- Verificar RLS de tablas nuevas
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('instituciones','grupos','docente_grupos','perfiles_admin_institucion');
```

---

### Workflow de trabajo

- **Este chat (Claude en claude.ai):** planificación, arquitectura, decisiones, mensajes para Claude Code
- **Claude Code (VS Code):** ejecución de código — Dirk pega los mensajes
- **Paso a paso:** un mensaje a la vez, verificar output antes de continuar
- **Output de terminal:** pegado como texto; resultados visuales como capturas de pantalla
- **`CONTEXTO_CLAUDE_CODE.md`** en raíz del repo es el handoff para Claude Code

---

### Cómo arrancar la próxima sesión

1. Subir `DignaLearn_PRD.md` y `CONTEXTO_CLAUDE_CODE.md` al nuevo chat
2. Pegar este documento
3. Levantar servidores
4. Verificar `DL-TEST`/`1234` funciona en http://localhost:3000
5. **PRIMERO:** verificar panel del docente (`docente@dignalearn.com` / `Docente1234`)
   - ¿Fondo oscuro `#160B24` con tabs de grupos?
   - Si aparece versión blanca: `rmdir /s /q .next` → reiniciar frontend
6. Continuar con los pendientes en orden de prioridad
