# DignaLearn — Documento Maestro de Planeamiento
> **Equipo:** Rysteam · **Evento:** Hackathon Nicaragua 2026  
> **Repositorio:** https://github.com/Rysteam-hackathon/DignaLearn  
> **Estado del repo al inicio del planeamiento:** Greenfield (0% de código — solo documentación base)  
> **Fecha de creación:** 07/08/2026 · **Última actualización:** 20/08/2026 · **Presentación final:** 30/08/2026

---

## PARTE 1 — Estado Actual del Repositorio

### Qué existe hoy en el repo

El repositorio `DignaLearn` contiene únicamente **5 archivos de documentación** en `main`, sin subdirectorios de código:

| Archivo | Contenido |
|---------|-----------|
| `.gitignore` | Patrones para Python/FastAPI y Node/Next.js |
| `LÉAME.md` | Visión del proyecto, equipo, stack declarado |
| `CONTRIBUYENDO.md` | Convenciones de ramas y commits |
| `CÓDIGO_DE_CONDUCTA.md` | Código de conducta del equipo |
| `Estructura.md` | Prompt para agente de IA (intención de estructura, no carpetas reales) |

**No existen:** `package.json`, `requirements.txt`, `Dockerfile`, carpetas `frontend/`, `backend/`, `db/`, esquema de base de datos, ni ningún endpoint o componente.

### Convenciones del equipo (respetar siempre)
- **Ramas:** `feature/nombre-de-la-tarea`. Nunca pushear directo a `main`.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `docs:`, `chore:`, etc.
- **Flujo:** todo cambio entra por Pull Request con revisión.

### Equipo y roles

| Miembro | Rol | Responsabilidad técnica |
|---------|-----|------------------------|
| Eddy Marenco | Líder / Marketing | Coordinación, presentación, estrategia + dev backend/BD |
| Ronald Dávila | Comunicador | Documentación, comunicación externa |
| Sharis Peralta | Diseñadora | UI/UX, ilustraciones de insignias, assets visuales |
| Dirk Martinez | Dev Backend | FastAPI, lógica de gamificación, conexión Supabase |
| Sidar Perez | Diseñador / Dev Frontend | Módulo Modo Historia (ver Parte 10) |

---

## PARTE 2 — Visión del Producto

### Qué es DignaLearn

**DignaLearn** es una plataforma web educativa gamificada para estudiantes de Nicaragua. **Fortalece** el proceso de enseñanza-aprendizaje de la asignatura oficial del MINED **"Derechos y Dignidad de la Mujer"** mediante una experiencia interactiva que combina lectura adaptada, minijuegos y narrativa visual.

> ⚠️ **Corrección de propuesta de valor (indicada por el profesor/mentor del hackathon):** el verbo correcto es **"fortalecemos"**, no "transformamos". DignaLearn no reemplaza ni transforma la metodología existente — la complementa y refuerza. La propuesta de valor oficial es: *"Fortalecemos el proceso de enseñanza-aprendizaje mediante herramientas tecnológicas que permiten al estudiante y al docente comprender la asignatura de Derechos y Dignidad de la Mujer."*

### Alcance del MVP (hackathon)

**Grados cubiertos en el MVP:** solo **7mo y 9no grado de secundaria**.

Esta decisión es deliberada: cubrir 2 grados con contenido completo y funcionalidad real es más valioso para el hackathon que mostrar 11 grados vacíos. Los demás grados aparecen en la UI con etiqueta "Próximamente" — demuestra visión de escalabilidad sin comprometer calidad.

> **Argumento para jueces:** "Lanzamos con acceso anticipado para 7mo y 9no grado, los dos grados donde la asignatura tiene mayor impacto en el ciclo básico de secundaria. La arquitectura escala a todos los niveles."

### Referentes de experiencia
- **Duolingo:** progreso por niveles, rachas, retroalimentación inmediata.
- **ArbolABC:** actividades lúdicas educativas para niños.
- **Coursera:** barras de progreso por módulo, estadísticas de actividad semanal.

### Problema que resuelve

La asignatura existe en el currículo oficial (primaria y secundaria) pero la metodología tradicional genera desconexión. No existe plataforma digital gamificada para esta asignatura en Nicaragua.

> ⚠️ **Límite de contenido:** solo información alineada al programa oficial del MINED. Cualquier contenido externo queda excluido.

### Lean Canvas (completado por el equipo)

| Bloque | Contenido |
|--------|-----------|
| **Problema** | Sin herramienta digital para practicar fuera del aula; aprendizaje percibido como aburrido y abstracto; no existe plataforma gamificada para esta asignatura en Nicaragua |
| **Solución** | 4 unidades/2 por semestre siguiendo programa MINED; insignias, progreso y racha sin presión de tiempo; web responsive sin descarga, funciona con conectividad básica |
| **Propuesta de valor única** | Fortalecemos la enseñanza de los derechos en Nicaragua mediante plataforma digital gamificada con escenarios de vida real |
| **Ventaja diferencial** | Recurso didáctico dentro de la asignatura oficial; contenido extraído de documentos MINED en contexto nicaragüense |
| **Segmento clientes** | Usuario (quien usa): estudiantes 1°–6° primaria y 7°–11° secundaria. Cliente (quien paga): MINED, centros privados, UNICEF, ONU Mujeres, GIZ |
| **Canales** | WhatsApp (docentes y alumnos), TikTok (estudiantes), Facebook (grupos de docentes y directores), MINED (distribución nacional) |
| **Métricas clave** | Conversión (% que se registran y completan su primera unidad), Retención D7 y D30, NPS de docentes |
| **Estructura de costos** | Desarrollo, diseño y contenido educativo, dominio y hosting, difusión digital, transporte para demos presenciales |
| **Flujo de ingreso** | Certificados verificables, skins cosméticos de mascota, Modo Historia completo (freemium), licencia institucional + contratos de implementación con MINED |

