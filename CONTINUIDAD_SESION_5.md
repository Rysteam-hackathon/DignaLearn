# DignaLearn — Documento de Continuidad Sesión 5
> Leé TODO esto antes de responder. Sos el asistente de arquitectura de DignaLearn.
> Calidad sobre velocidad. Confirmar antes de codear. Paso a paso siempre.

---

## Estado del proyecto al cierre de Sesión 5

### Commits recientes (rama feature/monorepo-setup)
- feat: landing page publica, branding completo, Playfair Display, quiz y sopa con colores correctos
- feat: dinamismo completo en toda la interfaz - dual mode, animaciones y branding
- fix: rollback en crear_estudiante y logging en gamification - auditoria backend

### Lo que funciona y está verificado
- Landing page publica en / con hero animado, features, como funciona, para quien es, CTA
- Login con animaciones de fondo flotantes
- Dashboard del estudiante: saludo, racha, tarjeta continuar, logros, unidades, accesos rapidos
- Niveles: 4 unidades con iconos, animaciones escalonadas, colores por unidad
- Flujo completo: lectura → sopa de letras → quiz → reflexion → progreso guardado en BD
- Sopa de letras: chips visuales, animacion al encontrar palabra, progreso visible
- Sistema de logros conectado al backend (LogroCelebracion pendiente de verificar)
- Panel del docente: lista estudiantes, progreso grupal e individual, crear estudiante
- Modo oscuro/claro toggle en Extras con persistencia en localStorage
- Pagina de historia: placeholder animado
- Pagina de progreso: racha, temas completados, ultimo logro desde Supabase
- Pagina de logros: cards con LogroIcono, animaciones, estado vacio motivacional
- Pagina de extras: equipo, politica de privacidad, configuracion

### Base de datos verificada
- 34 temas, 8 unidades, 135 actividades, 12 logros, 27 politicas RLS
- 3 usuarios de prueba: DL-TEST/1234 (7mo), DL-E492/1234 (Ana Garcia 7mo), docente@dignalearn.com/Docente1234
- Migraciones aplicadas: 001 (tema_id en estudiante_logros), 002 (RLS logros/actividad), 003 (RLS docente)

---

## Pendientes identificados en Sesion 5 — EN ORDEN DE PRIORIDAD

### PENDIENTE 1 — Fondo animado en todas las paginas interiores
Agregar circulos flotantes estilo landing page que persistan en toda la navegacion del estudiante.
Deben adaptarse a modo claro y oscuro sin problemas de compatibilidad.
Implementar en frontend/app/(student)/layout.tsx como capa de fondo absoluta.
Figuras con contexto educativo (libros, estrellas, circulos).
CSS puro, sin librerias.

### PENDIENTE 2 — Apartado de lectura expandible + secuencialidad completa
EN LA PAGINA DE UNIDAD (niveles/[unitId]/page.tsx):
- Cada tema tiene un acordeon expandible con el contenido de lectura para repasar antes de la actividad
- TEMAS SECUENCIALES: el Tema 2 no se puede acceder sin completar el Tema 1, el Tema 3 sin el Tema 2, etc.
- El Tema 1 de cada unidad siempre esta desbloqueado
- Mostrar candado visual en temas bloqueados con animacion shake suave
- Logica: verificar en progreso_estudiante si el tema anterior tiene lectura_completada + actividad_completada + reflexion_respondida = true

EN LA PAGINA DE NIVELES (niveles/page.tsx):
- UNIDADES SECUENCIALES: la Unidad 2 no se puede acceder sin completar todos los temas de la Unidad 1
- La Unidad 1 siempre esta desbloqueada
- Mostrar candado visual en unidades bloqueadas
- Logica: verificar que todos los temas de la unidad anterior esten completados (los 3 elementos)
- Esto aplica igual para 7mo y 9no grado

### PENDIENTE 3 — LogroCelebracion no disparó + interfaz de temas completados
Diagnosticar por que no aparecio la animacion de logro al completar el tema.
Posibles causas: backend no corriendo al momento, endpoint no llamado, error silencioso.
Mejorar visualmente la pagina de tema cuando ya esta completado.
Agregar mas dinamismo y contenido a esa interfaz.

### PENDIENTE 4 — Pagina Extras con dinamismo del landing
Redisenar extras/page.tsx con:
- Formas flotantes animadas estilo landing (circulos con CSS keyframes)
- Layout horizontal para el equipo Rysteam
- Todo el espacio aprovechado
- Animaciones de entrada escalonadas
- Compatible con modo claro y oscuro

### PENDIENTE 5 — Fix completo de colores en modo oscuro
Texto negro invisible sobre fondo oscuro en algunas paginas.
Texto blanco mal contrastado en otras.
Hacer auditoria visual completa de todas las paginas en ambos modos.
Antes de tocar cualquier archivo, verificar con el hook esOscuro que ya existe.

### PENDIENTE 6 — Animaciones en emojis e iconos
Diferentes tipos de animaciones para emojis segun contexto:
- Float (ya existe en historia)
- Pulse para logros
- Spin suave para iconos de navegacion activos
- Bounce para estados de completado
- Shake suave para estados de error o bloqueado

### PENDIENTE 7 — Rotacion automatica de variantes de actividades
Cuando el estudiante vuelve a un tema ya completado, mostrar una variante diferente
de la sopa de letras y el quiz (grupo_variante 1, 2 o 3 en rotacion).
Implementar en frontend/app/(student)/niveles/[unitId]/[topicId]/page.tsx.

### PENDIENTE 8 — Probar panel del docente completo
Verificar flujo: login docente → crear estudiante → ver progreso → resetear PIN.
Aun no se probo en esta sesion.

---

## Errores que NO se deben cometer (aprendidos en sesiones anteriores)

