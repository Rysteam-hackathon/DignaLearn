# DignaLearn — Documento de Continuidad Sesión 6
> Leé TODO esto antes de responder. Sos el asistente de arquitectura de DignaLearn.
> Calidad sobre velocidad. Confirmar antes de codear. Paso a paso siempre.

---

## Estado del proyecto al cierre de Sesión 6

### Commits recientes (rama feature/monorepo-setup)
- fix: seguridad - JWT en endpoints estudiante, maybeSingle docente, CORS restrictivo
- feat: animaciones Framer Motion en iconos dashboard y niveles
- feat: fondo animado unificado, dashboard adaptado a ambos modos, fix dark mode tarjetas
- feat: rediseño Extras, Progreso y Logros con animaciones Framer Motion
- fix: LogroCelebracion dispara desde cualquier componente sin importar orden
- feat: migrar progreso a backend, landing mejorado con grados y animaciones

### Lo que funciona y está verificado en esta sesión (Playwright + login real DL-TEST/1234)
- Fondo animado en TODAS las páginas del estudiante: dos capas coexistiendo en `layout.tsx` —
  el sistema de círculos original (`FIGURAS_FONDO`) y el nuevo `FondoAnimado.tsx` (8 figuras
  SVG temáticas: venus, libro, estrella, balanza, lápiz), ambas en `z-index: 0` (nunca negativo,
  ver "Errores que NO se deben cometer" más abajo).
- Dashboard: tarjeta "Continuar" con gradiente rosa→celeste en modo claro, `#160B24` en modo
  oscuro; tarjetas "Último logro"/"Unidades" con contraste correcto en ambos modos; accesos
  rápidos con ícono animado específico por rol (scale para Niveles, wiggle para Logros,
  scale+rotate para Historia) y hover con sombra tintada del color de marca.
- Niveles: cards de unidades y de temas con entrada escalonada Framer Motion (`delay: idx * 0.1`
  y `idx * 0.08` respectivamente), hover con sombra por color de unidad, ícono animado distinto
  por unidad (flor con rotate, balanza con wiggle horizontal, apretón de manos con pulse,
  estrella con rotate+scale). Candados y shake en unidades/temas bloqueados ya existían de
  antes y siguen intactos.
- Sistema de logros: `POST /api/progress/completar-elemento` evalúa logros en la misma
  request si el tema queda completo — resuelto el bug de orden de finalización.
- Auditoría de seguridad completa (ver sección dedicada) con 4 fixes aplicados y verificados.

### Base de datos — solo lo verificado en esta sesión (auditoría de seguridad)
- RLS habilitado (`rowsecurity = true`) en: `grados`, `unidades`, `perfiles_estudiante`,
  `progreso_estudiante`, `actividad_diaria`, `estudiante_logros`, `usuarios`, `temas`,
  `docente_estudiantes`, `perfiles_docente`, `logros`.
- Políticas para rol `anon` en `progreso_estudiante`/`actividad_diaria`/`estudiante_logros`/
  `usuarios` tienen `qual: true` (sin condición real) — ver PENDIENTE 1.
- No se re-verificaron los conteos totales de temas/unidades/actividades en esta sesión
  (la Sesión 5 registró 34 temas, 8 unidades, 135 actividades, 12 logros — no confirmado de
  nuevo acá).
- Estudiante de prueba usado en todas las verificaciones: `DL-TEST` / PIN `1234`
  (`grado_id: 1` → "7mo grado — secundaria").

---

## Auditoría de seguridad de Sesión 6 — hallazgos y fixes

### 🔴 Hallazgo crítico 1 — Endpoints de estudiante sin verificar JWT (CORREGIDO)
`verificar_token()` existía en `auth_service.py` pero nunca se llamaba desde ningún router.
`POST /api/progress/completar-elemento` y `POST /api/gamification/evaluar/{estudiante_id}`
aceptaban `estudiante_id` directo del body/URL sin verificar que el caller fuera realmente
ese estudiante.

**Fix aplicado:** nueva función `verificar_estudiante_autenticado(authorization, estudiante_id)`
en `auth_service.py` — valida el header `Bearer`, decodifica el token, compara `sub` contra
el `estudiante_id` recibido, devuelve el `estudiante_id` **del token** (nunca del body/URL
directamente) o lanza 401. Ambos endpoints ahora la usan.