---

## PARTE 3 — Stack Tecnológico y Arquitectura

### Stack definitivo

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Frontend | **Next.js 14+ App Router + TypeScript** | SSR/SSG, rutas, UI |
| Estilos | **Tailwind CSS** | Velocidad de desarrollo |
| CRUD simple + Auth | **Supabase SDK (JS)** desde Next.js | PostgREST incluido |
| Backend lógica de negocio | **FastAPI (Python)** | Solo gamificación, reportes y lógica compleja |
| Base de datos | **PostgreSQL gestionado por Supabase** | Una sola BD para frontend y backend |
| Gestor local de BD | **Supabase Studio** + DBeaver opcional | |
| Repositorio | **GitHub (Rysteam-hackathon/DignaLearn)** | |

### División clave: Supabase SDK vs FastAPI

**Usar Supabase SDK directamente desde Next.js para:**
- Leer/crear/actualizar perfiles de usuario
- Consultar unidades, temas y lecciones
- Registrar progreso del estudiante
- Autenticación (login, sesión, roles vía JWT)

**Usar FastAPI para:**
- Calcular puntos/XP con reglas del sistema de insignias
- Evaluar si se desbloquea una insignia al alcanzar umbral
- Generar agregaciones para el panel del docente
- Validaciones complejas de minijuegos
- Cálculo de rachas diarias

> FastAPI se conecta a la **misma BD de Supabase** mediante la connection string de Postgres — no es una BD separada.

### Requisitos no funcionales

- **Responsive web:** la plataforma es un sitio web, no una app móvil. Mismo código, mismo HTML, que se ve bien en celular y en computadora. En móvil: barra de navegación inferior. En desktop: sidebar o topbar.
- **Conectividad básica:** funcionar con conexión lenta o intermitente. Cacheo de contenido estático, carga progresiva, imágenes en formato WebP con lazy load. Sin descarga ni instalación.
- **Dark mode / Light mode:** toggle en la sección de configuración del perfil. Ambos modos deben funcionar desde el primer release.
- **Performance:** Lighthouse score ≥ 80 en móvil. Importante para la demo del hackathon.

### Patrón de arquitectura

Arquitectura cliente-servidor con API REST. Backend FastAPI con patrón MVC:

```
frontend/          → Next.js (UI + llamadas a Supabase SDK y FastAPI)
backend/           → FastAPI
  routers/         → Controladores (endpoints REST)
  models/          → Modelos de datos (SQLModel)
  schemas/         → Validación (Pydantic)
  services/        → Lógica de negocio (gamificación, reportes)
db/                → Esquema SQL + datos semilla (contenido MINED)
```

### Estructura de carpetas propuesta (monorepo)

```
DignaLearn/
├── frontend/
│   ├── app/
│   │   ├── (auth)/              # Login, registro
│   │   ├── (student)/           # Rutas del estudiante
│   │   │   ├── dashboard/
│   │   │   ├── niveles/
│   │   │   ├── units/[unitId]/
│   │   │   │   └── topics/[topicId]/
│   │   │   ├── historia/        # Módulo Modo Historia (Sidar)
│   │   │   ├── progreso/
│   │   │   └── perfil/          # Config: dark/light mode, PIN
│   │   └── (teacher)/           # Rutas del docente
│   │       ├── dashboard/
│   │       ├── students/
│   │       └── perfil/
│   ├── components/
│   │   ├── ui/                  # Botones, cards, barras de progreso
│   │   ├── games/               # Componentes de cada tipo de minijuego
│   │   ├── achievements/        # Insignias, colección, racha, calendario
│   │   └── mascot/              # Mascota guía pixel-art
│   └── lib/
│       ├── supabase.ts
│       └── api.ts               # Llamadas a FastAPI
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── progress.py
│   │   │   ├── achievements.py
│   │   │   └── reports.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   │       ├── gamification.py
│   │       └── reports.py
│   └── requirements.txt
├── docs/
│   ├── curriculum-source/       # PDFs originales MINED — gitignored
│   └── curriculum/              # Markdown extraídos — versionados
│       ├── primaria/
│       └── secundaria/
└── db/
    ├── schema.sql
    └── seed.sql
```

---

## PARTE 4 — Usuarios del Sistema y Roles

### Roles del sistema

Tres roles. Para el MVP del hackathon implementar **Estudiante** y **Docente**. Admin se gestiona desde Supabase Studio.

### Estudiante (7mo y 9no — MVP)

**Cómo accede:** Código de acceso de 6 caracteres (ej. `DL-K74X`) + PIN de 4 dígitos que él mismo define la primera vez. El código lo genera el sistema cuando el docente crea su cuenta. Sin email obligatorio.

**Justificación:** No todos los estudiantes de secundaria en Nicaragua tienen correo o cuenta de Google — especialmente en zonas rurales. El código institucional elimina la fricción de acceso y no requiere recopilar datos personales del menor.

**Qué puede hacer:**
- Navegar unidades y temas de su grado
- Completar los 3 elementos de aprendizaje por tema
- Acceder al Modo Historia
- Ver su progreso: racha, insignias, estadísticas semanales
- Cambiar PIN y toggle dark/light mode en Perfil

**Qué no puede hacer:**
- Ver el progreso de otros estudiantes
- Modificar su nivel o grado asignado
- Acceder al panel del docente

### Docente

**Cómo accede:** Email + contraseña (Supabase Auth estándar). El admin crea la cuenta del docente en Supabase Studio.

**Qué puede hacer:**
- Crear perfiles de sus estudiantes (nombre + grado) desde su panel
- Ver el código de acceso generado para cada estudiante
- Resetear el PIN de un estudiante si lo olvidó
- Ver el progreso del grupo: % promedio, activos esta semana, sin actividad
- Ver el progreso individual: unidades/temas completados, insignias, última actividad
- Toggle dark/light mode en Perfil

