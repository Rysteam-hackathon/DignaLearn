-- ============================================================
-- DignaLearn — db/seed.sql
-- Datos semilla de currículo: Unidades y Temas para 7mo y 9no grado
-- Asignatura: Derechos y Dignidad de las Mujeres — Primer Semestre 2023
-- Fuente: docs/curriculum/secundaria/7mo.md y docs/curriculum/secundaria/9no.md
-- NOTA: contenido_lectura es un texto PLACEHOLDER — no es contenido real
-- del MINED, pendiente de adaptación pedagógica.
-- Requiere que db/schema.sql (con la semilla de `grados`) ya se haya
-- ejecutado antes que este script.
-- ============================================================


-- ============================================================
-- UNIDADES
-- ============================================================

-- 7mo grado
INSERT INTO unidades (grado_id, titulo, numero_unidad, semestre, activa) VALUES
    ((SELECT id FROM grados WHERE numero_grado = 7 AND nivel = 'secundaria'),
     'Dignidad y respeto para vivir en armonía', 1, 1, TRUE),
    ((SELECT id FROM grados WHERE numero_grado = 7 AND nivel = 'secundaria'),
     'Protejo mi vida con las leyes de mi país', 2, 1, TRUE);

-- 9no grado
INSERT INTO unidades (grado_id, titulo, numero_unidad, semestre, activa) VALUES
    ((SELECT id FROM grados WHERE numero_grado = 9 AND nivel = 'secundaria'),
     'Dignidad y respeto para vivir en armonía', 1, 1, TRUE),
    ((SELECT id FROM grados WHERE numero_grado = 9 AND nivel = 'secundaria'),
     'Protejo mi vida con las leyes de mi país', 2, 1, TRUE);


-- ============================================================
-- TEMAS
-- ============================================================

-- 7mo grado — Unidad 1: Dignidad y respeto para vivir en armonía
INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Dignidad Humana y el respeto a la mujer nicaragüense',
     'Contenido pendiente de adaptación pedagógica — basado en Dignidad Humana y el respeto a la mujer nicaragüense', 1),
    ('Características de la dignidad de la mujer en el ámbito: social, cultural, político',
     'Contenido pendiente de adaptación pedagógica — basado en Características de la dignidad de la mujer en el ámbito: social, cultural, político', 2),
    ('Dignidad de la mujer en: Familia, Escuela, Comunidad',
     'Contenido pendiente de adaptación pedagógica — basado en Dignidad de la mujer en: Familia, Escuela, Comunidad', 3),
    ('Rol de la mujer indígena y afrodescendiente en el desarrollo de la sociedad con cultura de paz',
     'Contenido pendiente de adaptación pedagógica — basado en Rol de la mujer indígena y afrodescendiente en el desarrollo de la sociedad con cultura de paz', 4)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 7 AND g.nivel = 'secundaria' AND u.numero_unidad = 1;

-- 7mo grado — Unidad 2: Protejo mi vida con las leyes de mi país
INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Leyes que cuidan y protegen la vida de las mujeres (Ley No. 1058, Artículo # 47, 49, 51, 75, 82)',
     'Contenido pendiente de adaptación pedagógica — basado en Leyes que cuidan y protegen la vida de las mujeres (Ley No. 1058, Artículo # 47, 49, 51, 75, 82)', 1),
    ('Reforma del artículo 9 de la Ley núm. 779, "Ley Integral Contra la Violencia Hacia las Mujeres" (incisos a, b, c, d, e, f, g, h)',
     'Contenido pendiente de adaptación pedagógica — basado en Reforma del artículo 9 de la Ley núm. 779, "Ley Integral Contra la Violencia Hacia las Mujeres" (incisos a, b, c, d, e, f, g, h)', 2),
    ('Sistema de alertas tempranas para prevenir la violencia en la mujer: Señales de Violencia',
     'Contenido pendiente de adaptación pedagógica — basado en Sistema de alertas tempranas para prevenir la violencia en la mujer: Señales de Violencia', 3),
    ('Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden',
     'Contenido pendiente de adaptación pedagógica — basado en Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden', 4)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 7 AND g.nivel = 'secundaria' AND u.numero_unidad = 2;

-- 9no grado — Unidad 1: Dignidad y respeto para vivir en armonía
INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('El papel de la mujer en la sociedad nicaragüense',
     'Contenido pendiente de adaptación pedagógica — basado en El papel de la mujer en la sociedad nicaragüense', 1),
    ('La mujer en los distintos ámbitos de la vida en sociedad',
     'Contenido pendiente de adaptación pedagógica — basado en La mujer en los distintos ámbitos de la vida en sociedad', 2),
    ('Respeto a la dignidad de la mujer y su importancia para una sociedad más justa e igualitaria',
     'Contenido pendiente de adaptación pedagógica — basado en Respeto a la dignidad de la mujer y su importancia para una sociedad más justa e igualitaria', 3),
    ('La importancia de la mujer indígena y afrodescendiente en la construcción de la sociedad con cultura de paz',
     'Contenido pendiente de adaptación pedagógica — basado en La importancia de la mujer indígena y afrodescendiente en la construcción de la sociedad con cultura de paz', 4)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 9 AND g.nivel = 'secundaria' AND u.numero_unidad = 1;

-- 9no grado — Unidad 2: Protejo mi vida con las leyes de mi país
INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Leyes que cuidan y protegen la vida de las mujeres (Ley No. 779, artículos #1, 2, 3 incisos a, b, c, d, e; 4 inciso d, h, i, k, l, m)',
     'Contenido pendiente de adaptación pedagógica — basado en Leyes que cuidan y protegen la vida de las mujeres (Ley No. 779, artículos #1, 2, 3 incisos a, b, c, d, e; 4 inciso d, h, i, k, l, m)', 1),
    ('Ley 648, artículo #1, 2, 3, sus incisos (a, b, c, f, h) - 6 (inciso #1)',
     'Contenido pendiente de adaptación pedagógica — basado en Ley 648, artículo #1, 2, 3, sus incisos (a, b, c, f, h) - 6 (inciso #1)', 2),
    ('Sistema de alertas tempranas para prevenir la violencia en la mujer nicaragüense: Señales de Violencia',
     'Contenido pendiente de adaptación pedagógica — basado en Sistema de alertas tempranas para prevenir la violencia en la mujer nicaragüense: Señales de Violencia', 3),
    ('Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden',
     'Contenido pendiente de adaptación pedagógica — basado en Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden', 4)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 9 AND g.nivel = 'secundaria' AND u.numero_unidad = 2;
