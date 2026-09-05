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
POST /api/gamification/evaluar/{estudiante_id} — re-evaluar logros

## Último commit pusheado
b69d7ce — fix: grupo_id en crear_estudiante, router grupos.py, RLS tablas nuevas, logro Coleccionista

## Pendientes en orden de prioridad
1. Verificar panel docente en navegador (CORS fix aplicado, no confirmado)
2. RLS real por estudiante (progreso/actividad/logros tienen qual:true)
3. Verificación de 9no grado end-to-end
4. Auditoría dark mode completa
5. Rotación de variantes de actividades (grupo_variante 1/2/3)
6. Nuevos tipos de actividad (rompecabezas, conectores, arrastrar)
7. Mascota guía (esquina inferior derecha, pistas desde pistas_actividad)
8. Acordeón de lectura expandible en página de unidad
9. Panel de Admin de Institución
10. Revisión mobile completa
11. Ilustraciones SVG de logros — verificar visualmente en navegador
12. README
13. seed.sql sincronizado
14. CORS producción (URL de Vercel al desplegar)
15. Modo Historia — en espera de Sidar
