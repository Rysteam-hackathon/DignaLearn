# Contexto de sesión — Claude Code

> Generado como referencia por si el contexto de la conversación se compacta.
> Cubre todo lo trabajado en esta sesión (backend FastAPI, frontend Next.js, gamificación,
> panel docente, currículo). El historial de commits real está en `git log`.

## 1. Archivos modificados/creados y qué hace cada uno

### Backend (FastAPI, `backend/app/`)
- **`main.py`** — App FastAPI (`DignaLearn API`), CORS abierto, `load_dotenv()`, endpoint `GET /` de health check. Registra los routers `gamification` y `docente`.
- **`supabase_client.py`** — `get_supabase_client()`: cliente Supabase singleton (`@lru_cache`) usando `SUPABASE_SERVICE_ROLE_KEY` (bypassa RLS). Lo usan `services/gamification.py` y `routers/docente.py`.
- **`services/gamification.py`** — `evaluar_logros(estudiante_id, tema_id)`: evalúa todas las condiciones de logros (tema completado, primer tema, unidad completa por `numero_unidad`, grado completo, racha de días en 3 umbrales, "Ojo Alerta" al completar Unidad II, "Protagonismo de Nicaragua" solo en 9no) y otorga los que correspondan sin duplicar. Usa `tipo_condicion` + `valor_condicion` de la tabla `logros` como identificador, nunca IDs hardcodeados.
- **`routers/gamification.py`** — `POST /api/gamification/evaluar/{estudiante_id}` (body: `{tema_id}`), devuelve lista de logros recién desbloqueados.
- **`routers/docente.py`** — `GET /api/docente/estudiantes/{docente_usuario_id}` (lista con progreso resumido), `POST /api/docente/estudiantes` (crea usuario + perfil + vínculo docente-estudiante, genera código `DL-XXXX` único y hash de PIN con `bcrypt`), `POST /api/docente/resetear-pin`.
- **`requirements.txt`** — se agregaron `supabase` (cliente oficial Python) y `bcrypt`.
- **`.env`** (no versionado) — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (conexión directa Postgres, usada solo para verificaciones puntuales con `psycopg2`, no por la app).

### Frontend — lib (`frontend/lib/`)
- **`supabase.ts`** — cliente Supabase del navegador con `NEXT_PUBLIC_SUPABASE_ANON_KEY` (sujeto a RLS).
- **`auth.ts`** — `loginEstudiante(codigo, pin)` (consulta `perfiles_estudiante` + compara PIN con `bcryptjs` **en el cliente**), `loginDocente(email, password)` (usa `supabase.auth.signInWithPassword`), `getEstudianteLocal()` (lee `localStorage.dignalearn_user`).
- **`progress.ts`** — `obtenerProgresoPorTema`, `marcarElementoCompletado` (upsert en `progreso_estudiante`, calcula `completado_en`), `registrarActividadDiaria` (upsert en `actividad_diaria`), constante `PROGRESO_ACTUALIZADO_EVENT` (evento custom de `window` para sincronizar componentes sin prop drilling).

### Frontend — componentes de juego (`frontend/components/`)
- **`games/WordSearch.tsx`** — sopa de letras interactiva (genera grilla, selección por 2 clics, colores `#A4CDD5`/`#F0A8B6`), llama `marcarElementoCompletado(..., "actividad")` al completarse y dispara `PROGRESO_ACTUALIZADO_EVENT`. Botón "Completar todo (prueba)" solo en `NODE_ENV=development`.
- **`games/Quiz.tsx`** — quiz de una pregunta (recibe `temaId`), marca progreso al **responder** (correcto o no), no solo al acertar.
- **`Reflexion.tsx`** — pregunta de reflexión + `dato_extra`, marca `"reflexion"`, llama a `registrarActividadDiaria`, y si el tema queda 100% completo llama a `POST /api/gamification/evaluar/{id}` del backend y muestra `LogroCelebracion` en cola (soporta varios logros desbloqueados a la vez).
- **`LogroCelebracion.tsx`** — overlay de celebración (fondo `#160B24`, título `#F0A8B6`, descripción `#A4CDD5`), auto-cierre a los 4s, botón "Ver mis logros" → `/logros`. Animaciones `logro-overlay-fade`/`logro-pop` viven en `tailwind.config.ts` (no en `globals.css`, se sacaron de ahí para no duplicar).
- **`ProgresoLectura.tsx`** — barra de progreso dinámica (0-3 elementos) + botón "Marcar lectura completada"; escucha `PROGRESO_ACTUALIZADO_EVENT` para refrescarse cuando otro componente marca progreso.