**Qué no puede hacer:**
- Ver respuestas individuales a preguntas o ejercicios específicos
- Editar el contenido de la plataforma (es fijo, basado en MINED)

### Administrador (MVP — desde Supabase Studio)

Crea cuentas de docentes, asigna instituciones. No requiere panel frontend para el MVP.

---

## PARTE 5 — Modelo de Datos

### ⚠️ Nota para el agente — Modelo evolutivo

Este modelo es un **punto de partida, no una especificación cerrada.** Siempre generar una migración Alembic antes de modificar el esquema y actualizar `db/schema.sql`.

### Entidades principales (v1 — sujeto a cambios)

**`users`** — extendido sobre Supabase Auth  
`id | email (nullable) | role | display_name | access_code | pin_hash | level_type | grade | created_at`  
`role`: `student` / `teacher` / `admin`  
`access_code`: código de 6 chars generado para estudiantes (`DL-XXXX`). NULL para docentes.  
`grade`: grado asignado (7, 9, etc.). NULL para docentes.

**`units`** — unidades del programa MINED  
`id | level_type | grade | title | description | order | cover_image_url | is_active`

**`topics`** — temas dentro de una unidad  
`id | unit_id | title | order | reading_content (text) | estimated_minutes`

**`activities`** — actividades lúdicas por tema  
`id | topic_id | type (word_search/drag_drop/quiz/scenario) | config_json | points_reward | min_score_to_pass`

**`student_progress`** — progreso por estudiante y tema  
`id | student_id | topic_id | reading_completed | activity_completed | reflection_answered | score | completed_at`

**`achievements`** — catálogo de insignias  
`id | title | description | icon_url | level | tier (topic/unit/special) | condition_type | condition_value`

**`student_achievements`** — insignias desbloqueadas  
`id | student_id | achievement_id | unlocked_at`

**`daily_activity`** — para cálculo de racha  
`id | student_id | date | elements_completed_count`

**`story_chapters`** — capítulos del Modo Historia (schema definido por nosotros, gestionado por Sidar)  
`id | grade | unit_id | title | description | order | is_free | total_pages | estimated_minutes | cover_image_url | is_active`

**`student_story_progress`** — progreso en Modo Historia  
`id | student_id | chapter_id | completed | pages_read | last_read_at`

---

## PARTE 6 — Sistema de Progreso e Insignias (Gamificación)

> El sistema NO incluye certificaciones obligatorias, NO impone objetivos diarios, NO cronometra ni presiona. La plataforma celebra el avance; el ritmo lo define el docente o el estudiante.

### Base pedagógica

**7mo y 9no grado (12–15 años) — Operaciones Formales (Piaget) + Zona de Desarrollo Próximo (Vygotsky):**
Los adolescentes pueden pensar hipotéticamente, analizar situaciones abstractas y desarrollar metacognición. Les motiva sentir que sus opiniones importan, debatir y analizar casos reales. Las actividades deben retar su pensamiento crítico. Los escenarios de la vida real y el aprendizaje reflexivo son especialmente poderosos a esta edad.

> **Principio transversal:** la gamificación sin base pedagógica produce motivación superficial. Cada elemento lúdico de DignaLearn debe estar directamente alineado a un **indicador de logro del currículo MINED** — el juego refuerza el contenido, no lo reemplaza.

---

### Estructura curricular real del MINED (confirmada — correcciones importantes)

> ⚠️ **Corrección respecto a versiones anteriores:** inicialmente se asumieron 2 unidades por grado. Lo correcto es: **4 unidades (I, II, III, IV), divididas en 2 semestres**, 7 horas/clase por unidad, 1 frecuencia semanal — 28 H/C total por año. El contenido específico varía por grado. En primaria los documentos están organizados por pares de grados (multigrado), no por grado individual.

**Nombres de unidad (confirmados para 1er-2do grado — verificar en otros grados con el agente):**

| Semestre | Unidad | Nombre |
|----------|--------|--------|
| I | I | Dignidad y Respeto para Vivir en Armonía |
| I | II | Viviendo y Practicando Nuestros Derechos |
| II | III | Relaciones Complementarias con Equidad e Igualdad |
| II | IV | Protagonismo y Liderazgo en Unidad |

**Contenido por grado — Secundaria (7mo y 9no, MVP):**

| Grado | Unidad I | Unidad II |
|-------|----------|-----------|
| **7mo** | Dignidad humana, características de la dignidad de la mujer, dignidad en familia/escuela/comunidad, mujer indígena y afrodescendiente | Declaración Universal de DDHH, derechos de la mujer como DDHH, evolución histórica de derechos en Nicaragua, igualdad de género |
| **9no** | Papel de la mujer en la sociedad nicaragüense, mujer en la vida cotidiana, cultura de paz, mujer indígena/afrodescendiente | Igualdad de derechos en hogar/educación/trabajo/salud/política, relaciones desiguales, relaciones de poder, roles de género |

> Unidades III y IV para secundaria se extraen de `Malla-Curricular-III-y-IV-Unidad-Secund-Regular....pdf` mediante el agente en VS Code (ver Parte 15).

---

### Capa 1 — Elementos de aprendizaje por tema

Cada tema tiene **3 elementos secuenciales:**

**Elemento 1 — Exploración del contenido (lectura + visual)**

| Secundaria (7mo y 9no) |
|------------------------|
| Texto de hasta 300 palabras con datos reales o contexto histórico de Nicaragua |
| Presentación directa, sin narrador infantil |
| Ejemplos de situaciones sociales, históricas y de derechos ciudadanos |

