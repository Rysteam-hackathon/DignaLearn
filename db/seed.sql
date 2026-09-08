-- ============================================================
-- DignaLearn — db/seed.sql
-- Datos semilla para levantar un ambiente de desarrollo funcional.
-- Requiere que db/schema.sql (y sus INSERT de catálogos: roles,
-- tipos_actividad, niveles_logro, grados) ya se haya ejecutado antes.
--
-- Contenido de este archivo:
--   1. Institución + grupos de prueba (modelo multi-institución)
--   2. Currículo: unidades y temas de 7mo/9no (contenido_lectura es
--      PLACEHOLDER, pendiente de adaptación pedagógica real del MINED)
--   3. Un puñado de actividades de ejemplo (una por cada uno de los 7
--      tipos donde ya hay contenido real) — NO son los 34 temas
--      completos, alcanza para levantar el proyecto y probarlo.
--   4. Pistas genéricas por tipo de actividad (mascota guía)
--   5. Un par de logros de ejemplo
--
-- Docente y Admin de institución NO se crean acá porque requieren un
-- usuario real de Supabase Auth — ver la nota al final del archivo.
-- ============================================================


-- ============================================================
-- 1. INSTITUCIÓN Y GRUPOS DE PRUEBA
-- ============================================================

INSERT INTO instituciones (id, nombre, ciudad, codigo_institucion, activa) VALUES
    ('ecd9ef41-0bcd-434c-afc7-7df440c26291', 'Instituto Nacional de Prueba', 'Managua', 'INP-2026', TRUE);

INSERT INTO grupos (id, nombre, grado_id, institucion_id, anio_lectivo) VALUES
    ('9696ed2b-da7b-428c-b6e0-0d814103f59f', '7mo A',
     (SELECT id FROM grados WHERE numero_grado = 7 AND nivel = 'secundaria'),
     'ecd9ef41-0bcd-434c-afc7-7df440c26291', 2026),
    ('d3b92e8b-ccd3-4c11-be6a-f0eb04f0774e', '9no A',
     (SELECT id FROM grados WHERE numero_grado = 9 AND nivel = 'secundaria'),
     'ecd9ef41-0bcd-434c-afc7-7df440c26291', 2026);


-- ============================================================
-- 2. CURRÍCULO — UNIDADES Y TEMAS (7mo y 9no)
-- Fuente: docs/curriculum/secundaria/7mo.md y 9no.md
-- contenido_lectura es PLACEHOLDER, no contenido oficial del MINED.
-- ============================================================

-- --- Primer semestre ---

INSERT INTO unidades (grado_id, titulo, numero_unidad, semestre, activa) VALUES
    ((SELECT id FROM grados WHERE numero_grado = 7 AND nivel = 'secundaria'),
     'Dignidad y respeto para vivir en armonía', 1, 1, TRUE),
    ((SELECT id FROM grados WHERE numero_grado = 7 AND nivel = 'secundaria'),
     'Protejo mi vida con las leyes de mi país', 2, 1, TRUE);

INSERT INTO unidades (grado_id, titulo, numero_unidad, semestre, activa) VALUES
    ((SELECT id FROM grados WHERE numero_grado = 9 AND nivel = 'secundaria'),
     'Dignidad y respeto para vivir en armonía', 1, 1, TRUE),
    ((SELECT id FROM grados WHERE numero_grado = 9 AND nivel = 'secundaria'),
     'Protejo mi vida con las leyes de mi país', 2, 1, TRUE);

