-- ============================================================
-- DignaLearn — Schema PostgreSQL para Supabase
-- Normalizado a 3FN — 17 tablas
-- Con validaciones realistas via CHECK constraints
-- ============================================================
-- NOTA: En Supabase este script se ejecuta en el SQL Editor
-- La BD ya existe — no se crea aquí (Supabase la maneja)
-- RLS (Row Level Security) se configura por separado en Supabase Studio
-- ============================================================


-- ============================================================
-- DOMINIO 1: CATÁLOGOS
-- Primero porque el resto los referencia con FK
-- ============================================================

CREATE TABLE roles (
    id          SERIAL       PRIMARY KEY,
    nombre      VARCHAR(20)  NOT NULL UNIQUE
                CHECK (nombre IN ('student', 'teacher', 'admin')),
    descripcion VARCHAR(100)
);

CREATE TABLE tipos_actividad (
    id          SERIAL       PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL UNIQUE
                CHECK (nombre IN ('sopa_letras', 'quiz', 'drag_drop', 'scenario')),
    descripcion VARCHAR(200)
);

CREATE TABLE niveles_logro (
    id          SERIAL       PRIMARY KEY,
    nombre      VARCHAR(30)  NOT NULL UNIQUE
                CHECK (nombre IN ('tema', 'unidad', 'especial')),
    descripcion VARCHAR(200)
);

-- numero_grado + nivel son únicos juntos porque 1ro primaria ≠ 1ro secundaria
CREATE TABLE grados (
    id             SERIAL      PRIMARY KEY,
    numero_grado   INT         NOT NULL CHECK (numero_grado BETWEEN 1 AND 11),
    nivel          VARCHAR(20) NOT NULL CHECK (nivel IN ('primaria', 'secundaria')),
    nombre_display VARCHAR(60) NOT NULL,
    UNIQUE(numero_grado, nivel)
);


-- ============================================================
-- DOMINIO 2: USUARIOS Y AUTENTICACIÓN
-- ============================================================

-- usuarios.id = auth.users.id en Supabase (mismo UUID)
CREATE TABLE usuarios (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(254) NULL CHECK (
                       email IS NULL OR (
                           LENGTH(TRIM(email)) > 5
                           AND LOWER(email) ~ '^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$'
                       )
                   ),
    rol_id         INT          NOT NULL REFERENCES roles(id),
    nombre_display VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(nombre_display)) >= 2),
    creado_en      TIMESTAMPTZ  DEFAULT NOW()
);

-- 1:1 con usuarios — solo existe si el rol es 'student'
-- codigo_acceso: exactamente el formato 'DL-XXXX' (DL- + 4 chars alfanuméricos mayúscula)
-- pin_hash: bcrypt produce SIEMPRE 60 chars exactos — CHAR no VARCHAR
CREATE TABLE perfiles_estudiante (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id    UUID        NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    grado_id      INT         NOT NULL REFERENCES grados(id),
    codigo_acceso VARCHAR(10) NOT NULL UNIQUE
                  CHECK (codigo_acceso ~ '^DL-[A-Z0-9]{4}$'),
    pin_hash      CHAR(60)    NOT NULL
);

-- 1:1 con usuarios — solo existe si el rol es 'teacher'
CREATE TABLE perfiles_docente (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id     UUID         NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_escuela VARCHAR(200)
);

-- Tabla intermedia: qué estudiantes creó cada docente
-- Permite RLS: docente solo ve el progreso de SUS estudiantes
CREATE TABLE docente_estudiantes (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    docente_id    UUID        NOT NULL REFERENCES perfiles_docente(id),
    estudiante_id UUID        NOT NULL REFERENCES perfiles_estudiante(id),
    creado_en     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(docente_id, estudiante_id)
);


-- ============================================================
-- DOMINIO 3: CURRÍCULO (contenido MINED)
-- Jerarquía: grados → unidades → temas
-- ============================================================