> **Nota sobre la mascota guía:** por tiempo del hackathon, **sin voz (audio)**. La idea en planeación: aparece en esquina inferior (no ocupa toda la pantalla), con texto sincronizado visualmente a movimiento de boca estilo pixel-art (2–3 frames, similar en espíritu a la mascota de Claude Code). Ver detalles técnicos en Parte 11.

**Elemento 2 — Actividad lúdica (el minijuego del tema)**

Para secundaria: actividades de análisis — quizzes con casos reales, clasificar situaciones, escenarios de elección. Retroalimentación explicativa que muestra por qué la respuesta correcta es correcta. Sin presión de tiempo.

**Elemento 3 — Reflexión de cierre**

1–2 preguntas que conecten el tema con la vida real del estudiante. Respuesta correcta puede desbloquear un dato adicional de contexto.

Una barra visible muestra `X/3 elementos completados`. Al completar los tres, el tema se marca como **"dominado"** con un ícono temático específico.

---

### Capa 2 — Sistema de insignias (3 niveles)

#### Nivel 1 — Insignia de tema (pequeña)
Se otorga al completar los 3 elementos de un tema. El ícono refleja el contenido específico:

| Tipo de tema | Insignia |
|-------------|---------|
| Dignidad humana / respeto | Corazón con laureles |
| Derechos humanos | Manos unidas o balanza |
| Igualdad de género | Símbolo de igualdad estilizado |
| Prevención de violencia | Escudo |
| Participación / liderazgo | Estrella con silueta femenina |
| Mujer indígena / afrodescendiente | Flor o tejido cultural |
| Cultura de paz | Paloma o círculo de manos |
| Roles de género / relaciones de poder | Balanza con figuras iguales |
| Empoderamiento laboral (9no) | Maletín con estrella |

#### Nivel 2 — Insignia de unidad (grande — diseñada por Sharis)
Se otorga al completar todos los temas de una unidad. Son el "trofeo" principal — aparecen destacadas en el perfil del estudiante.

| Unidad | Nombre de la insignia | Descripción visual sugerida |
|--------|----------------------|---------------------------|
| Unidad I | **"Guardiana de la Dignidad"** | Silueta de mujer con aura/resplandor, colores cálidos |
| Unidad II | **"Conocedora de la Ley"** | Balanza sostenida por manos femeninas |
| Unidad III | **"Defensora de la Equidad"** | Dos figuras entrelazadas (complementariedad) |
| Unidad IV | **"Lideresa en Acción"** | Estrella con silueta de mujer alzando el brazo |

#### Nivel 3 — Insignias especiales (logros transversales)

| Nombre | Condición |
|--------|-----------|
| "Exploradora" | Primer tema dominado |
| "Constante" | 5 días seguidos con actividad (racha) |
| "Imparable" | 30 días de racha |
| "Coleccionista" | 3 insignias de unidad desbloqueadas |
| "Año Completo" | Las 4 unidades completadas |
| "Protagonista de Nicaragua" | Completar Unidad IV de 9no (mujeres históricas) |
| "Defensora de Derechos" | Completar Unidad II de cualquier grado |

**Presentación en el perfil:** insignias de unidad (grandes) arriba, insignias de tema en cuadrícula abajo. Las no obtenidas aparecen en gris/bloqueadas — generan motivación para seguir.

> ⚠️ Ilustraciones finales a cargo de Sharis. En el MVP usar placeholders SVG. **No bloquear el desarrollo por esto.**

---

### Capa 3 — Racha y actividad semanal

Calendario de actividad que marca cada día con al menos 1 elemento completado.

**Reglas:**
- Se activa con mínimo 1 elemento completado en el día.
- Romper la racha no penaliza — solo se celebra mantenerla.
- Mensaje motivacional al registrar actividad del día.

**Estadísticas visibles en Progreso (últimas 4 semanas):** temas visitados, actividades completadas, insignias desbloqueadas.

---

### Vista del docente (panel de grupo)

- Resumen: % promedio del grupo, estudiantes activos esta semana, estudiantes sin actividad reciente.
- Lista de estudiantes: barra de progreso individual, badge de racha activa, última fecha de actividad.
- No muestra respuestas individuales a ejercicios.

---

## PARTE 7 — Flujo de Navegación

### Estructura de navegación (5 secciones)

Barra inferior en móvil; sidebar o topbar en desktop:

| Sección | Contenido |
|---------|-----------|
| Inicio | Dashboard: racha, insignias recientes, progreso general |
| Niveles | Lista de unidades y temas por grado |
| Historia | Modo Historia — novela visual (Sidar) |
| Progreso | Racha, calendario semanal, colección de insignias |
| Extras | Acerca de, Configuración (dark/light mode, cambiar PIN), Política de privacidad |

### Flujo del estudiante

```
Login (código + PIN)
  └── Inicio (dashboard: racha, insignias recientes, progreso general)
        ├── Niveles → Grado (7mo o 9no) → Lista de Unidades → Lista de Temas
        │     └── Tema: [1] Lectura → [2] Minijuego → [3] Reflexión
        │           └── Tema "dominado" ✓ + Insignia de tema
        │                 └── (si todos los temas de la unidad) → Insignia de unidad 🏆
        ├── Historia → Lista de Capítulos → Capítulo (novela visual)
        ├── Progreso → Racha, calendario, colección de insignias
        └── Extras → Config (dark/light, PIN), Acerca de
```

### Flujo del docente

```
Login (email + contraseña)
  └── Dashboard → Resumen del grupo (% promedio, activos, sin actividad)
        ├── Lista de estudiantes con progreso individual
        ├── Ver/copiar código de acceso de estudiante
        ├── Resetear PIN de estudiante
        └── Perfil → Configuración (dark/light mode)
```

---

## PARTE 8 — Tipos de Actividades Lúdicas

Para el MVP implementar **máximo 2 tipos** y escalar luego.

