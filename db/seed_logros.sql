-- ============================================================
-- DignaLearn — db/seed_logros.sql
-- Catálogo de logros para el sistema de gamificación.
-- `tipo_condicion` es el identificador que usa
-- backend/app/services/gamification.py para saber qué logro
-- otorgar ante cada condición cumplida — si cambiás estos
-- strings acá, actualizá también el backend (y viceversa).
-- Ejecutar en el SQL Editor de Supabase después de db/schema.sql
-- (que ya siembra la tabla `niveles_logro`).
-- ============================================================

-- Nivel "tema": al completar lectura + actividad + reflexión de un tema
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
    ('¡Tema completado!', 'Completaste la lectura, la actividad y la reflexión de un tema.',
     (SELECT id FROM niveles_logro WHERE nombre = 'tema'), 'tema_completado', NULL);

-- Nivel "unidad": al completar todos los temas de una unidad
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
    ('¡Unidad dominada!', 'Completaste todos los temas de una unidad.',
     (SELECT id FROM niveles_logro WHERE nombre = 'unidad'), 'unidad_completada', NULL);

-- Nivel "especial": El Primer Paso — primer tema dominado del estudiante
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
    ('El Primer Paso', 'Completaste tu primer tema en DignaLearn.',
     (SELECT id FROM niveles_logro WHERE nombre = 'especial'), 'primer_tema', NULL);

-- Nivel "especial": Constante — 5 días consecutivos de actividad
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
    ('Constante', 'Estudiaste 5 días seguidos sin fallar.',
     (SELECT id FROM niveles_logro WHERE nombre = 'especial'), 'racha_dias', 5);

-- Nivel "especial": Seriamente — las 4 unidades de un grado completas
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
    ('Seriamente', 'Completaste las 4 unidades de tu grado.',
     (SELECT id FROM niveles_logro WHERE nombre = 'especial'), 'grado_completo', NULL);