**Verificado:** sin token → 401. Con token de otro estudiante → 401. Con token válido y
coincidente → 200.

### 🔴 Hallazgo crítico 2 — Políticas RLS no aíslan datos por estudiante (NO CORREGIDO — ver PENDIENTE 1)
Como el estudiante no usa Supabase Auth, el cliente del navegador siempre es `anon` puro.
Las políticas `"estudiante puede leer/actualizar su propio progreso"` tienen `qual: true` —
sin ninguna condición real. Cualquiera con la anon key pública (que va en el bundle del
frontend por diseño) puede leer o modificar el progreso/actividad/logros de **cualquier**
estudiante llamando directo a la REST API de Supabase. El fix del hallazgo 1 protege las
escrituras que pasan por el backend, pero las lecturas directas del frontend a Supabase
(dashboard, progreso, niveles) siguen expuestas a nivel de base de datos.

### 🟡 `.single()` en vez de `.maybeSingle()` (CORREGIDO)
`frontend/lib/auth.ts:104` y `frontend/app/docente/page.tsx:67` — ambos en el flujo de login
docente, consultando `perfiles_docente` por `usuario_id`. Cambiados a `.maybeSingle()`.

### 🟡 Catches que silenciaban el error real (CORREGIDO)
`dashboard/page.tsx`, `progreso/page.tsx`, `app/docente/page.tsx` — se agregó
`console.error("Error:", error)` en los 3 catches que antes solo seteaban un estado de
fallback sin loguear nada.

### 🟢 CORS demasiado permisivo (CORREGIDO)
`backend/app/main.py` — `allow_origins` pasó de `["*"]` a una lista explícita
(`localhost:3000`, `localhost:3001`, `FRONTEND_URL` con fallback).

### ✅ Descartado — sin hallazgos
- Sin credenciales hardcodeadas (JWT_SECRET_KEY falla explícito si falta del `.env`).
- `.env`/`.env.local` correctamente en `.gitignore`, no trackeados en git.
- `frontend/.env.local` solo tiene las 3 variables `NEXT_PUBLIC_*` correctas — nunca la
  service_role key.
- Los 12 `MutationObserver` del proyecto tienen su `.disconnect()` en cleanup — sin memory
  leaks reales.
- `localStorage` no se lee saltándose `getEstudianteLocal()` en ningún lugar relevante para
  auth (`lib/api.ts` lee el token crudo intencionalmente, no reconstruye identidad).

---

## Errores que NO se deben cometer (acumulado — incluye lo aprendido en Sesión 6)

1. NUNCA usar `.single()` en queries de Supabase — siempre `.maybeSingle()`. Ya no debería
   quedar ningún `.single()` en el frontend — verificar con `grep -rn "\.single()" frontend/`
   antes de dar por cerrado cualquier PR.
2. NUNCA hacer server components en páginas del estudiante — todo debe ser `"use client"`.
3. NUNCA hardcodear colores sin considerar ambos modos — usar el hook `esOscuro` o
   `var(--foreground)`/`var(--background)`.
4. **NUEVO — NUNCA usar `-z-10` (z-index negativo) en un fondo animado si su contenedor
   padre tiene `position: static` y un `background-color` propio.** El fondo del padre se
   pinta en la capa de "contenido no posicionado", que queda POR ENCIMA de cualquier
   descendiente con z-index negativo en el mismo contexto de apilamiento — el fondo
   animado queda invisible aunque exista en el DOM con opacity:1. Usar `z-0` (no negativo)
   y asegurarse de que `<aside>`/`<main>` tengan `z-10` o más.
5. **NUEVO — Framer Motion es OBLIGATORIO para animaciones de interfaz, no CSS puro.**
   Revierte la regla de sesiones anteriores. Ver PARTE 20 del PRD para el patrón exacto
   (config por ícono + `motion.div` + `whileHover`).
6. **NUEVO — Ningún endpoint que reciba `estudiante_id` en body/URL debe confiar en ese
   valor sin verificar el JWT primero.** Usar `verificar_estudiante_autenticado()` de
   `auth_service.py` y operar siempre con el `estudiante_id` que esa función retorna.