### Frontend — páginas (`frontend/app/`)
- **`layout.tsx`** — `lang="es"`, metadata real de DignaLearn (antes tenía el boilerplate de create-next-app).
- **`(auth)/layout.tsx`**, **`(auth)/login/page.tsx`** — login con tabs "Soy estudiante" / "Soy docente"; redirige a `/dashboard` (estudiante) o `/docente`.
- **`(student)/layout.tsx`** — layout con sidebar (desktop) y bottom-nav (mobile), ítems: Inicio, Niveles, Historia, Progreso, Extras. Redirige a `/login` si no hay `getEstudianteLocal()`.
- **`(student)/niveles/page.tsx`** — lista de unidades del **grado real del estudiante logueado** (ya no hardcodea 7mo).
- **`(student)/niveles/[unitId]/page.tsx`** — lista de temas de una unidad.
- **`(student)/niveles/[unitId]/[topicId]/page.tsx`** — página central del flujo: lectura + `ProgresoLectura` + sopa de letras + quiz + `Reflexion`, cada actividad se elige al azar entre las variantes (`grupo_variante`) disponibles en la BD.
- **`(student)/dashboard/page.tsx`** — saludo, racha, tarjeta "continuar donde quedaste", último logro, unidades completadas.
- **`(student)/logros/page.tsx`** — historial de `estudiante_logros` con nombre, descripción, nivel y fecha.
- **`(student)/progreso/page.tsx`** — placeholder simple con link a `/logros`.
- **`(student)/extras/page.tsx`** — "Acerca de", créditos del equipo Rysteam, política de privacidad, footer.
- **`docente/page.tsx`** — panel del docente: métricas grupales (total, promedio, activos esta semana, sin actividad), lista de estudiantes expandible con progreso individual (barra %, basada en `TEMAS_POR_GRADO = 17`), formulario para crear estudiante (genera código de acceso).

### Frontend — config
- **`tailwind.config.ts`** — se agregaron `keyframes`/`animation` para `logro-overlay-fade` y `logro-pop`.
- **`globals.css`** — se quitaron esos mismos keyframes duplicados (ahora viven solo en Tailwind config) y se quitó el override de `--background` en modo oscuro del sistema (el fondo queda fijo en blanco).
- **`.env.local`** — se corrigió `NEXT_PUBLIC_SUPABASE_ANON_KEY` (tenía la **service_role key** por error — ya está resuelto, ahora tiene la anon key real) y se agregó `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`.

### Base de datos (`db/`)
- **`seed.sql`** — 8 unidades + 34 temas reales (7mo y 9no, Unidades I-IV) extraídos de `docs/curriculum/secundaria/{7mo,9no}.md`.
- **`seed_actividades.sql`** — 3 actividades de ejemplo (sopa + quiz + scenario) para el Tema 1.
- **`seed_logros.sql`** — catálogo de 12 logros (1 tema + 4 unidad + 7 especiales).
- **`seed_actividades_completo.sql`** — 132 actividades (33 sopas + 99 preguntas de quiz) para los 33 temas que no tenían contenido. **Ya ejecutado y verificado** (ver sección 2). Sigue sin commitear — ver sección 4.
- **`migrations/001_add_tema_id_to_estudiante_logros.sql`** — agrega `tema_id` a `estudiante_logros` + 2 índices UNIQUE parciales (uno por tema para logros de nivel "tema", uno general para el resto).
- **`migrations/002_rls_logros_actividad.sql`** — políticas RLS para `estudiante_logros` y `actividad_diaria` (RLS ya estaba habilitado en la BD por fuera de estos archivos).
- **`migrations/003_rls_docente.sql`** — políticas RLS para que un docente autenticado vea/gestione solo a sus propios estudiantes (`perfiles_docente`, `docente_estudiantes`, `perfiles_estudiante`, `usuarios`, `progreso_estudiante`).


## 2. Pendiente de ejecutar en Supabase

**Nada pendiente.** `db/seed_actividades_completo.sql` ya se ejecutó y se verificó contra la BD real (vía `psycopg2` + `DATABASE_URL`) al cierre de esta sesión, junto con todo lo demás:

| Verificación | Resultado |
|---|---|
| Temas sin actividades | 0 (esperado: 0) |
| Total actividades | 135 (esperado: 135 = 3 de `seed_actividades.sql` + 132 de `seed_actividades_completo.sql`) |
| Total logros | 12 |
| Total temas | 34 |
| Total unidades | 8 |
| Tipos de actividad presentes | `drag_drop`, `quiz`, `scenario`, `sopa_letras` (los 4 del catálogo) |
| Total políticas RLS | 27 |
| Estudiantes / Docentes | 2 / 1 |

Todos los archivos de seed y las 3 migraciones (`001`, `002`, `003`) están aplicados en Supabase. **El currículo completo (34 temas de 7mo y 9no) tiene sopa de letras + quiz funcionando de punta a punta.**


## 3. Decisiones técnicas importantes