-- 7mo — Unidad 1
INSERT INTO temas (id, unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT v.id::uuid, u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('ba3006d1-0947-40c6-b585-66d98c7451da', 'Dignidad Humana y el respeto a la mujer nicaragüense',
     'Contenido pendiente de adaptación pedagógica — basado en Dignidad Humana y el respeto a la mujer nicaragüense', 1),
    ('a03874a1-1186-4a1d-a3b7-16c02b464aa9', 'Características de la dignidad de la mujer en el ámbito: social, cultural, político',
     'Contenido pendiente de adaptación pedagógica — basado en Características de la dignidad de la mujer en el ámbito: social, cultural, político', 2),
    ('48466322-965b-4255-9d3b-5ae33c53a731', 'Dignidad de la mujer en: Familia, Escuela, Comunidad',
     'Contenido pendiente de adaptación pedagógica — basado en Dignidad de la mujer en: Familia, Escuela, Comunidad', 3),
    ('bd1b91fa-bca3-468b-86e9-2f4255414783', 'Rol de la mujer indígena y afrodescendiente en el desarrollo de la sociedad con cultura de paz',
     'Contenido pendiente de adaptación pedagógica — basado en Rol de la mujer indígena y afrodescendiente en el desarrollo de la sociedad con cultura de paz', 4)
) AS v(id, titulo, contenido_lectura, orden)
WHERE g.numero_grado = 7 AND g.nivel = 'secundaria' AND u.numero_unidad = 1;

-- 7mo — Unidad 2
INSERT INTO temas (id, unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT v.id::uuid, u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('7f29a1c6-58fc-4c24-b21a-2c2e63a26b31', 'Leyes que cuidan y protegen la vida de las mujeres (Ley No. 1058, Artículo # 47, 49, 51, 75, 82)',
     'Contenido pendiente de adaptación pedagógica — basado en Leyes que cuidan y protegen la vida de las mujeres (Ley No. 1058)', 1),
    ('874f3b12-668a-4bce-a287-0b8ac2a4e8d7', 'Reforma del artículo 9 de la Ley núm. 779, "Ley Integral Contra la Violencia Hacia las Mujeres"',
     'Contenido pendiente de adaptación pedagógica — basado en la Reforma del artículo 9 de la Ley 779', 2),
    ('478cc9e2-d7f3-44de-9c3a-bc2f9f2869e7', 'Sistema de alertas tempranas para prevenir la violencia en la mujer: Señales de Violencia',
     'Muchas veces, la violencia no aparece de un día para otro: antes de que ocurra algo grave, suelen aparecer señales de alerta que, si las sabemos reconocer, nos pueden ayudar a actuar a tiempo. Algunas señales son: el control excesivo, los celos exagerados disfrazados de cariño, las humillaciones aunque sean en broma, el aislamiento y las amenazas.', 3),
    ('695d57ff-a0cc-4b61-839a-401d38a0623c', 'Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden',
     'Contenido pendiente de adaptación pedagógica — basado en Mecanismos de Denuncia', 4)
) AS v(id, titulo, contenido_lectura, orden)
WHERE g.numero_grado = 7 AND g.nivel = 'secundaria' AND u.numero_unidad = 2;

-- 9no — Unidad 1
INSERT INTO temas (id, unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT v.id::uuid, u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('414f2f74-8afa-4129-a9b1-944dd93b03fb', 'El papel de la mujer en la sociedad nicaragüense',
     'Contenido pendiente de adaptación pedagógica — basado en El papel de la mujer en la sociedad nicaragüense', 1),
    ('6160122b-4ae9-4164-aa90-256b834585c3', 'La mujer en los distintos ámbitos de la vida en sociedad',
     'La vida de una persona se desarrolla en distintos ámbitos: el familiar, el educativo, el laboral, el cultural, el político y el comunitario. Las mujeres nicaragüenses participan activamente en todos ellos, aunque históricamente su presencia no siempre fue reconocida de la misma forma en cada uno.', 2),
    ('a6aeda27-340b-4c67-9c3b-f8ab540d5191', 'Respeto a la dignidad de la mujer y su importancia para una sociedad más justa e igualitaria',
     'Contenido pendiente de adaptación pedagógica — basado en el respeto a la dignidad de la mujer', 3),
    ('637a120a-36e3-414d-9463-d3885d470eac', 'La importancia de la mujer indígena y afrodescendiente en la construcción de la sociedad con cultura de paz',
     'Contenido pendiente de adaptación pedagógica — basado en la mujer indígena y afrodescendiente', 4)
) AS v(id, titulo, contenido_lectura, orden)
WHERE g.numero_grado = 9 AND g.nivel = 'secundaria' AND u.numero_unidad = 1;

