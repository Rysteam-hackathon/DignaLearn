-- ============================================================
-- DignaLearn — db/seed_logros.sql
-- 13 logros del catálogo MVP.
-- tipo_condicion debe coincidir exactamente con gamification.py
-- ============================================================

TRUNCATE TABLE logros RESTART IDENTITY CASCADE;

-- NIVEL TEMA (genérico, se otorga una vez por estudiante)
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('¡Tema completado!',
 'Completaste los 3 elementos: lectura, actividad y reflexión.',
 (SELECT id FROM niveles_logro WHERE nombre = 'tema'),
 'tema_completado', NULL);

-- NIVEL UNIDAD (nombrados por orden 1-4, aplican a 7mo y 9no)
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Guardianes de la Dignidad',
 'Completaste la Unidad I: Dignidad y Respeto para Vivir en Armonía.',
 (SELECT id FROM niveles_logro WHERE nombre = 'unidad'),
 'unidad_completada', 1);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Conocedores de la Ley',
 'Completaste la Unidad II: Viviendo y Practicando Nuestros Derechos.',
 (SELECT id FROM niveles_logro WHERE nombre = 'unidad'),
 'unidad_completada', 2);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Defensores de la Equidad',
 'Completaste la Unidad III: Relaciones Complementarias con Equidad e Igualdad.',
 (SELECT id FROM niveles_logro WHERE nombre = 'unidad'),
 'unidad_completada', 3);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Líderes en Acción',
 'Completaste la Unidad IV: Protagonismo y Liderazgo en Unidad.',
 (SELECT id FROM niveles_logro WHERE nombre = 'unidad'),
 'unidad_completada', 4);

-- NIVEL ESPECIAL
INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('El Primer Paso',
 'Completaste tu primer tema en DignaLearn.',
 (SELECT id FROM niveles_logro WHERE nombre = 'especial'),
 'primer_tema', NULL);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Constante',
 'Cinco días seguidos de aprendizaje. La constancia construye el conocimiento.',
 (SELECT id FROM niveles_logro WHERE nombre = 'especial'),
 'racha_dias', 5);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Semana Activa',
 'Siete días seguidos. Una semana completa dedicada al aprendizaje.',
 (SELECT id FROM niveles_logro WHERE nombre = 'especial'),
 'racha_dias', 7);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Imparable',
 'Treinta días seguidos. Un mes entero de dedicación constante.',
 (SELECT id FROM niveles_logro WHERE nombre = 'especial'),
 'racha_dias', 30);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Ojo Alerta',
 'Completaste la Unidad II y conocés tus derechos fundamentales.',
 (SELECT id FROM niveles_logro WHERE nombre = 'especial'),
 'ojo_alerta', NULL);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Protagonismo de Nicaragua',
 'Completaste el 9no grado y conocés el protagonismo de la mujer nicaragüense.',
 (SELECT id FROM niveles_logro WHERE nombre = 'especial'),
 'protagonismo_nicaragua', NULL);

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, valor_condicion) VALUES
('Seriamente',
 'Completaste las 4 unidades de tu grado. Un año académico dominado.',
 (SELECT id FROM niveles_logro WHERE nombre = 'especial'),
 'grado_completo', NULL);
