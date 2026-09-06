# DignaLearn — Contexto para Claude Code
> Leé este archivo completo antes de ejecutar cualquier tarea.

## Stack
- Frontend: Next.js 14 + TypeScript + Tailwind + Framer Motion → localhost:3000
- Backend: FastAPI Python → localhost:8000
- BD: Supabase PostgreSQL → https://mejylwssptaxsvbbwmya.supabase.co
- Rama activa: feature/monorepo-setup

## Arranque
Terminal 1: cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
Terminal 2: cd frontend && npm run dev

## Credenciales de prueba
- Estudiante: DL-TEST / PIN 1234 (7mo grado, grupo "7mo A")
- Docente: docente@dignalearn.com / Docente1234
- Institución: Instituto Nacional de Prueba (INP-2026, Managua)

## Colores (INMUTABLES)
- #160B24 Púrpura Profundo
- #F0A8B6 Rosa Pastel
- #A4CDD5 Celeste Pastel
- #FFFFFF Blanco

## Tipografía
- Headings: var(--font-heading) = 'Sitka Small', 'Sitka', 'Cambria', Georgia, serif
- Body: Nunito (Google Fonts)

## Reglas absolutas
1. NUNCA @keyframes CSS — siempre Framer Motion
2. NUNCA .single() — siempre .maybeSingle()
3. NUNCA catches vacíos — siempre console.error(error)
4. NUNCA z-index negativo en fondos animados — usar z-0
5. NUNCA hardcodear colores sin variante dark
6. NUNCA confiar en estudiante_id del body/URL sin verificar JWT
   → usar verificar_estudiante_autenticado() de auth_service.py
7. NUNCA commit sin npx tsc --noEmit → 0 errores
8. NUNCA commit/push sin instrucción explícita del usuario
9. NUNCA dar tarea por cerrada sin verificar en navegador real
10. NUNCA asumir que un archivo fue creado — verificar con ls/dir
11. NUNCA npm run build en desarrollo
12. "Learn" en el logo es SIEMPRE #F0A8B6
13. El sistema usa "logros" — NUNCA "insignias"
14. uvicorn --reload puede servir código viejo — si hay cambios
    que no se reflejan, matar el proceso y relanzar limpio

## Verificaciones obligatorias antes de cada commit
1. npx tsc --noEmit → 0 errores
2. Login DL-TEST/1234 funciona
3. No hay .single(): grep -rn "\.single()" frontend/
4. No hay @keyframes: grep -rn "@keyframes\|animation:" frontend/app/
5. Verificar visualmente en navegador los cambios de UI
6. Después de crear archivo nuevo: ls <directorio> para confirmar

## Arquitectura de datos
instituciones → grupos → perfiles_estudiante
             → docente_grupos → perfiles_docente
El grado se infiere del grupo. Un docente puede tener varios grupos.

## Endpoints del backend
POST /api/auth/login-estudiante — JWT propio (PyJWT, HS256, 7 días)
GET  /api/grupos/mis-grupos — grupos del docente autenticado
GET  /api/grupos/{id}/estudiantes — batch queries, no N+1
GET  /api/grupos/{id}/stats — stats del grupo
POST /api/docente/estudiantes — crear estudiante con grupo_id
POST /api/docente/resetear-pin — resetear PIN de estudiante
POST /api/progress/completar-elemento — progreso + evaluación de logros
GET  /api/progress/racha/{estudiante_id} — racha del estudiante (JWT verificado)
GET  /api/progress/logros/{estudiante_id} — logros desbloqueados (JWT verificado)
GET  /api/progress/estudiante/{estudiante_id}?tema_id= — progreso por tema (JWT verificado)
POST /api/progress/registrar-actividad/{estudiante_id} — actividad diaria (JWT verificado)
POST /api/gamification/evaluar/{estudiante_id} — re-evaluar logros

## Último commit pusheado
2958938 — docs: documentar migracion 005 - RLS real por institucion en grupos/instituciones

## Pendientes en orden de prioridad
1. Nuevos tipos de actividad (Rompecabezas, Conectores, ArrastrarOrdenar) — PRÓXIMO FOCO
2. Mascota guía (esquina inferior derecha, pistas desde pistas_actividad)
3. Acordeón de lectura expandible en página de unidad
4. Panel de Admin de Institución (requiere definir cómo se automatiza el alta de docente/grupo — hoy es 100% manual desde Supabase Studio)
5. Revisión mobile completa
6. README
7. seed.sql sincronizado
8. CORS producción (URL de Vercel al desplegar)
9. Modo Historia — en espera de Sidar

## Resuelto en Sesión 9 (ver PARTE 22 del PRD para el detalle completo)
- Fix de concurrencia en supabase_client.py (thread-local)
- PENDIENTE 1: RLS real por estudiante — lecturas de progreso/racha/logros movidas al backend con JWT verificado
- Bug de contaminación de sesión estudiante/docente — clientes supabaseDocente/supabaseEstudiante separados
- 34 logros de tema únicos (antes 1 genérico), con backfill de progreso histórico
- 34 reflexiones de contenido (scenario) — antes solo 1 de 34 temas tenía Reflexión funcional
- PENDIENTE 3: rotación de variantes con memoria en [topicId]/page.tsx
- Equipo actualizado: Jonathan Alvarado (Comunicador) agregado, rol de Eddy corregido
- Badge del hero del landing cambiado
- PENDIENTE 2 (dark mode): dropdown de configuración + dark/light real en panel docente
- RLS real por institución en grupos/instituciones (antes USING(true)) — migración 005