-- 9no — Unidad 2
INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Leyes que cuidan y protegen la vida de las mujeres (Ley No. 779)',
     'Contenido pendiente de adaptación pedagógica — basado en la Ley 779', 1),
    ('Ley 648, artículo #1, 2, 3, sus incisos',
     'Contenido pendiente de adaptación pedagógica — basado en la Ley 648', 2),
    ('Sistema de alertas tempranas para prevenir la violencia en la mujer nicaragüense: Señales de Violencia',
     'Contenido pendiente de adaptación pedagógica — basado en señales de alerta temprana', 3),
    ('Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden',
     'Contenido pendiente de adaptación pedagógica — basado en mecanismos de denuncia', 4)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 9 AND g.nivel = 'secundaria' AND u.numero_unidad = 2;

-- --- Segundo semestre (Unidades III y IV) ---

INSERT INTO unidades (grado_id, titulo, numero_unidad, semestre, activa) VALUES
    ((SELECT id FROM grados WHERE numero_grado = 7 AND nivel = 'secundaria'),
     'Relaciones de complementariedad', 3, 2, TRUE),
    ((SELECT id FROM grados WHERE numero_grado = 7 AND nivel = 'secundaria'),
     'Protagonismo y liderazgo en unidad', 4, 2, TRUE);

INSERT INTO unidades (grado_id, titulo, numero_unidad, semestre, activa) VALUES
    ((SELECT id FROM grados WHERE numero_grado = 9 AND nivel = 'secundaria'),
     'Relaciones de complementariedad', 3, 2, TRUE),
    ((SELECT id FROM grados WHERE numero_grado = 9 AND nivel = 'secundaria'),
     'Protagonismo y liderazgo en unidad', 4, 2, TRUE);

INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Relaciones complementarias: Importancia en el hogar', 'Contenido pendiente de adaptación pedagógica', 1),
    ('La igualdad de género en las relaciones de complementariedad: Familia, Escuela', 'Contenido pendiente de adaptación pedagógica', 2),
    ('Los roles de género en las relaciones de complementariedad: Familia, Escuela', 'Contenido pendiente de adaptación pedagógica', 3),
    ('Los estereotipos y su afectación en los roles de género: Familia, Escuela', 'Contenido pendiente de adaptación pedagógica', 4),
    ('Ley 648: de igualdad de derechos y oportunidades', 'Contenido pendiente de adaptación pedagógica', 5)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 7 AND g.nivel = 'secundaria' AND u.numero_unidad = 3;

INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Características del liderazgo femenino', 'Contenido pendiente de adaptación pedagógica', 1),
    ('El rol de la mujer como lideresa: Familia, Escuela, Comunidad', 'Contenido pendiente de adaptación pedagógica', 2),
    ('El protagonismo de la mujer nicaragüense en: Familia, Escuela, Comunidad', 'Contenido pendiente de adaptación pedagógica', 3),
    ('Mujeres destacadas: Familia, Escuela, Comunidad', 'Contenido pendiente de adaptación pedagógica', 4)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 7 AND g.nivel = 'secundaria' AND u.numero_unidad = 4;

INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Las relaciones de complementariedad: Derecho a vivir en equidad y solidaridad', 'Contenido pendiente de adaptación pedagógica', 1),
    ('Los procesos de cambio en las relaciones de complementariedad', 'Contenido pendiente de adaptación pedagógica', 2),
    ('La influencia del medio social en las relaciones de complementariedad', 'Contenido pendiente de adaptación pedagógica', 3),
    ('La importancia de las relaciones de complementariedad', 'Contenido pendiente de adaptación pedagógica', 4),
    ('Ley 648: de igualdad de derechos y oportunidades (ámbito social)', 'Contenido pendiente de adaptación pedagógica', 5)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 9 AND g.nivel = 'secundaria' AND u.numero_unidad = 3;