| Tipo | Descripción | Prioridad MVP |
|------|-------------|:-------------:|
| Sopa de letras | Términos clave del tema en cuadrícula | ✅ Alta |
| Quiz / escenario de análisis | Preguntas con casos reales, retroalimentación explicativa | ✅ Alta |
| Arrastrar y soltar (ordenar frases) | Ordenar o clasificar conceptos | Media |
| Clasificación SÍ/NO | Clic para clasificar situaciones | Media |
| Línea de tiempo interactiva | Ordenar eventos o personajes históricos | Baja (MVP+) |

### Minijuegos específicos basados en documentos MINED

Estos juegos están fundamentados directamente en actividades de la Cartilla de Secundaria y documentos MINED — no son inventados:

**1. Sopa de letras temática (Cartilla — metodología confirmada)**
El MINED ya usa sopas de letras en el material impreso. Palabras del MVP: `MUJER`, `EDUCACIÓN`, `DERECHOS`, `PROTAGONISMO`, `LIBERTAD`, `SEGURIDAD`, `DECISIÓN`. Se adaptan por tema: para 7mo → dignidad; para 9no → empoderamiento laboral.

**2. Arrastrar para completar la frase**
El estudiante arrastra palabras o tarjetas para completar o reordenar una frase correcta. Basado en los ejercicios de ordenamiento presentes en la Cartilla.

**3. Clasificar situaciones: Equidad vs. Igualdad (9no — concepto clave)**
La distinción entre equidad e igualdad que desarrolla la Cartilla es ideal para un minijuego de escenarios: el estudiante lee una situación real y decide si es un caso de equidad o de igualdad. Requiere análisis, no memorización — alineado con Vygotsky para secundaria.

**4. Situaciones SÍ/NO — ¿Esta acción respeta los derechos?**
El estudiante ve una situación de la vida real y decide si promueve o viola un derecho. Con retroalimentación inmediata. Adaptado de los ejercicios de reflexión de la Cartilla.

**5. "¿Quién soy?" — Mujeres históricas de Nicaragua (9no, Unidad IV)**
El estudiante lee una descripción de una mujer histórica nicaragüense y adivina quién es. Personajes confirmados en el material MINED: Concepción Palacios Herrera, Josefa Emilia Toledo, Haydée Palacios Vivas, Doris Tijerino Haslam. Implementar como quiz de selección múltiple.

> ⚠️ **Nota de derechos de autor MINED:** la contraportada de la Cartilla indica "Se prohíbe la reproducción total o parcial sin autorización expresa del MINED." El contenido de DignaLearn debe ser una **adaptación y reformulación propia** del material — no copia directa de textos. Esto también es correcto pedagógicamente: el formato digital requiere adaptación.

---

## PARTE 9 — Autenticación y Seguridad

### Sistema de acceso por rol

**Estudiante — código + PIN:**
1. Docente crea la cuenta del estudiante desde su panel (nombre + grado).
2. El sistema genera automáticamente un código de 6 caracteres (`DL-XXXX`).
3. El docente le da ese código al estudiante en clase.
4. El estudiante ingresa el código y elige un PIN de 4 dígitos (primera vez).
5. De ahí en adelante: código + PIN para entrar.
6. El docente puede resetear el PIN desde su panel si el estudiante lo olvida.

**Docente — email + contraseña:**
Supabase Auth estándar. El admin crea la cuenta desde Supabase Studio.

### Roles y RLS

Roles implementados como claims en el JWT de Supabase: `student` / `teacher` / `admin`.

**Row Level Security:**
- Estudiante: accede solo a su propio progreso y al contenido de su grado.
- Docente: lee el progreso de los estudiantes que él creó.
- Contenido (unidades, temas): visible para cualquier usuario autenticado.

### Privacidad de menores

- Datos mínimos: display name, código de acceso, PIN hasheado, grado, progreso.
- Sin datos personales sensibles (sin fecha de nacimiento, sin email para estudiantes).
- Alineado con Ley N° 787 de Protección de Datos Personales de Nicaragua.
- La plataforma necesita una política de privacidad accesible desde el footer — ver Parte 13.

### Seguridad general
- TLS: Vercel y Supabase lo proveen por defecto en producción.
- PIN almacenado hasheado — nunca en texto plano.

---

## PARTE 10 — Módulo Modo Historia (Sidar Perez)

### Descripción

El Modo Historia es una novela visual educativa simple: personajes + texto narrativo, sin voz, que aborda los temas de la asignatura MINED de forma narrativa. Desarrollado por Sidar de forma independiente pero integrado al proyecto principal.

### Arquitectura de integración

**Modelo acordado:** Sidar desarrolla el Modo Historia como rutas Next.js dentro del mismo repo (`frontend/app/(student)/historia/`), trabajando en su propia rama de Git y haciendo PR al repo principal antes del 27 de agosto.

**No es un repo separado** — eso complicaría el despliegue y la autenticación compartida.

### Condiciones técnicas (Sidar DEBE respetar estas sin excepción)

**1. Autenticación:** Sidar no implementa su propio sistema. El Modo Historia lee el token de sesión de Supabase que ya existe en la app principal. Si no hay sesión activa, redirige al login principal.

**2. Base de datos:** Solo lee y escribe en `story_chapters` y `student_story_progress` (schema abajo). No crea tablas propias sin coordinar con Eddy.

**3. Variables de entorno:** Usa las mismas ENV del proyecto (`SUPABASE_URL`, `SUPABASE_ANON_KEY`). No crea archivos `.env` propios.

**4. Contenido — CRÍTICO:** Los capítulos DEBEN ser sobre la asignatura MINED "Derechos y Dignidad de la Mujer". No sobre otras materias (Ciencias, Matemáticas, Historia general, Química). Los títulos y tramas giran sobre dignidad, derechos, igualdad de género, liderazgo femenino — el currículo mapeado en la Parte 6.