CREATE TABLE unidades (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    grado_id      INT          NOT NULL REFERENCES grados(id),
    titulo        VARCHAR(200) NOT NULL CHECK (LENGTH(TRIM(titulo)) >= 3),
    descripcion   TEXT,
    numero_unidad INT          NOT NULL CHECK (numero_unidad BETWEEN 1 AND 4),
    semestre      INT          NOT NULL CHECK (semestre IN (1, 2)),
    imagen_portada TEXT,
    activa        BOOLEAN      DEFAULT TRUE,
    UNIQUE(grado_id, numero_unidad)
);

CREATE TABLE temas (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    unidad_id         UUID         NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
    titulo            VARCHAR(200) NOT NULL CHECK (LENGTH(TRIM(titulo)) >= 3),
    contenido_lectura TEXT         NOT NULL CHECK (LENGTH(TRIM(contenido_lectura)) >= 10),
    orden             INT          NOT NULL CHECK (orden > 0),
    minutos_estimados INT          DEFAULT 15 CHECK (minutos_estimados > 0)
);


-- ============================================================
-- DOMINIO 4: ACTIVIDADES (banco de variantes aleatorio)
-- grupo_variante agrupa variantes del mismo tema para rotación
-- config_json almacena el contenido específico en JSONB
-- ============================================================

CREATE TABLE actividades (
    id                        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    tema_id                   UUID    NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
    tipo_actividad_id         INT     NOT NULL REFERENCES tipos_actividad(id),
    grupo_variante            INT     NOT NULL CHECK (grupo_variante >= 1),
    config_json               JSONB   NOT NULL,
    puntos_recompensa         INT     DEFAULT 10 CHECK (puntos_recompensa >= 0),
    puntaje_minimo_aprobacion INT     DEFAULT 60 CHECK (puntaje_minimo_aprobacion BETWEEN 0 AND 100)
);

-- Pistas de la mascota — máximo 5 por variante, reveladas progresivamente
CREATE TABLE pistas_actividad (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    actividad_id UUID         NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    orden_pista  INT          NOT NULL CHECK (orden_pista BETWEEN 1 AND 5),
    texto_pista  VARCHAR(500) NOT NULL CHECK (LENGTH(TRIM(texto_pista)) >= 5)
);


-- ============================================================
-- DOMINIO 5: PROGRESO DEL ESTUDIANTE
-- 3 elementos por tema: lectura + actividad + reflexión
-- UNIQUE garantiza un solo registro por estudiante-tema
-- ============================================================

CREATE TABLE progreso_estudiante (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id        UUID        NOT NULL REFERENCES perfiles_estudiante(id),
    tema_id              UUID        NOT NULL REFERENCES temas(id),
    lectura_completada   BOOLEAN     DEFAULT FALSE,
    actividad_completada BOOLEAN     DEFAULT FALSE,
    reflexion_respondida BOOLEAN     DEFAULT FALSE,
    puntaje              INT         DEFAULT 0 CHECK (puntaje BETWEEN 0 AND 100),
    ultima_actividad_id  UUID        REFERENCES actividades(id),
    completado_en        TIMESTAMPTZ,
    UNIQUE(estudiante_id, tema_id)
);

-- Un registro por día por estudiante — base del cálculo de racha
CREATE TABLE actividad_diaria (
    id                    UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id         UUID  NOT NULL REFERENCES perfiles_estudiante(id),
    fecha_actividad       DATE  NOT NULL,
    elementos_completados INT   DEFAULT 0 CHECK (elementos_completados >= 0),
    UNIQUE(estudiante_id, fecha_actividad)
);


-- ============================================================
-- DOMINIO 6: LOGROS E INSIGNIAS
-- ============================================================

CREATE TABLE logros (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo          VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(titulo)) >= 2),
    descripcion     VARCHAR(300),
    icono_url       TEXT,
    nivel_logro_id  INT          NOT NULL REFERENCES niveles_logro(id),
    tipo_condicion  VARCHAR(50),
    valor_condicion INT          CHECK (valor_condicion IS NULL OR valor_condicion > 0)
);