INSERT INTO temas (unidad_id, titulo, contenido_lectura, orden, minutos_estimados)
SELECT u.id, v.titulo, v.contenido_lectura, v.orden, 20
FROM unidades u
JOIN grados g ON g.id = u.grado_id
CROSS JOIN (VALUES
    ('Protagonismo de la mujer en la historia de Nicaragua', 'Contenido pendiente de adaptación pedagógica', 1),
    ('Derechos e Igualdad de oportunidades en el área laboral', 'Contenido pendiente de adaptación pedagógica', 2),
    ('La actitud de la mujer frente al trabajo: Erradicación de la pobreza', 'Contenido pendiente de adaptación pedagógica', 3),
    ('Mujeres que han hecho historia en Nicaragua', 'Contenido pendiente de adaptación pedagógica', 4)
) AS v(titulo, contenido_lectura, orden)
WHERE g.numero_grado = 9 AND g.nivel = 'secundaria' AND u.numero_unidad = 4;


-- ============================================================
-- 3. ACTIVIDADES DE EJEMPLO — una por tipo, sobre temas reales
-- (NO son los 34 temas completos — alcanza para probar cada tipo)
-- ============================================================

-- sopa_letras — tema "Dignidad Humana..." (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json) VALUES
('ba3006d1-0947-40c6-b585-66d98c7451da', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{"palabras": ["DIGNIDAD", "RESPETO", "IGUALDAD", "VALORES"],
  "pistas": ["Valor inherente de toda persona", "Tratar bien a los demás", "Mismos derechos para todas", "Principios que guían la conducta"],
  "tamaño": 10}'::jsonb);

-- quiz — mismo tema
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json) VALUES
('ba3006d1-0947-40c6-b585-66d98c7451da', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{"pregunta": "¿Qué es la dignidad humana?",
  "opciones": [{"id":"a","texto":"Un premio que se gana"}, {"id":"b","texto":"El valor inherente de toda persona por el simple hecho de serlo"}, {"id":"c","texto":"Algo que depende del dinero que tenga alguien"}],
  "respuesta_correcta": "b",
  "retroalimentacion": "La dignidad es inherente a toda persona, nadie puede quitártela ni tenés que ganártela."}'::jsonb);

-- scenario (Reflexión) — tema "Alertas tempranas" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json) VALUES
('478cc9e2-d7f3-44de-9c3a-bc2f9f2869e7', (SELECT id FROM tipos_actividad WHERE nombre = 'scenario'), 1,
'{"pregunta": "Tu pareja revisa tu celular todos los días sin tu permiso. ¿Esto es una señal de alerta?",
  "opciones": [{"id":"a","texto":"Sí, es control excesivo"}, {"id":"b","texto":"No, es normal en una pareja"}, {"id":"c","texto":"Solo si lo hace en público"}],
  "respuesta_correcta": "a",
  "dato_extra": "En Nicaragua, la Ley 779 reconoce el control como una forma de violencia psicológica."}'::jsonb);

-- conectores — tema "Ley 1058" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json) VALUES
('7f29a1c6-58fc-4c24-b21a-2c2e63a26b31', (SELECT id FROM tipos_actividad WHERE nombre = 'conectores'), 1,
'{"pares": [
    {"concepto": "Ley No. 1058", "definicion": "Ley nicaragüense que establece disposiciones para cuidar y proteger la vida de las mujeres."},
    {"concepto": "Derecho a la vida", "definicion": "El derecho más básico que estas leyes buscan garantizar."},
    {"concepto": "Vivir libre de violencia", "definicion": "Derecho que garantiza que ninguna mujer debe sufrir maltrato."},
    {"concepto": "Responsabilidad del Estado", "definicion": "El compromiso de las instituciones de actuar para defender a una mujer en riesgo."}
]}'::jsonb);

-- clasificacion — tema "Alertas tempranas" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json) VALUES
('478cc9e2-d7f3-44de-9c3a-bc2f9f2869e7', (SELECT id FROM tipos_actividad WHERE nombre = 'clasificacion'), 1,
'{"situaciones": [
    {"texto": "Tu pareja revisa tu celular todos los días sin tu permiso.", "es_correcto": false, "explicacion": "El control excesivo es una señal de alerta de violencia."},
    {"texto": "Tus amigos respetan cuando les decís que no podés salir.", "es_correcto": true, "explicacion": "Respetar los límites del otro es parte de una relación sana."}
]}'::jsonb);