**5. Diseño:** Usa la misma paleta de colores del proyecto principal. No inventa su propio color scheme.

**6. Navegación:** Al terminar o salir de un capítulo, el botón de regreso lleva a `/historia` en la app principal.

**7. Entrega:** PR al repo principal antes del **27 de agosto** (3 días de buffer antes de la presentación del 30).

### Schema contractual para Sidar

```sql
-- Sidar puede hacer SELECT en story_chapters
-- Sidar puede hacer SELECT/INSERT/UPDATE en student_story_progress
-- No puede crear, modificar ni eliminar otras tablas

story_chapters (
  id            UUID PRIMARY KEY,
  grade         INTEGER,       -- 7 o 9 (MVP)
  unit_id       UUID,          -- unidad MINED correspondiente
  title         TEXT,
  description   TEXT,
  "order"       INTEGER,
  is_free       BOOLEAN,       -- primer capítulo de cada unidad = true
  total_pages   INTEGER,
  estimated_minutes INTEGER,
  cover_image_url TEXT,
  is_active     BOOLEAN
)

student_story_progress (
  id            UUID PRIMARY KEY,
  student_id    UUID,          -- referencia a users.id
  chapter_id    UUID,          -- referencia a story_chapters.id
  completed     BOOLEAN,
  pages_read    INTEGER,
  last_read_at  TIMESTAMPTZ
)
```

---

## PARTE 11 — Branding y UI/UX

### Identidad visual (preliminar — pendiente branding definitivo de Sharis)

**Logo:** Silueta de mujer formada por piezas de rompecabezas, en rosa y teal sobre fondo oscuro. Wordmark: "Digna" en blanco, "Learn" en teal.

**Tagline del logo:** "Educación que empodera. Dignidad que transforma." (Es el tagline poético del branding — distinto de la propuesta de valor funcional que usa "fortalecemos".)

**Paleta de color (extraída de mockups preliminares — puede cambiar con branding definitivo):**

| Token | Color aprox. | Uso |
|-------|-------------|-----|
| Fondo dark | `#1A1525` | Fondo principal en dark mode |
| Superficie dark | `#231B35` | Cards y contenedores en dark mode |
| Acento principal | `#E86B9A` | Botones CTA, texto destacado, barras de progreso |
| Acento secundario | `#7BB8C0` | Teal del logo, "Learn" wordmark, elementos secundarios |
| Texto principal | `#FFFFFF` | Títulos en dark mode |
| Texto secundario | `#B8A9C9` | Cuerpo y descripciones en dark mode |
| Gamificación | Naranja/ámbar | Racha, insignias especiales |

**Dark mode:** base del branding — morado/navy oscuro.  
**Light mode:** fondo blanco/crema con los mismos acentos rosa y teal. Toggle en Extras > Configuración.

> ⚠️ La tipografía definitiva la define el equipo de diseño. Usar `Inter` como placeholder — es reemplazable con un cambio de una línea en Tailwind.

### Estructura de navegación

| Sección | Ícono sugerido | Contenido |
|---------|---------------|-----------|
| Inicio | Casa | Dashboard: racha, insignias recientes, progreso |
| Niveles | Libro | Unidades y temas por grado |
| Historia | Cómic/mando | Modo Historia (Sidar) |
| Progreso | Gráfico de barras | Racha, calendario semanal, colección de insignias |
| Extras | Estrella | Acerca de, Configuración, Política de privacidad |

### Mascota guía — especificación técnica

- **Posición:** esquina inferior de la pantalla (~120×120 px). No bloquea el contenido principal.
- **Animación:** sprite de 2–3 frames (boca abierta / semicerrada / cerrada). Se alterna cada ~100ms mientras el texto aparece con efecto typewriter (caracter por caracter).
- **Sin audio.** El movimiento de boca sincronizado al texto es puramente visual.
- **Reutilizable:** la misma mascota aparece en lectura, bienvenida al minijuego y celebración al completar un tema.
- **Implementación:** sprite sheet simple + JavaScript puro (sin librerías pesadas). Un intervalo que sincroniza el frame con el índice del caracter que se está revelando.
- **Diseño:** pendiente de definición por Sharis/Sidar. Usar placeholder (ícono SVG simple) hasta que el diseño esté listo. No bloquear desarrollo.

---

## PARTE 12 — Modelo de Negocio

> ⚠️ En definición — el equipo de marketing (Eddy/Ronald) confirmará el modelo final. Lo que sigue es la propuesta base para el hackathon.

### Principio base

El contenido curricular completo (las 4 unidades de la asignatura MINED) es **siempre gratuito**. Es material obligatorio del currículo nacional. Poner un paywall en contenido educativo obligatorio va en contra de la propuesta de valor y de la percepción de los jueces.

Lo que se monetiza son **capas opcionales** sobre ese núcleo gratuito.

### Flujos de ingreso

**1. Plan institucional (B2B — flujo principal)**
Centros privados pagan una licencia anual que incluye: reportes avanzados del grupo, exportación de datos, múltiples grupos por docente, branding personalizado del centro en la plataforma. Para el MINED: contrato de implementación. Este es el flujo que se presenta ante los jueces.

**2. Certificados verificables (B2C suave)**
Al completar las 4 unidades del año, el estudiante puede descargar un certificado digital con QR verificable, nombre, grado y sello de DignaLearn. El logro digital básico es gratuito; la versión premium (imprimible, con firma digital verificable) tiene un costo simbólico. En el contexto nicaragüense, los padres ya pagan por diplomas y fotos escolares — este modelo es familiar y aceptable.

**3. Modo Historia — primer capítulo gratis**
El primer capítulo de cada unidad en el Modo Historia es gratuito. El acceso completo se desbloquea con el plan institucional o con una compra individual pequeña.

