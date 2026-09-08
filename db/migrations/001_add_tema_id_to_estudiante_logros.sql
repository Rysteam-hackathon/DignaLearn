-- ============================================================
-- DignaLearn — Migración 001
-- Agrega tema_id a estudiante_logros para permitir que el logro
-- "¡Tema completado!" se otorgue una vez por tema dominado
-- (no una sola vez por estudiante).
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================

-- 1. Agregar columna tema_id (nullable — los logros de unidad y especial la dejan NULL)
ALTER TABLE estudiante_logros
    ADD COLUMN IF NOT EXISTS tema_id UUID REFERENCES temas(id);

-- 2. Eliminar el UNIQUE anterior que bloqueaba la celebración múltiple
ALTER TABLE estudiante_logros
    DROP CONSTRAINT IF EXISTS estudiante_logros_estudiante_id_logro_id_key;

-- 3. Nuevo índice UNIQUE para logros de tema (uno por estudiante por tema)
CREATE UNIQUE INDEX IF NOT EXISTS estudiante_logros_tema_unique
    ON estudiante_logros(estudiante_id, logro_id, tema_id)
    WHERE tema_id IS NOT NULL;

-- 4. Nuevo índice UNIQUE para logros de unidad y especiales (uno por estudiante)
CREATE UNIQUE INDEX IF NOT EXISTS estudiante_logros_general_unique
    ON estudiante_logros(estudiante_id, logro_id)
    WHERE tema_id IS NULL;