-- rompecabezas — tema "La mujer en los distintos ámbitos" (9no)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json) VALUES
('6160122b-4ae9-4164-aa90-256b834585c3', (SELECT id FROM tipos_actividad WHERE nombre = 'rompecabezas'), 1,
'{"imagen_url": "/rompecabezas/ambitos-sociedad.svg", "filas": 2, "columnas": 3}'::jsonb);

-- drag_drop: pendiente — 0 filas de ejemplo todavía (tipo declarado en el
-- catálogo pero sin implementación de componente ni contenido — ver
-- "Rompecabezas" en el PRD/pendientes, era el otro candidato de esa etapa.)


-- ============================================================
-- 4. PISTAS GENÉRICAS POR TIPO DE ACTIVIDAD (mascota guía)
-- ============================================================

INSERT INTO pistas_por_tipo_actividad (tipo_actividad_id, texto_pista) VALUES
    ((SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'),
     'Fijate en las pistas de al lado: cada una describe una palabra oculta en la grilla, sin decírtela directamente.'),
    ((SELECT id FROM tipos_actividad WHERE nombre = 'quiz'),
     'Volvé a leer el texto de la lectura antes de responder — la respuesta correcta suele estar explicada ahí con otras palabras.'),
    ((SELECT id FROM tipos_actividad WHERE nombre = 'conectores'),
     'Elegí primero el concepto que más seguro tengas, y fijate cuál definición usa palabras parecidas a las del texto de lectura.'),
    ((SELECT id FROM tipos_actividad WHERE nombre = 'clasificacion'),
     'Pensá si la situación describe control, humillación o aislamiento — esas son señales de que algo no está bien.'),
    ((SELECT id FROM tipos_actividad WHERE nombre = 'rompecabezas'),
     'Mirá la miniatura de arriba con atención: fijate en los colores y formas de cada esquina antes de mover las piezas.');


-- ============================================================
-- 5. LOGROS DE EJEMPLO
-- ============================================================

INSERT INTO logros (titulo, descripcion, nivel_logro_id, tipo_condicion, tema_id) VALUES
    ('El Primer Paso', '¡Completaste tu primer tema!', (SELECT id FROM niveles_logro WHERE nombre = 'especial'), 'primer_tema', NULL),
    ('Con Dignidad', 'Aprendiste sobre la dignidad humana y el respeto a la mujer nicaragüense.',
     (SELECT id FROM niveles_logro WHERE nombre = 'tema'), 'tema_completado', 'ba3006d1-0947-40c6-b585-66d98c7451da');

-- Para escalar a los 34 logros de tema únicos (uno por cada tema real),
-- ver el patrón de estos 2 e insertar el resto con tema_id apuntando a
-- cada tema — no incluidos acá completos para no inflar este archivo.


-- ============================================================
-- NOTA — Docente y Admin de Institución de prueba
-- ============================================================
-- No se pueden crear con INSERT plano porque requieren un usuario real
-- de Supabase Auth. Con el service-role key, corré algo como esto en un
-- script de Python (ver README.md):
--
--   sb.auth.admin.create_user({"email": "...", "password": "...", "email_confirm": True})
--   → tomar el id devuelto y usarlo como usuario_id en:
--   INSERT INTO usuarios (id, email, nombre_display, rol_id) VALUES (...);
--   INSERT INTO perfiles_docente (usuario_id, institucion_id) VALUES (...);
--     -- o perfiles_admin_institucion (usuario_id, institucion_id, nombre_completo)
--   INSERT INTO docente_grupos (docente_id, grupo_id) VALUES (...); -- si es docente
--
-- El estudiante de prueba (DL-TEST / PIN 1234) sí se puede insertar con
-- SQL plano porque usa PIN propio, no Supabase Auth — bcrypt.hashpw del
-- PIN "1234" antes de insertarlo en perfiles_estudiante.pin_hash.