1. NUNCA usar .single() en queries de Supabase — siempre .maybeSingle(). El .single() causa error 406 cuando no hay exactamente una fila.
2. NUNCA hacer server components en paginas del estudiante — todo debe ser "use client" con useEffect para leer localStorage (getEstudianteLocal).
3. NUNCA hardcodear colores sin considerar ambos modos — siempre usar el hook esOscuro o var(--foreground)/var(--background).
4. NUNCA poner color: "#160B24" fijo en texto — en modo oscuro el fondo es ese mismo color y el texto se vuelve invisible.
5. NUNCA modificar archivos sin leerlos primero — siempre Read antes de Write/Edit.
6. NUNCA asumir que los warnings de encoding en la terminal de Claude Code son errores reales de la BD — son limitaciones de la consola de Windows con UTF-8.
7. NUNCA hacer git commit sin correr npx tsc --noEmit primero.
8. NUNCA crear archivos de logros con encoding corrupto — verificar con codepoints reales, no con lo que muestra la terminal.
9. El backend usa StatReload — si se reinicia solo pierde el venv y falla con imports. Siempre relanzar manualmente con venv activado.
10. Las variables de entorno de Next.js no se recargan en caliente — reiniciar npm run dev si se cambia .env.local.

---

## Verificaciones obligatorias antes de cada commit

1. npx tsc --noEmit en frontend/ — debe dar 0 errores
2. Endpoints del backend responden: Health 200, Gamificacion 200, Docente 404 con UUID falso
3. BD correcta: 34 temas, 135 actividades, 12 logros, 27 politicas RLS
4. Login DL-TEST/1234 funciona en ventana de incognito
5. No hay .single() en ningun archivo del frontend
6. No hay server components en rutas del estudiante

---

## Trello — estado actual

HECHO:
- Estructura base y control de versiones (8/8)
- Auth + perfiles de usuario (6/6)
- Modelo de datos schema (4/4)
- Contenido MINED seed (5/5 — incluyendo 135 actividades)
- Interfaz del estudiante (8/8)
- Gamificacion y seguridad (8/8)
- Panel del docente (6/6)
- Dark/light mode (4/4)

PENDIENTE:
- Pulido visual con branding de Sharis (en progreso — falta fondo animado, fix colores dark mode, animaciones emojis)
- README + ejecucion local (0/6)
- Mascota guia (pendiente — no iniciado)
- Integracion Modo Historia Sidar (pendiente — Sidar no entrego aun)

NUEVAS TARJETAS A AGREGAR:
- Candado de temas secuenciales
- Apartado de lectura expandible en unidades
- Rotacion de variantes de actividades
- Animaciones en emojis e iconos

---

## Stack y configuracion

Frontend: Next.js 14 + TypeScript + Tailwind CSS — http://localhost:3000
Backend: FastAPI Python — http://localhost:8000
BD: Supabase PostgreSQL cloud — https://mejylwssptaxsvbbwmya.supabase.co
Repo: https://github.com/Rysteam-hackathon/DignaLearn (rama feature/monorepo-setup)

Arranque:
Terminal 1 — cd C:\Users\DELL\Desktop\DignaLearn\backend && venv\Scripts\activate && uvicorn app.main:app --reload
Terminal 2 — cd C:\Users\DELL\Desktop\DignaLearn\frontend && npm run dev

Colores del branding (INMUTABLES):
- #160B24 Purpura Profundo
- #F0A8B6 Rosa Pastel
- #A4CDD5 Celeste Pastel
- #FFFFFF Blanco

Tipografias: Playfair Display (headings) + Nunito (body)
Solo CSS transitions y keyframes — CERO librerias de animacion externas

---

## Verificaciones de comportamiento por grado — OBLIGATORIO probar en proxima sesion

### Verificacion 9no grado
El sistema debe cambiar completamente cuando entra un estudiante de 9no:
- Dashboard: tarjeta "Continuar" apunta a temas de 9no, no de 7mo
- Niveles: muestra las 4 unidades de 9no con sus titulos correctos
- Temas: contenido especifico de 9no grado
- Logros de unidad: los 4 nombres de 9no (son los mismos nombres que 7mo porque las unidades tienen el mismo nombre en ambos grados)
- La logica de grado_id en localStorage debe leerse correctamente

Para probar: entrar al panel del docente con docente@dignalearn.com/Docente1234,
crear un estudiante nuevo con grado 9no, entrar con ese codigo y verificar
que el contenido mostrado es de 9no grado.

### Verificacion secuencialidad
Probar que:
1. El Tema 2 de cualquier unidad muestra candado si el Tema 1 no esta completo
2. Hacer click en un tema bloqueado no navega — muestra mensaje de que hay que completar el anterior
3. La Unidad 2 muestra candado si la Unidad 1 no esta completa
4. Al completar el ultimo tema de una unidad, la siguiente unidad se desbloquea automaticamente

### Verificacion LogroCelebracion
En la sesion anterior no aparecio la animacion de logro al completar el tema.
Diagnosticar: abrir DevTools → Network → completar los 3 elementos de un tema
→ verificar que se llama a POST /api/gamification/evaluar/{estudiante_id}
→ verificar que el backend responde con logros
→ verificar que el frontend muestra LogroCelebracion

---

## Como arrancar la proxima sesion

1. Leer este archivo completo
2. Levantar servidores (ver comandos arriba)
3. Verificar que login DL-TEST/1234 funciona en incognito
4. Arrancar con PENDIENTE 1 (fondo animado) ya que es la base visual para todo lo demas
5. Luego PENDIENTE 5 (fix colores dark mode) porque afecta todo
6. Luego los demas pendientes en orden

*Generado al cierre de Sesion 5*