**4. Cosméticos de la mascota (microtransacciones suaves)**
Skins de vestuario de la mascota — el estudiante o la institución los desbloquea con logros o de forma opcional. No afectan el aprendizaje. Son el modelo de microtransacción no invasivo porque son puramente cosméticos.

---

## PARTE 13 — Créditos y Sección de Autores

### Footer (todas las páginas)

```
© 2026 DignaLearn — Equipo Rysteam · Hackathon Nicaragua 2026
Contenido educativo basado en documentos oficiales del MINED Nicaragua
[Política de privacidad] · [Términos de uso] · [Contacto]
```

### Pantalla "Acerca de" (en Extras)

Debe incluir:
- Descripción breve del proyecto y su propósito
- Créditos del equipo con roles:
  - Eddy Marenco — Líder y Marketing
  - Ronald Dávila — Comunicador
  - Sharis Peralta — Diseño
  - Dirk Martinez — Backend
  - Sidar Perez — Frontend y Modo Historia
- "Hecho con ❤️ en Nicaragua"
- Evento: Hackathon Nicaragua 2026

### Política de privacidad (mínima — obligatoria)

Dado que la plataforma tiene usuarios menores de edad, **debe existir** aunque sea una página simple. Debe indicar:
- Qué datos se recopilan (display name, progreso, código de acceso)
- Que no se recopilan ni comparten datos personales sensibles de menores
- Que los datos no se venden ni comparten con terceros
- Contacto para consultas

Los jueces de la categoría educación lo van a notar si no existe.

---

## PARTE 14 — Despliegue (MVP)

| Componente | Servicio | Plan |
|-----------|---------|------|
| Frontend (Next.js) | **Vercel** | Free tier |
| Backend (FastAPI) | **Render** o **Railway** | Free tier |
| Base de datos + Auth | **Supabase** | Free tier (500MB, 50k MAU) |

**Desarrollo local:** Supabase CLI + Docker; `uvicorn` para FastAPI; `npm run dev` para Next.js.

---

## PARTE 15 — Documentos MINED: metodología para el agente en VS Code

### Aclaración: "el repo" no es este chat

Cuando esta sección dice "el repo", se refiere a **la carpeta del proyecto en tu computadora** — clon de `github.com/Rysteam-hackathon/DignaLearn` abierto en VS Code. Los PDFs MINED van directo a esa carpeta, nunca a este chat.

### Por qué no aplica el límite de imágenes en VS Code

Claude Code en VS Code lee archivos directamente del disco como texto — no convierte páginas de PDF a imágenes. No hay "límite de imágenes" ahí.

### Estrategia (PDFs pesados → Markdown reutilizable)

1. **PDFs en carpeta gitignored:**
   ```
   DignaLearn/docs/curriculum-source/   ← agregar línea a .gitignore
   ```

2. **Antes de extraer: confirmar grado real de cada documento.** Instrucción para el agente:
   > *"Abrí el PDF, revisá la portada y la tabla de distribución de carga horaria, decime qué grado(s) cubre antes de extraer nada más."*

3. **Con grado confirmado, extraer a Markdown:**
   ```
   docs/curriculum/secundaria/7mo.md
   docs/curriculum/secundaria/9no.md
   ```

4. **El `.md` (no el PDF) alimenta `db/seed.sql`.**

5. **Un documento a la vez** — no todos juntos en el mismo mensaje al agente.

### Mapeo documento → grado (verificar con el agente)

| Archivo fuente | Grado probable | Confirmado |
|----------------|---------------|:---:|
| `I-UNIDAD-PEDAGOGICA-2DO-SEMESTRE.pdf` | 1er-2do grado (primaria) | ✅ |
| `II-UNIDAD-PEDAGOGICA-2do-SEMESTRE.pdf` | 3er-4to grado (primaria) | ⚠️ Verificar |
| `III-UNIDAD-PEDAGOGICA-2DO-SEMESTRE.pdf` | 5to-6to grado (primaria) | ⚠️ Verificar |
| `IV-UP-DERECHO-Y-DIGNIDAD-DE-MUJERES-P...pdf` | Sin confirmar | ⚠️ Verificar |
| `Cartilla-Secundaria-4.pdf` | Posiblemente 10mo grado | ⚠️ Verificar |
| `Malla-Curricular-III-y-IV-Unidad-Secund-Regular...pdf` | Unidades III-IV, todos los grados de secundaria | ⚠️ Verificar |

---

## PARTE 16 — Pendientes Antes de Codear

- [ ] Recibir branding definitivo de Sharis: tipografía, paleta exacta, logo en SVG.
- [ ] Extraer contenido de Unidades III y IV (7mo y 9no) de `Malla-Curricular-III-y-IV-Unidad-Secund-Regular....pdf`.
- [ ] Cantidad exacta de temas dentro de cada una de las 4 unidades para 7mo y 9no.
- [ ] Decidir cuál de los 2 minijuegos MVP va primero: sopa de letras o quiz/escenario.
- [ ] Ilustraciones de insignias (Sharis). Usar placeholders SVG hasta que estén — no bloquear desarrollo.
- [ ] Confirmar si el docente crea sus propios grupos o si el admin los asigna en el MVP.
- [ ] Confirmar modelo de negocio definitivo con el mercadólogo del equipo.
- [ ] Recibir código del Modo Historia de Sidar antes del 27 de agosto.
- [ ] Correcciones adicionales del profesor/mentor (audio parcialmente recibido — reformular en la marcha del desarrollo).

---

## PARTE 17 — Instrucciones para Claude Code (Agente en VS Code)

> **Leé este documento completo antes de generar cualquier código o estructura.**

### Reglas generales