7. NUNCA hacer commit o push sin instrucción explícita y separada del usuario, ni sin correr
   antes `npx tsc --noEmit` (0 errores obligatorio).
8. El backend usa `--reload` de uvicorn — si pierde el proceso, buscar el PID real con
   `Get-CimInstance Win32_Process` y matarlo con `taskkill /PID x /T /F` antes de relanzar.
9. Verificar SIEMPRE en navegador real (Playwright u otro), no solo con `tsc` — varios bugs
   de esta sesión (fondo invisible, RLS, CORS) no los hubiera detectado el compilador.

---

## Verificaciones obligatorias antes de cada commit

1. `npx tsc --noEmit` en `frontend/` — debe dar 0 errores.
2. Login `DL-TEST`/`1234` funciona (backend + frontend corriendo).
3. Si se tocó un endpoint de estudiante: probar sin token (401) y con token válido (200).
4. No hay `.single()` en ningún archivo del frontend.
5. No hay animaciones nuevas hechas solo con CSS `@keyframes` — deben ser Framer Motion.
6. Verificar visualmente en navegador (no solo compilación) los cambios de UI.

---

## Pendientes — EN ORDEN DE PRIORIDAD

### PENDIENTE 1 — RLS real por estudiante (seguridad, máxima prioridad)
`progreso_estudiante`, `actividad_diaria`, `estudiante_logros` tienen políticas `anon` con
`qual: true` — sin aislamiento real por estudiante. Decidir un mecanismo (función Postgres
que valide el JWT propio, o mover las lecturas de progreso del frontend a través del
backend en vez de ir directo a Supabase) antes de considerar esto resuelto. Ver PARTE 20
del PRD para el detalle completo del hallazgo.

### PENDIENTE 2 — Auditoría completa de contraste en dark mode
Esta sesión corrigió puntualmente el dashboard. Falta una pasada completa de TODAS las
páginas del estudiante y del docente en ambos modos.

### PENDIENTE 3 — Rotación de variantes de actividades
Cuando el estudiante repite un tema completado, mostrar una variante distinta de sopa de
letras/quiz (`grupo_variante` 1/2/3). No tocado desde Sesión 5.

### PENDIENTE 4 — Probar panel del docente end-to-end
Login docente → crear estudiante → ver progreso → resetear PIN. La auditoría confirmó por
lectura de código que `_verificar_docente_autenticado` es correcta, pero no se ejecutó el
flujo completo en navegador esta sesión.

### PENDIENTE 5 — Mascota guía
No iniciado.

### PENDIENTE 6 — Integración Modo Historia (Sidar)
Estado no verificado esta sesión.

### PENDIENTE 7 — README + ejecución local
No iniciado.

---

## Stack y configuración

Frontend: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion — http://localhost:3000
Backend: FastAPI Python — http://localhost:8000
BD: Supabase PostgreSQL cloud — https://mejylwssptaxsvbbwmya.supabase.co
Repo: https://github.com/Rysteam-hackathon/DignaLearn (rama feature/monorepo-setup)

Arranque:
Terminal 1 — cd C:\Users\DELL\Desktop\DignaLearn\backend && venv\Scripts\activate && uvicorn app.main:app --reload
Terminal 2 — cd C:\Users\DELL\Desktop\DignaLearn\frontend && npm run dev

Colores del branding (INMUTABLES):
- #160B24 Púrpura Profundo
- #F0A8B6 Rosa Pastel
- #A4CDD5 Celeste Pastel
- #FFFFFF Blanco

Tipografías: Playfair Display (headings) + Nunito (body)
**Framer Motion obligatorio para animaciones de interfaz — ya NO es "solo CSS".**

---

## Cómo arrancar la próxima sesión

1. Leer este archivo completo.
2. Levantar servidores (ver comandos arriba).
3. Verificar que login `DL-TEST`/`1234` funciona.
4. Arrancar con PENDIENTE 1 (RLS real por estudiante) — es el único hallazgo de seguridad
   que quedó abierto de la auditoría de esta sesión.
5. Luego los demás pendientes en orden.

*Generado al cierre de Sesión 6*
