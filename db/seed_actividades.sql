-- ============================================================
-- DignaLearn — db/seed_actividades.sql
-- Datos semilla de actividades (banco de variantes)
-- Ejecutar en el SQL Editor de Supabase después de db/schema.sql
-- y db/seed.sql (requiere que exista el tema correspondiente).
-- ============================================================

-- Sopa de letras — 7mo grado, Unidad I, Tema 1
-- (Tema 1 = orden 1: "Dignidad Humana y el respeto a la mujer nicaragüense")
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion)
SELECT
    t.id,
    (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'),
    1,
    '{
        "palabras": ["MUJER", "DIGNIDAD", "EDUCACION", "LIBERTAD", "RESPETO"],
        "pistas": [
            "Persona del género femenino",
            "Valor que merece todo ser humano",
            "Proceso de aprendizaje formal",
            "Derecho a actuar sin restricciones injustas",
            "Tratar a otros con consideración"
        ],
        "tamaño": 10
    }'::jsonb,
    10,
    60
FROM temas t
JOIN unidades u ON u.id = t.unidad_id
JOIN grados g ON g.id = u.grado_id
WHERE g.numero_grado = 7 AND g.nivel = 'secundaria'
  AND u.numero_unidad = 1
  AND t.orden = 1;