1. El proyecto es **greenfield total** — no hay código previo que respetar.
2. **Alcance del MVP: solo 7mo y 9no grado de secundaria.** Los demás grados se agregan después.
3. Nunca inventar contenido de unidades o temas — usar solo lo extraído de documentos MINED oficiales.
4. Respetar convenciones del equipo: ramas `feature/nombre-tarea`, commits `feat:` / `fix:` / `docs:`.
5. El Modo Historia (`frontend/app/(student)/historia/`) lo desarrolla Sidar en su propia rama. No interferir. Las tablas `story_chapters` y `student_story_progress` deben existir en el schema desde el inicio.
6. El sistema de login para estudiantes es **código de 6 chars + PIN de 4 dígitos** — no email. La columna `access_code` en `users` debe existir desde la primera migración.
7. El sitio debe ser **responsive web** (celular y desktop). No es app móvil — las decisiones de layout deben reflejar esto.

### Orden de implementación

1. Estructura base del monorepo (carpetas + configs + `.gitignore` actualizado)
2. Auth + perfiles — Supabase Auth con roles, generación de `access_code` para estudiantes
3. Modelo de datos — `db/schema.sql` completo con todas las entidades de la Parte 5 (incluyendo tablas de Sidar)
4. Contenido estático — poblar `units` y `topics` en `db/seed.sql` para 7mo y 9no
5. Flujo de lectura del estudiante — páginas de unidad, tema y material informativo
6. Primera actividad lúdica — sopa de letras
7. Segunda actividad lúdica — quiz/escenario de análisis
8. Sistema de progreso (Capa 1) — barra de elementos, marcar tema como dominado
9. Sistema de insignias (Capa 2) — `backend/services/gamification.py`, evaluación de umbrales
10. Racha y estadísticas (Capa 3)
11. Panel del docente — progreso grupal/individual, gestión de códigos de acceso
12. Dark/light mode — toggle en perfil del usuario
13. Footer con créditos y link a política de privacidad
14. Integración con Modo Historia de Sidar (cuando llegue el PR)
15. Pulido visual — insignias definitivas de Sharis

### Dónde va cada tipo de lógica

- **CRUD simple:** Supabase SDK en `frontend/lib/supabase.ts`
- **Gamificación (XP, insignias, rachas):** `backend/services/gamification.py`
- **Reportes del docente:** `backend/services/reports.py`
- **Seguridad de datos:** políticas RLS en Supabase Studio / `db/schema.sql`

---

*Documento generado y actualizado en sesión de planeamiento con Claude (claude.ai) · Equipo Rysteam · Hackathon Nicaragua 2026 · Última actualización: 20/08/2026*

---

## PARTE 18 — Decisiones y Actualizaciones (Sesión 23/08/2026)

> Decisiones tomadas durante la sesión de desarrollo con Dirk Martinez. Estas actualizan y complementan partes anteriores del PRD.

### Estado de implementación al 23/08/2026

| Paso PRD | Descripción | Estado |
|----------|-------------|--------|
| 1 | Monorepo base + Next.js 14 + Tailwind | ✅ Completo |
| 2 | FastAPI init + entorno virtual + .env | ✅ Completo (parcial — falta main.py) |
| 3–15 | Resto de pasos | 🔜 Pendiente |

**Rama activa:** `feature/monorepo-setup`  
**Commits realizados:**
- `chore: monorepo base structure + Next.js 14 frontend init`
- `chore: FastAPI backend init + requirements`

---

### Mascota guía — decisión definitiva para el MVP

**Para el hackathon (30/08/2026):** la mascota funciona con **texto pregrabado**. Sin API de IA. Aparece en la esquina inferior, saluda al iniciar sesión, acompaña la lectura con globo de diálogo, y da pistas fijas por tema cuando el estudiante falla una actividad.

**Post-hackathon (v2):** integración con API de IA (a confirmar con mentores) para respuestas dinámicas. El chatbot de la mascota tendría dos modos:
- Modo pistas para estudiantes: respuestas limitadas al tema actual, solo pistas — nunca respuestas directas.
- Modo consultas para docentes: el docente puede preguntar datos del grupo ("¿cuántos estudiantes completaron la Unidad I?") y el sistema responde con datos reales de la BD.

---

### Sistema de actividades — banco de preguntas aleatorio

**Decisión:** cada actividad lúdica no es una sola versión fija — tiene un **banco de variantes** en la base de datos. El sistema selecciona aleatoriamente cuál mostrar en cada intento, con estas reglas:

- Si el estudiante falla y reintenta, no le sale la misma variante.
- Si completa y quiere repetir, puede salir una combinación de variantes anteriores.
- El asistente/mascota es consciente de qué variante está activa para dar pistas coherentes.

**Impacto en el modelo de datos:** la tabla `activities` necesita un campo `variant_group` para agrupar variantes del mismo tema, y el `config_json` almacena el contenido específico de cada variante.

**Impacto en la implementación:** esto aplica a todos los tipos de actividad (sopa de letras, quiz, arrastra y suelta) en todos los grados del MVP (7mo y 9no).

---

### Asistente docente con IA — funcionalidad futura

El docente podrá hacer consultas en lenguaje natural sobre el progreso de su grupo. Ejemplos de consultas:

- "¿Cuántos estudiantes completaron la Unidad I esta semana?"
- "¿Quién no ha tenido actividad en los últimos 7 días?"
- "¿Cuál es el promedio del grupo en 7mo grado?"

Esta funcionalidad respeta los permisos RLS del rol docente — no puede ver datos de estudiantes que no son suyos.

**Estado:** documentado como funcionalidad post-hackathon. Requiere definición de API key y modelo de IA con el equipo.

---

### Nota sobre continuidad del contexto

El PRD es la fuente de verdad del proyecto. Cualquier decisión nueva tomada en sesiones de desarrollo debe agregarse aquí antes de codear. Al iniciar una nueva sesión con el asistente de arquitectura, este documento debe estar cargado en el contexto del proyecto para mantener continuidad.