- **Login de estudiante sin Supabase Auth real.** El estudiante entra con código+PIN, no con un usuario de Supabase Auth. El PIN se compara con `bcryptjs` **en el navegador** (el hash viaja del servidor al cliente antes de compararse) — funciona porque `perfiles_estudiante` permite `SELECT` anónimo. Es una decisión consciente para el MVP, no una fuga accidental; si se quiere endurecer, la alternativa es una función RPC de Postgres `SECURITY DEFINER` que compare el hash server-side.
- **Docente sí usa Supabase Auth real** (`signInWithPassword`), así que su sesión la maneja el SDK de Supabase automáticamente — no se duplica en `localStorage` como con el estudiante.
- **`grupo_variante` como truco para "3 preguntas de quiz por tema".** El componente `Quiz.tsx` solo soporta una pregunta por fila de `config_json` (no un array). Para dar 3 preguntas por tema se usan 3 filas de `actividades` con `grupo_variante` 1/2/3, y la página del tema elige una al azar en cada carga — mismo mecanismo que ya existía para variantes de sopa de letras.
- **`grado_id` en `perfiles_estudiante` es FK a `grados.id` (1=7mo, 2=9no en esta BD), no `numero_grado`.** Causó un bug real: el formulario de crear estudiante mandaba `numero_grado` (7 o 9) directo como `grado_id`. Se corrigió resolviendo `numero_grado → grados.id` con una query antes del insert (`backend/app/routers/docente.py`).
- **Logros por tema vs. logros únicos.** Se agregó `tema_id` a `estudiante_logros` (migración 001) para que "¡Tema completado!" se otorgue una vez **por tema**, no una vez por estudiante. El resto de logros (unidad, especiales) usan `tema_id = NULL` y siguen siendo únicos por estudiante, forzado con 2 índices UNIQUE parciales en vez de un solo `UNIQUE` simple.
- **`TEMAS_POR_GRADO = 17` está hardcodeado** en `frontend/app/docente/page.tsx` para calcular el % de progreso. Es correcto con el currículo actual (17 temas por grado, verificado), pero se rompe en silencio si se agrega o quita contenido sin actualizar esta constante.
- **`registrarActividadDiaria` solo se llama desde `Reflexion.tsx`**, no desde `WordSearch.tsx` ni `Quiz.tsx`. La racha diaria depende de que el estudiante complete al menos la reflexión ese día; completar solo la sopa o el quiz no cuenta para la racha.
- **Dos "corrupciones de encoding" reportadas resultaron ser falsas alarmas.** Los títulos con tildes/eñes en `temas` y `logros` (ej. "nicaragüense", "¡Tema completado!") están correctamente guardados en UTF-8 — lo que se veía como `�` era una limitación de renderizado de la terminal usada para las verificaciones, no un problema de la base de datos. **No hace falta ningún `UPDATE` de corrección** — si se vuelve a ver `�` en una consulta, verificar el code point real antes de asumir corrupción.
- **`/historia` está en el menú de navegación pero la página no existe** (Modo Historia, a cargo de otro miembro del equipo — Sidar).
- **Política RLS `"docente lee nombres de sus estudiantes"` en `usuarios` usa `USING (true)`** — cualquier docente autenticado puede leer `nombre_display`/`email` de **todos** los usuarios del sistema, no solo los suyos. Detectado y documentado, no corregido (aceptable para MVP con pocos docentes, pero es una fuga de privacidad real si crece el número de docentes).


## 4. Estado al cierre de sesión — pendientes para la próxima sesión

- **Dark/light mode toggle**: COMPLETADO — `darkMode: "class"` en `tailwind.config.ts`, toggle en `/extras` (`localStorage.dignalearn_tema`), aplicado en `(student)/layout.tsx`.
- **Íconos SVG por tipo de logro**: COMPLETADO — `frontend/components/LogroIcono.tsx`, usado en `/logros` y en `LogroCelebracion.tsx`; backend expone `tipo_condicion`/`nivel_nombre` en `LogroDesbloqueado`.
- **Pulido visual con branding de Sharis**: EN PROCESO — faltan tipografías (Sitka Small Semibold + Nunito en `tailwind.config.ts`), clases `dark:` en todas las páginas (hoy solo `/extras` las tiene), y branding en `/login`.
- **Integración Modo Historia de Sidar**: PENDIENTE — rutas en `frontend/app/(student)/historia/`, componentes en `frontend/components/story/`. Cuando llegue, verificar compatibilidad con Next.js sin romper lo existente.
- **Mascota guía**: PENDIENTE — implementar como componente fijo en esquina inferior derecha, con burbuja de diálogo para pistas por tema, animación de 2-3 frames CSS, y chat básico pregrabado.
- **README técnico**: PENDIENTE.