-- Tabla intermedia: insignias desbloqueadas por estudiante
-- UNIQUE evita desbloquear el mismo logro dos veces
CREATE TABLE estudiante_logros (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id   UUID        NOT NULL REFERENCES perfiles_estudiante(id),
    logro_id        UUID        NOT NULL REFERENCES logros(id),
    desbloqueado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(estudiante_id, logro_id)
);


-- ============================================================
-- DOMINIO 7: MODO HISTORIA (Sidar Perez)
-- Sidar: SELECT/INSERT/UPDATE en estas dos tablas solamente
-- Para agregar columnas nuevas: coordinar con Eddy primero
-- ============================================================

CREATE TABLE capitulos_historia (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    grado_id          INT          NOT NULL REFERENCES grados(id),
    unidad_id         UUID         NOT NULL REFERENCES unidades(id),
    titulo            VARCHAR(200) NOT NULL CHECK (LENGTH(TRIM(titulo)) >= 3),
    descripcion       TEXT,
    orden             INT          NOT NULL CHECK (orden > 0),
    es_gratis         BOOLEAN      DEFAULT FALSE,
    total_paginas     INT          CHECK (total_paginas IS NULL OR total_paginas > 0),
    minutos_estimados INT          CHECK (minutos_estimados IS NULL OR minutos_estimados > 0),
    imagen_portada    TEXT,
    activo            BOOLEAN      DEFAULT TRUE
);

CREATE TABLE progreso_historia_estudiante (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id     UUID        NOT NULL REFERENCES perfiles_estudiante(id),
    capitulo_id       UUID        NOT NULL REFERENCES capitulos_historia(id),
    completado        BOOLEAN     DEFAULT FALSE,
    paginas_leidas    INT         DEFAULT 0 CHECK (paginas_leidas >= 0),
    ultima_lectura_en TIMESTAMPTZ,
    UNIQUE(estudiante_id, capitulo_id)
);


-- ============================================================
-- DATOS SEMILLA (valores iniciales de catálogos)
-- Ejecutar junto con el schema — solo una vez
-- ============================================================

INSERT INTO roles (nombre, descripcion) VALUES
    ('student', 'Estudiante de 7mo o 9no grado'),
    ('teacher', 'Docente que gestiona sus estudiantes'),
    ('admin',   'Administrador del sistema — gestiona desde Supabase Studio');

INSERT INTO tipos_actividad (nombre, descripcion) VALUES
    ('sopa_letras', 'Sopa de letras con términos clave del tema'),
    ('quiz',        'Quiz con casos reales y retroalimentación explicativa'),
    ('drag_drop',   'Arrastra y suelta para ordenar o clasificar conceptos'),
    ('scenario',    'Escenario de elección: ¿Esta acción respeta los derechos?');

INSERT INTO niveles_logro (nombre, descripcion) VALUES
    ('tema',     'Insignia pequeña al completar los 3 elementos de un tema'),
    ('unidad',   'Insignia grande al completar todos los temas de una unidad'),
    ('especial', 'Logro transversal: racha, coleccionista, año completo, etc.');

INSERT INTO grados (numero_grado, nivel, nombre_display) VALUES
    (7, 'secundaria', '7mo Grado de Secundaria'),
    (9, 'secundaria', '9no Grado de Secundaria');
-- Los demás grados se agregan en versiones posteriores al hackathon


-- ============================================================
-- RESUMEN
-- ============================================================
-- TABLAS: 17 en 7 dominios
-- Catálogos (4):   roles, tipos_actividad, niveles_logro, grados
-- Usuarios (4):    usuarios, perfiles_estudiante, perfiles_docente, docente_estudiantes
-- Currículo (2):   unidades, temas
-- Actividades (2): actividades, pistas_actividad
-- Progreso (2):    progreso_estudiante, actividad_diaria
-- Logros (2):      logros, estudiante_logros
-- Historia (2):    capitulos_historia, progreso_historia_estudiante
-- ============================================================
