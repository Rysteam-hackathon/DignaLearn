-- ============================================================
-- DignaLearn — db/seed_actividades_completo.sql
-- Actividades (sopa de letras + quiz) para los 33 temas que no
-- tenían contenido. 1 sopa de letras + 3 preguntas de quiz
-- (grupo_variante 1, 2, 3) por tema, basadas en los títulos del
-- currículo real (docs/curriculum/secundaria/7mo.md y 9no.md).
-- tema_id usa los UUID reales obtenidos de la base de datos.
-- Ejecutar en el SQL Editor de Supabase.
-- ============================================================


-- ============================================================
-- 7mo GRADO — UNIDAD I: Dignidad y respeto para vivir en armonía
-- ============================================================

-- Tema: "Características de la dignidad de la mujer en el ámbito: social, cultural, político"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a03874a1-1186-4a1d-a3b7-16c02b464aa9', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["DIGNIDAD", "SOCIAL", "CULTURAL", "POLITICO", "RESPETO", "IGUALDAD", "VALORES"],
    "pistas": [
        "Valor inherente que merece todo ser humano",
        "Ámbito relacionado con la vida en comunidad",
        "Ámbito relacionado con las tradiciones y el arte",
        "Ámbito relacionado con la toma de decisiones públicas",
        "Trato considerado hacia los demás",
        "Condición de tener los mismos derechos",
        "Principios que guían el comportamiento de una persona"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a03874a1-1186-4a1d-a3b7-16c02b464aa9', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿En qué ámbitos se manifiesta la dignidad de la mujer, según lo estudiado en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Social, cultural y político"},
        {"id": "b", "texto": "Solo en el ámbito familiar"},
        {"id": "c", "texto": "Únicamente en el trabajo"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La dignidad de la mujer se manifiesta en múltiples ámbitos de la vida social, no solo en uno."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a03874a1-1186-4a1d-a3b7-16c02b464aa9', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "En tu comunidad, una mujer es electa como líder de un proyecto cultural del barrio. ¿Qué ámbito de la dignidad de la mujer se está reflejando?",
    "opciones": [
        {"id": "a", "texto": "Ninguno, las mujeres no participan en la cultura"},
        {"id": "b", "texto": "Ámbito cultural"},
        {"id": "c", "texto": "Ámbito deportivo"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Cuando una mujer lidera proyectos culturales, está ejerciendo su dignidad en el ámbito cultural de la comunidad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a03874a1-1186-4a1d-a3b7-16c02b464aa9', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "¿Por qué es importante reconocer la dignidad de la mujer en el ámbito político?",
    "opciones": [
        {"id": "a", "texto": "Porque solo los hombres deben tomar decisiones políticas"},
        {"id": "b", "texto": "Porque la política no tiene relación con la dignidad"},
        {"id": "c", "texto": "Porque le permite participar en la toma de decisiones que afectan a su comunidad y país"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "La participación política de la mujer es clave para que sus necesidades y derechos sean tomados en cuenta en las decisiones colectivas."
}'::jsonb, 10, 60);


-- Tema: "Dignidad de la mujer en: Familia, Escuela, Comunidad"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('48466322-965b-4255-9d3b-5ae33c53a731', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["FAMILIA", "ESCUELA", "COMUNIDAD", "DIGNIDAD", "RESPETO", "ARMONIA"],
    "pistas": [
        "Primer espacio donde se aprende a convivir con respeto",
        "Lugar donde se forma el conocimiento y los valores",
        "Grupo de personas que comparten un mismo entorno",
        "Valor que merece toda persona sin distinción",
        "Actitud de consideración hacia las demás personas",
        "Estado de equilibrio y buena convivencia"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('48466322-965b-4255-9d3b-5ae33c53a731', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿En cuáles espacios se debe practicar el respeto a la dignidad de la mujer, según esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Familia, escuela y comunidad"},
        {"id": "b", "texto": "Solo en la escuela"},
        {"id": "c", "texto": "Solo en la familia"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El respeto a la dignidad de la mujer debe practicarse en todos los espacios donde se desenvuelve: familia, escuela y comunidad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('48466322-965b-4255-9d3b-5ae33c53a731', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "Un estudiante interrumpe constantemente a sus compañeras cuando participan en clase. ¿Qué actitud demuestra?",
    "opciones": [
        {"id": "a", "texto": "Liderazgo positivo"},
        {"id": "b", "texto": "Falta de respeto a la dignidad de sus compañeras"},
        {"id": "c", "texto": "Cortesía"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Interrumpir constantemente a las compañeras impide que sus ideas sean escuchadas y valoradas, lo cual afecta su dignidad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('48466322-965b-4255-9d3b-5ae33c53a731', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "¿Cómo puede un estudiante promover la dignidad de la mujer en su comunidad?",
    "opciones": [
        {"id": "a", "texto": "Ignorando las opiniones de las mujeres en las reuniones comunitarias"},
        {"id": "b", "texto": "Solo escuchando a los hombres mayores"},
        {"id": "c", "texto": "Participando en actividades que valoren el aporte de las mujeres y respetando sus opiniones"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Valorar el aporte y las opiniones de las mujeres en distintos espacios fortalece el respeto a su dignidad."
}'::jsonb, 10, 60);


-- Tema: "Rol de la mujer indígena y afrodescendiente en el desarrollo de la sociedad con cultura de paz"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bd1b91fa-bca3-468b-86e9-2f4255414783', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["INDIGENA", "CULTURA", "TRADICION", "DESARROLLO", "PAZ", "RAICES", "IDENTIDAD"],
    "pistas": [
        "Perteneciente a los pueblos originarios",
        "Conjunto de costumbres y saberes de un pueblo",
        "Costumbre que se transmite de generación en generación",
        "Proceso de crecimiento y progreso de una sociedad",
        "Estado de convivencia sin violencia ni conflictos",
        "Origen cultural e histórico de una persona o pueblo",
        "Conjunto de características que definen a una persona o pueblo"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bd1b91fa-bca3-468b-86e9-2f4255414783', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué papel han tenido las mujeres indígenas y afrodescendientes en el desarrollo de nuestra sociedad?",
    "opciones": [
        {"id": "a", "texto": "Han aportado a la preservación de la cultura y a la construcción de la paz"},
        {"id": "b", "texto": "No han tenido ningún aporte"},
        {"id": "c", "texto": "Solo han participado en labores domésticas"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Las mujeres indígenas y afrodescendientes han aportado históricamente a preservar la cultura y construir la paz en sus comunidades."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bd1b91fa-bca3-468b-86e9-2f4255414783', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué significa \"cultura de paz\" en el contexto de esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Un tipo de música tradicional"},
        {"id": "b", "texto": "Una forma de convivencia basada en el respeto, el diálogo y la resolución pacífica de conflictos"},
        {"id": "c", "texto": "La ausencia total de diferencias entre las personas"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "La cultura de paz se basa en el respeto, el diálogo y la resolución no violenta de los conflictos."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bd1b91fa-bca3-468b-86e9-2f4255414783', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En tu comunidad hay una anciana indígena que enseña tejidos tradicionales a los jóvenes. ¿Qué está aportando ella a la sociedad?",
    "opciones": [
        {"id": "a", "texto": "Nada relevante para la comunidad"},
        {"id": "b", "texto": "Solo una actividad de entretenimiento"},
        {"id": "c", "texto": "Preservación cultural y transmisión de saberes ancestrales"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Enseñar tradiciones ancestrales a las nuevas generaciones es una forma valiosa de preservar la identidad cultural."
}'::jsonb, 10, 60);


-- ============================================================
-- 7mo GRADO — UNIDAD 2: Protejo mi vida con las leyes de mi país
-- ============================================================

-- Tema: "Leyes que cuidan y protegen la vida de las mujeres (Ley No. 1058, Artículo # 47, 49, 51, 75, 82)"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('7f29a1c6-58fc-4c24-b21a-2c2e63a26b31', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["PROTECCION", "DERECHOS", "MUJERES", "VIDA", "ARTICULO", "NORMATIVA", "SEGURIDAD"],
    "pistas": [
        "Acción de cuidar y defender a alguien de un peligro",
        "Facultades que la ley reconoce a las personas",
        "Sujetas de los derechos protegidos en esta ley",
        "Bien más importante que protege esta ley",
        "Parte específica de una ley que regula un tema",
        "Conjunto de normas o leyes sobre un tema",
        "Condición de estar libre de peligro o riesgo"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('7f29a1c6-58fc-4c24-b21a-2c2e63a26b31', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué busca proteger la Ley No. 1058 según los artículos estudiados en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "La vida y la integridad de las mujeres"},
        {"id": "b", "texto": "Solo los bienes materiales"},
        {"id": "c", "texto": "Los horarios escolares"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La Ley No. 1058 establece disposiciones específicas para proteger la vida e integridad de las mujeres."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('7f29a1c6-58fc-4c24-b21a-2c2e63a26b31', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante que existan leyes específicas para proteger la vida de las mujeres?",
    "opciones": [
        {"id": "a", "texto": "Porque las mujeres no pueden protegerse solas en ningún caso"},
        {"id": "b", "texto": "Porque responden a situaciones de riesgo que afectan particularmente a las mujeres"},
        {"id": "c", "texto": "Porque las leyes generales ya no aplican a nadie"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Las leyes específicas responden a riesgos particulares que enfrentan las mujeres, garantizando una protección más efectiva."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('7f29a1c6-58fc-4c24-b21a-2c2e63a26b31', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una compañera de tu escuela te cuenta que en su casa la maltratan. ¿Qué deberías recomendarle según lo aprendido sobre las leyes de protección?",
    "opciones": [
        {"id": "a", "texto": "Que no diga nada porque no hay leyes que la ayuden"},
        {"id": "b", "texto": "Que resuelva el problema sola sin contárselo a nadie"},
        {"id": "c", "texto": "Que busque ayuda de un adulto de confianza o una institución que la proteja"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Existen leyes e instituciones que amparan a quienes sufren maltrato; buscar ayuda de un adulto de confianza es el primer paso."
}'::jsonb, 10, 60);


-- Tema: "Reforma del artículo 9 de la Ley núm. 779, \"Ley Integral Contra la Violencia Hacia las Mujeres\" (incisos a, b, c, d, e, f, g, h)"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('874f3b12-668a-4bce-a287-0b8ac2a4e8d7', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["VIOLENCIA", "INTEGRAL", "REFORMA", "ARTICULO", "PREVENCION", "PROTECCION", "INCISOS"],
    "pistas": [
        "Acción que causa daño físico, psicológico o sexual",
        "Que abarca todos los aspectos de un problema",
        "Cambio o modificación realizada a una ley",
        "Sección de una ley que regula un tema específico",
        "Acción de evitar que ocurra un daño",
        "Acción de resguardar a alguien de un peligro",
        "Subdivisiones dentro de un artículo de ley"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('874f3b12-668a-4bce-a287-0b8ac2a4e8d7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cómo se llama la ley que busca prevenir y sancionar la violencia hacia las mujeres, estudiada en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Ley Integral Contra la Violencia Hacia las Mujeres (Ley 779)"},
        {"id": "b", "texto": "Ley del Tránsito"},
        {"id": "c", "texto": "Ley de Educación"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La Ley 779, Ley Integral Contra la Violencia Hacia las Mujeres, busca prevenir, sancionar y erradicar todo tipo de violencia hacia las mujeres."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('874f3b12-668a-4bce-a287-0b8ac2a4e8d7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué significa que una ley sea \"integral\" en el contexto de la Ley 779?",
    "opciones": [
        {"id": "a", "texto": "Que solo aplica los fines de semana"},
        {"id": "b", "texto": "Que únicamente sanciona con multas económicas"},
        {"id": "c", "texto": "Que aborda distintos tipos de violencia y aspectos de prevención, atención y sanción"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Una ley integral aborda de forma completa la prevención, atención, sanción y erradicación de la violencia."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('874f3b12-668a-4bce-a287-0b8ac2a4e8d7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Un grupo de estudiantes se burla constantemente de una compañera por su forma de vestir. ¿Qué tipo de actitud representa esto frente a lo que promueve la Ley 779?",
    "opciones": [
        {"id": "a", "texto": "Una broma sin importancia"},
        {"id": "b", "texto": "Un comportamiento que la ley permite"},
        {"id": "c", "texto": "Una forma de violencia que la ley busca prevenir"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Burlarse de una persona por su apariencia es una forma de violencia que las leyes de protección buscan prevenir."
}'::jsonb, 10, 60);


-- Tema: "Sistema de alertas tempranas para prevenir la violencia en la mujer: Señales de Violencia"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('478cc9e2-d7f3-44de-9c3a-bc2f9f2869e7', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["ALERTA", "SEÑALES", "PREVENCION", "VIOLENCIA", "CONTROL", "CELOS", "AMENAZA"],
    "pistas": [
        "Aviso que indica un posible peligro",
        "Indicios que permiten identificar una situación de riesgo",
        "Acción de anticiparse para evitar un daño",
        "Acción que causa daño a otra persona",
        "Dominio excesivo sobre las decisiones de otra persona",
        "Sentimiento de posesión o desconfianza excesiva",
        "Advertencia de causar un daño a alguien"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('478cc9e2-d7f3-44de-9c3a-bc2f9f2869e7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Para qué sirve el sistema de alertas tempranas estudiado en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Para identificar señales de violencia antes de que se agraven y poder prevenirla"},
        {"id": "b", "texto": "Para vigilar a las mujeres en su vida diaria"},
        {"id": "c", "texto": "Para castigar a las víctimas de violencia"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El sistema de alertas tempranas ayuda a identificar señales de violencia a tiempo para poder actuar antes de que la situación se agrave."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('478cc9e2-d7f3-44de-9c3a-bc2f9f2869e7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Cuál de las siguientes es una señal de alerta temprana de violencia en una relación?",
    "opciones": [
        {"id": "a", "texto": "Compartir tiempo libre juntos de forma sana"},
        {"id": "b", "texto": "Control excesivo, celos extremos y aislamiento de amistades y familiares"},
        {"id": "c", "texto": "Respetar las opiniones de la otra persona"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "El control excesivo, los celos extremos y el aislamiento son señales claras de alerta en una relación."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('478cc9e2-d7f3-44de-9c3a-bc2f9f2869e7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una amiga te cuenta que su pareja le prohíbe hablar con sus amigas y revisa su celular constantemente. ¿Qué deberías hacer según lo aprendido?",
    "opciones": [
        {"id": "a", "texto": "Decirle que eso es normal en una relación"},
        {"id": "b", "texto": "No decir nada porque no es tu problema"},
        {"id": "c", "texto": "Ayudarla a reconocer estas señales de alerta y motivarla a buscar apoyo"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Reconocer estas señales en una amiga y motivarla a buscar apoyo puede ayudar a prevenir una situación de violencia."
}'::jsonb, 10, 60);


-- Tema: "Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('695d57ff-a0cc-4b61-839a-401d38a0623c', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["DENUNCIA", "PRESENCIAL", "TELEFONO", "LINEA", "GRATUITA", "ATENCION", "AYUDA"],
    "pistas": [
        "Acción de informar a una autoridad sobre un hecho",
        "Que se realiza en persona, cara a cara",
        "Aparato usado para comunicarse a distancia",
        "Canal telefónico habilitado para recibir denuncias",
        "Que no tiene ningún costo económico",
        "Servicio que brinda apoyo a quien lo necesita",
        "Apoyo brindado a una persona en dificultad"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('695d57ff-a0cc-4b61-839a-401d38a0623c', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cuáles son las formas de denuncia estudiadas en esta unidad para casos de violencia hacia las mujeres?",
    "opciones": [
        {"id": "a", "texto": "Presencial, en línea y telefónica (líneas gratuitas)"},
        {"id": "b", "texto": "Solo por carta"},
        {"id": "c", "texto": "Únicamente a través de redes sociales"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Existen distintas vías para denunciar: de forma presencial, en línea o por teléfono a través de líneas gratuitas."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('695d57ff-a0cc-4b61-839a-401d38a0623c', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante que existan líneas telefónicas gratuitas para denunciar la violencia?",
    "opciones": [
        {"id": "a", "texto": "Porque son la única forma de denuncia que existe"},
        {"id": "b", "texto": "Porque reemplazan a la policía"},
        {"id": "c", "texto": "Porque permiten pedir ayuda de forma rápida y sin costo económico"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Las líneas gratuitas eliminan la barrera económica y permiten pedir ayuda de forma inmediata."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('695d57ff-a0cc-4b61-839a-401d38a0623c', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Presencias una situación de violencia hacia una mujer en tu barrio y no sabes qué institución puede ayudar. ¿Qué deberías hacer según lo aprendido?",
    "opciones": [
        {"id": "a", "texto": "No hacer nada porque no es tu responsabilidad"},
        {"id": "b", "texto": "Resolver el problema tú mismo por la fuerza"},
        {"id": "c", "texto": "Buscar información sobre las instituciones que atienden estos casos y orientar a la persona afectada"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Conocer qué instituciones atienden estos casos permite orientar mejor a quien necesita ayuda."
}'::jsonb, 10, 60);


-- ============================================================
-- 7mo GRADO — UNIDAD III: Relaciones de complementariedad
-- ============================================================

-- Tema: "Relaciones complementarias: Importancia en el hogar"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('b081741f-67ce-4bef-9242-3f68a109c14a', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["HOGAR", "FAMILIA", "APOYO", "TAREAS", "EQUIDAD", "ARMONIA", "RESPETO"],
    "pistas": [
        "Lugar donde vive una familia",
        "Grupo de personas unidas por parentesco",
        "Ayuda que se brinda a otra persona",
        "Actividades o responsabilidades del hogar",
        "Distribución justa de responsabilidades",
        "Buena relación y equilibrio entre personas",
        "Consideración hacia los demás"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('b081741f-67ce-4bef-9242-3f68a109c14a', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué significa que las relaciones en el hogar sean complementarias?",
    "opciones": [
        {"id": "a", "texto": "Que todos los miembros de la familia colaboran y se apoyan mutuamente, sin importar el género"},
        {"id": "b", "texto": "Que solo las mujeres deben encargarse de las tareas del hogar"},
        {"id": "c", "texto": "Que cada persona debe estar sola sin ayudar a nadie"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La complementariedad en el hogar implica que todos los miembros de la familia colaboren, sin que las tareas dependan del género."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('b081741f-67ce-4bef-9242-3f68a109c14a', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante la complementariedad en las tareas del hogar?",
    "opciones": [
        {"id": "a", "texto": "Porque hace que las tareas sean más lentas"},
        {"id": "b", "texto": "Porque fortalece la convivencia familiar y distribuye las responsabilidades de forma justa"},
        {"id": "c", "texto": "Porque no tiene ningún beneficio para la familia"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Distribuir las tareas del hogar de forma equitativa fortalece la convivencia y el bienestar familiar."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('b081741f-67ce-4bef-9242-3f68a109c14a', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En una familia, el padre cocina mientras la madre repara un enchufe y los hijos ordenan la casa juntos. ¿Qué está reflejando esta situación?",
    "opciones": [
        {"id": "a", "texto": "Una familia desorganizada"},
        {"id": "b", "texto": "Una situación poco común que no debería repetirse"},
        {"id": "c", "texto": "Relaciones complementarias basadas en la cooperación y la equidad"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Cuando todos los miembros de la familia colaboran según sus posibilidades, se practican relaciones complementarias basadas en la equidad."
}'::jsonb, 10, 60);


-- Tema: "La igualdad de género en las relaciones de complementariedad: Familia, Escuela" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('5ebd33df-f6e5-4b87-b4d3-3e8e4877f6ba', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["IGUALDAD", "GENERO", "FAMILIA", "ESCUELA", "EQUIDAD", "DERECHOS", "RESPETO"],
    "pistas": [
        "Mismos derechos y oportunidades para todas las personas",
        "Conjunto de roles y características asignadas socialmente",
        "Primer espacio de convivencia y aprendizaje",
        "Espacio donde se forman valores y conocimientos",
        "Justicia en el trato según las necesidades de cada persona",
        "Facultades reconocidas a todas las personas",
        "Trato considerado hacia las demás personas"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('5ebd33df-f6e5-4b87-b4d3-3e8e4877f6ba', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué es la igualdad de género en el contexto de la familia y la escuela?",
    "opciones": [
        {"id": "a", "texto": "Que hombres y mujeres tengan los mismos derechos y oportunidades para participar y desarrollarse"},
        {"id": "b", "texto": "Que solo las mujeres tengan más derechos que los hombres"},
        {"id": "c", "texto": "Que no existan diferencias biológicas entre las personas"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La igualdad de género implica que hombres y mujeres tengan los mismos derechos y oportunidades para participar y desarrollarse."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('5ebd33df-f6e5-4b87-b4d3-3e8e4877f6ba', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Cuál de las siguientes situaciones refleja igualdad de género en la escuela?",
    "opciones": [
        {"id": "a", "texto": "Que solo los varones puedan ser representantes estudiantiles"},
        {"id": "b", "texto": "Que niñas y niños puedan participar por igual en todas las materias y actividades, incluidas ciencias y deportes"},
        {"id": "c", "texto": "Que las niñas no puedan opinar en clase de ciencias"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Permitir que niñas y niños participen por igual en todas las áreas, incluidas ciencias y deportes, refleja igualdad de género."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('5ebd33df-f6e5-4b87-b4d3-3e8e4877f6ba', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En tu escuela, el equipo de fútbol femenino recibe el mismo apoyo y horario de cancha que el masculino. ¿Qué principio se está aplicando?",
    "opciones": [
        {"id": "a", "texto": "Un error de organización"},
        {"id": "b", "texto": "Un privilegio innecesario"},
        {"id": "c", "texto": "Igualdad de género y de oportunidades"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Brindar el mismo apoyo a equipos deportivos femeninos y masculinos es un ejemplo concreto de igualdad de oportunidades."
}'::jsonb, 10, 60);


-- Tema: "Los roles de género en las relaciones de complementariedad: Familia, Escuela" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bfb0ae4f-22bf-4a9a-ad58-d3fc5b788ac4', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["ROLES", "GENERO", "FAMILIA", "ESCUELA", "COMPARTIR", "TAREAS", "CAMBIO"],
    "pistas": [
        "Funciones que la sociedad asigna a las personas",
        "Categoría social relacionada con ser hombre o mujer",
        "Espacio donde se aprenden los primeros roles",
        "Espacio donde también se reproducen o transforman roles",
        "Distribuir responsabilidades entre varias personas",
        "Actividades que deben realizarse en el hogar o la escuela",
        "Transformación de una idea o práctica tradicional"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bfb0ae4f-22bf-4a9a-ad58-d3fc5b788ac4', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué son los roles de género según lo estudiado en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Las funciones y responsabilidades que la sociedad asigna tradicionalmente a hombres y mujeres"},
        {"id": "b", "texto": "Características biológicas que no pueden cambiar"},
        {"id": "c", "texto": "Reglas escritas en la Constitución"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Los roles de género son las funciones que la sociedad asigna tradicionalmente a hombres y mujeres, y pueden transformarse."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bfb0ae4f-22bf-4a9a-ad58-d3fc5b788ac4', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante analizar y transformar los roles de género tradicionales?",
    "opciones": [
        {"id": "a", "texto": "Porque los roles de género nunca deben cambiar"},
        {"id": "b", "texto": "Porque solo importan en el ámbito laboral"},
        {"id": "c", "texto": "Porque permite que hombres y mujeres compartan responsabilidades de forma más justa y equitativa"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Analizar y transformar los roles de género permite que hombres y mujeres compartan responsabilidades de forma más justa y equitativa."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('bfb0ae4f-22bf-4a9a-ad58-d3fc5b788ac4', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Un niño quiere aprender a cocinar y una niña quiere aprender mecánica, pero sus compañeros se burlan de ellos. ¿Qué actitud refleja esta burla?",
    "opciones": [
        {"id": "a", "texto": "Una opinión válida que debe respetarse"},
        {"id": "b", "texto": "Una forma correcta de pensar"},
        {"id": "c", "texto": "Un estereotipo de género que limita las oportunidades de las personas"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Burlarse de alguien por interesarse en actividades \"no tradicionales\" de su género es un estereotipo que limita sus oportunidades."
}'::jsonb, 10, 60);


-- Tema: "Los estereotipos y su afectación en los roles de género: Familia, Escuela" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('162deaee-9ea4-4ae8-a2d0-860d352f28ee', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["PREJUICIO", "GENERO", "FAMILIA", "ESCUELA", "LIMITE", "CAMBIO", "IGUALDAD"],
    "pistas": [
        "Idea o juicio previo sin fundamento real",
        "Categoría social asociada a ser hombre o mujer",
        "Espacio donde pueden surgir o corregirse estereotipos",
        "Espacio donde los estereotipos pueden limitar la participación",
        "Barrera que restringe las oportunidades de una persona",
        "Transformación necesaria para superar los estereotipos",
        "Meta que se busca alcanzar al eliminar los estereotipos"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('162deaee-9ea4-4ae8-a2d0-860d352f28ee', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué es un estereotipo de género?",
    "opciones": [
        {"id": "a", "texto": "Una idea generalizada e injusta sobre cómo deben comportarse hombres o mujeres, que limita sus oportunidades"},
        {"id": "b", "texto": "Una ley que protege a las mujeres"},
        {"id": "c", "texto": "Una característica física de las personas"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Un estereotipo de género es una idea generalizada e injusta que limita lo que se espera de hombres o mujeres."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('162deaee-9ea4-4ae8-a2d0-860d352f28ee', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Cómo afectan los estereotipos de género a los estudiantes en la escuela?",
    "opciones": [
        {"id": "a", "texto": "No tienen ningún efecto en la vida escolar"},
        {"id": "b", "texto": "Pueden limitar su elección de materias, deportes o actividades por miedo al rechazo"},
        {"id": "c", "texto": "Ayudan a que todos participen por igual"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Los estereotipos pueden hacer que los estudiantes eviten ciertas materias o actividades por miedo al rechazo social."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('162deaee-9ea4-4ae8-a2d0-860d352f28ee', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una niña sueña con ser ingeniera, pero le dicen que eso es un trabajo para hombres. ¿Qué está ocurriendo en esta situación?",
    "opciones": [
        {"id": "a", "texto": "Se le está dando un buen consejo"},
        {"id": "b", "texto": "Se le está motivando a estudiar"},
        {"id": "c", "texto": "Se le está imponiendo un estereotipo de género que limita su desarrollo"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Decirle a alguien que una profesión es exclusiva de un género es un estereotipo que limita su desarrollo y sus sueños."
}'::jsonb, 10, 60);


-- Tema: "Ley 648: de igualdad de derechos y oportunidades (Título I, Capítulo I, Art. 3, incisos b, d, e, g, h)" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('9528bb1d-bd58-4aaa-8d6d-c19a8cb5bb21', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["IGUALDAD", "DERECHOS", "JUSTICIA", "EQUIDAD", "NORMA", "TITULO", "CAPITULO"],
    "pistas": [
        "Principio central de la Ley 648",
        "Facultades que la ley reconoce a las personas",
        "Trato correcto y equitativo hacia las personas",
        "Trato justo considerando las diferencias de cada persona",
        "Regla establecida por una ley",
        "Gran división de una ley",
        "Subdivisión de un título dentro de una ley"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('9528bb1d-bd58-4aaa-8d6d-c19a8cb5bb21', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué busca garantizar la Ley 648, de igualdad de derechos y oportunidades?",
    "opciones": [
        {"id": "a", "texto": "Que mujeres y hombres tengan las mismas condiciones para ejercer sus derechos"},
        {"id": "b", "texto": "Que solo los hombres tengan acceso a cargos públicos"},
        {"id": "c", "texto": "Que las mujeres paguen más impuestos"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La Ley 648 busca garantizar que mujeres y hombres tengan las mismas condiciones para ejercer sus derechos."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('9528bb1d-bd58-4aaa-8d6d-c19a8cb5bb21', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "Según el Artículo 3 de la Ley 648, ¿qué se entiende por \"igualdad\"?",
    "opciones": [
        {"id": "a", "texto": "Que todas las personas deben vestirse igual"},
        {"id": "b", "texto": "Que no existen diferencias entre las leyes"},
        {"id": "c", "texto": "La condición equivalente en el goce efectivo de los derechos humanos de mujeres y hombres, sin discriminación"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "El Artículo 3 define la igualdad como la condición equivalente en el goce de los derechos humanos, sin discriminación."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('9528bb1d-bd58-4aaa-8d6d-c19a8cb5bb21', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En una empresa, se le paga menos a una mujer que a un hombre por hacer exactamente el mismo trabajo. ¿Qué principio de la Ley 648 se está violando?",
    "opciones": [
        {"id": "a", "texto": "Ninguno, es una práctica normal"},
        {"id": "b", "texto": "El derecho a la propiedad privada"},
        {"id": "c", "texto": "El principio de igualdad de derechos y oportunidades"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Pagar menos a una persona por su género, realizando el mismo trabajo, viola el principio de igualdad de la Ley 648."
}'::jsonb, 10, 60);


-- ============================================================
-- 7mo GRADO — UNIDAD IV: Protagonismo y liderazgo en unidad
-- ============================================================

-- Tema: "Características del liderazgo femenino"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ae2c5374-aa7f-4288-a304-7d87792a5ba1', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["LIDERAZGO", "MUJER", "CONFIANZA", "EMPATIA", "DECISION", "VALENTIA", "RESPETO"],
    "pistas": [
        "Capacidad de guiar a un grupo hacia una meta",
        "Protagonista del liderazgo estudiado en esta unidad",
        "Seguridad que se transmite a un equipo de trabajo",
        "Capacidad de comprender los sentimientos de los demás",
        "Elección que toma un líder para resolver una situación",
        "Actitud de enfrentar los retos con valor",
        "Base fundamental de un buen liderazgo"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ae2c5374-aa7f-4288-a304-7d87792a5ba1', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cuál de las siguientes es una característica del liderazgo femenino estudiada en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "La capacidad de tomar decisiones con empatía y firmeza para el bien del grupo"},
        {"id": "b", "texto": "La imposición de ideas sin escuchar a los demás"},
        {"id": "c", "texto": "El aislamiento de las decisiones del grupo"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El liderazgo femenino se caracteriza, entre otras cosas, por la empatía y la firmeza al tomar decisiones para el bien del grupo."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ae2c5374-aa7f-4288-a304-7d87792a5ba1', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante reconocer y fortalecer el liderazgo femenino en la sociedad?",
    "opciones": [
        {"id": "a", "texto": "Porque las mujeres no pueden liderar"},
        {"id": "b", "texto": "Porque aporta nuevas perspectivas y fortalece la participación de todos en la toma de decisiones"},
        {"id": "c", "texto": "Porque el liderazgo es exclusivo de un solo género"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "El liderazgo femenino aporta nuevas perspectivas que enriquecen la toma de decisiones en cualquier espacio."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ae2c5374-aa7f-4288-a304-7d87792a5ba1', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una estudiante organiza a su equipo de trabajo, escucha las ideas de todos y logra que entreguen el proyecto a tiempo. ¿Qué característica de liderazgo está demostrando?",
    "opciones": [
        {"id": "a", "texto": "Autoritarismo"},
        {"id": "b", "texto": "Falta de compromiso"},
        {"id": "c", "texto": "Liderazgo con empatía y capacidad de organización"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Escuchar a todos y organizar al equipo para cumplir una meta son características propias de un buen liderazgo."
}'::jsonb, 10, 60);


-- Tema: "El rol de la mujer como lideresa: Familia, Escuela, Comunidad" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('56887fdb-6078-46de-a94b-811a55f1f859', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["LIDERESA", "FAMILIA", "ESCUELA", "COMUNIDAD", "ROL", "EJEMPLO", "RESPETO"],
    "pistas": [
        "Mujer que guía y organiza a un grupo",
        "Uno de los espacios donde puede ejercerse el liderazgo",
        "Espacio educativo donde también hay liderazgo femenino",
        "Espacio social donde una mujer puede ser lideresa",
        "Función que cumple una persona en un grupo",
        "Modelo a seguir para otras personas",
        "Valor necesario para ejercer un buen liderazgo"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('56887fdb-6078-46de-a94b-811a55f1f859', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿En qué espacios puede ejercer la mujer su rol de lideresa, según esta unidad?",
    "opciones": [
        {"id": "a", "texto": "En la familia, la escuela y la comunidad"},
        {"id": "b", "texto": "Únicamente en el trabajo"},
        {"id": "c", "texto": "Solo en la política nacional"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La mujer puede ejercer su liderazgo en la familia, la escuela y la comunidad, guiando y motivando a otras personas."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('56887fdb-6078-46de-a94b-811a55f1f859', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué significa que una mujer sea \"lideresa\" en su comunidad?",
    "opciones": [
        {"id": "a", "texto": "Que toma todas las decisiones sin consultar a nadie"},
        {"id": "b", "texto": "Que solo se dedica a las tareas del hogar"},
        {"id": "c", "texto": "Que guía, organiza y motiva a otras personas para lograr el bien común"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Una lideresa guía, organiza y motiva a su grupo para alcanzar el bien común."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('56887fdb-6078-46de-a94b-811a55f1f859', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una madre organiza a los vecinos para limpiar el parque del barrio y mejorar la seguridad. ¿Qué rol está cumpliendo?",
    "opciones": [
        {"id": "a", "texto": "Ninguno relevante"},
        {"id": "b", "texto": "Un rol que no le corresponde"},
        {"id": "c", "texto": "El rol de lideresa comunitaria"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Organizar a los vecinos para mejorar el barrio es un claro ejemplo de liderazgo comunitario ejercido por una mujer."
}'::jsonb, 10, 60);


-- Tema: "El protagonismo de la mujer nicaragüense en: Familia, Escuela, Comunidad" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('4ccc82e1-9c91-43c3-97a6-93d16b798778', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["NICARAGUA", "FAMILIA", "ESCUELA", "COMUNIDAD", "APORTE", "PARTICIPA", "LIDERAZGO"],
    "pistas": [
        "País donde se desarrolla el protagonismo estudiado",
        "Espacio donde inicia el protagonismo de la mujer",
        "Espacio educativo donde se refleja el protagonismo femenino",
        "Espacio social donde la mujer aporta soluciones",
        "Contribución que hace una persona a su entorno",
        "Acción de tomar parte activa en las decisiones",
        "Capacidad de guiar e inspirar a otras personas"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('4ccc82e1-9c91-43c3-97a6-93d16b798778', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿En qué espacios se refleja el protagonismo de la mujer nicaragüense, según esta unidad?",
    "opciones": [
        {"id": "a", "texto": "En la familia, la escuela y la comunidad"},
        {"id": "b", "texto": "Únicamente en el ámbito internacional"},
        {"id": "c", "texto": "Solo en la historia antigua"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El protagonismo de la mujer nicaragüense se refleja en su participación activa en la familia, la escuela y la comunidad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('4ccc82e1-9c91-43c3-97a6-93d16b798778', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué significa que una mujer tenga \"protagonismo\" en su comunidad?",
    "opciones": [
        {"id": "a", "texto": "Que actúa sin importarle las demás personas"},
        {"id": "b", "texto": "Que se mantiene alejada de las decisiones comunitarias"},
        {"id": "c", "texto": "Que participa activamente y aporta soluciones a los problemas de su entorno"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Tener protagonismo significa participar activamente y aportar soluciones a los problemas del entorno."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('4ccc82e1-9c91-43c3-97a6-93d16b798778', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una joven nicaragüense organiza una brigada estudiantil para apoyar a familias afectadas por una emergencia climática. ¿Qué está demostrando?",
    "opciones": [
        {"id": "a", "texto": "Una actividad sin importancia"},
        {"id": "b", "texto": "Una obligación impuesta por la escuela"},
        {"id": "c", "texto": "Protagonismo y compromiso con su comunidad"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Organizar apoyo para familias afectadas por una emergencia es una muestra clara de protagonismo y compromiso comunitario."
}'::jsonb, 10, 60);


-- Tema: "Mujeres destacadas: Familia, Escuela, Comunidad" (7mo)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6a071000-ecd3-4723-87ae-cc8a9fe748eb', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["MUJERES", "DESTACADA", "FAMILIA", "ESCUELA", "COMUNIDAD", "EJEMPLO", "HISTORIA"],
    "pistas": [
        "Protagonistas de los logros estudiados en esta unidad",
        "Que sobresale por sus logros o aportes",
        "Espacio donde una mujer puede destacar",
        "Espacio educativo donde puede haber mujeres destacadas",
        "Espacio social donde se reconoce el aporte de una mujer",
        "Modelo que inspira a otras personas",
        "Relato de los hechos y logros del pasado"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6a071000-ecd3-4723-87ae-cc8a9fe748eb', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Por qué es importante conocer la historia de mujeres destacadas en la familia, la escuela y la comunidad?",
    "opciones": [
        {"id": "a", "texto": "Porque sirven de ejemplo e inspiración para nuevas generaciones"},
        {"id": "b", "texto": "Porque no tienen relación con la vida actual"},
        {"id": "c", "texto": "Porque solo interesan a los historiadores"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Conocer la historia de mujeres destacadas sirve de ejemplo e inspiración para las nuevas generaciones."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6a071000-ecd3-4723-87ae-cc8a9fe748eb', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué tipo de aportes puede hacer una mujer destacada en su comunidad?",
    "opciones": [
        {"id": "a", "texto": "Ningún aporte relevante"},
        {"id": "b", "texto": "Aportes en educación, organización comunitaria, salud, cultura o liderazgo social"},
        {"id": "c", "texto": "Solo aportes económicos"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Las mujeres destacadas pueden aportar en educación, salud, cultura, organización comunitaria o liderazgo social."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6a071000-ecd3-4723-87ae-cc8a9fe748eb', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En tu escuela deciden nombrar la biblioteca en honor a una maestra que dedicó 30 años a enseñar a leer a niños de la comunidad. ¿Por qué se le reconoce?",
    "opciones": [
        {"id": "a", "texto": "Por ser la maestra más antigua"},
        {"id": "b", "texto": "Por casualidad"},
        {"id": "c", "texto": "Por su aporte destacado a la educación de la comunidad"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Reconocer con un homenaje a alguien que dedicó su vida a la educación de la comunidad es una forma de honrar su aporte destacado."
}'::jsonb, 10, 60);


-- ============================================================
-- 9no GRADO — UNIDAD I: Dignidad y respeto para vivir en armonía
-- ============================================================

-- Tema: "El papel de la mujer en la sociedad nicaragüense"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('414f2f74-8afa-4129-a9b1-944dd93b03fb', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["SOCIEDAD", "NICARAGUA", "MUJER", "PAPEL", "APORTE", "DESARROLLO", "CULTURA"],
    "pistas": [
        "Conjunto de personas que conviven en un mismo país",
        "País donde se estudia el papel de la mujer",
        "Protagonista del papel social estudiado en esta unidad",
        "Función que cumple una persona en la sociedad",
        "Contribución positiva a un grupo o país",
        "Progreso económico, social y cultural de un país",
        "Conjunto de costumbres y saberes de un pueblo"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('414f2f74-8afa-4129-a9b1-944dd93b03fb', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cuál ha sido el papel histórico de la mujer en el desarrollo de la sociedad nicaragüense?",
    "opciones": [
        {"id": "a", "texto": "Un papel activo en la economía, la cultura, la educación y la construcción social del país"},
        {"id": "b", "texto": "Un papel limitado exclusivamente al hogar sin ningún aporte externo"},
        {"id": "c", "texto": "Ningún papel relevante en la historia del país"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La mujer nicaragüense ha tenido un papel activo en la economía, la cultura, la educación y el desarrollo del país."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('414f2f74-8afa-4129-a9b1-944dd93b03fb', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante reconocer el papel de la mujer en distintos sectores de la sociedad?",
    "opciones": [
        {"id": "a", "texto": "Porque no tiene ningún impacto social"},
        {"id": "b", "texto": "Porque visibiliza sus aportes y promueve la igualdad de oportunidades"},
        {"id": "c", "texto": "Porque solo interesa a las mujeres"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Reconocer el papel de la mujer en distintos sectores visibiliza sus aportes y promueve la igualdad de oportunidades."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('414f2f74-8afa-4129-a9b1-944dd93b03fb', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En tu comunidad, la mayoría de los pequeños negocios (pulperías, panaderías, costura) son manejados por mujeres. ¿Qué refleja esta situación?",
    "opciones": [
        {"id": "a", "texto": "Una situación poco común"},
        {"id": "b", "texto": "Una casualidad sin importancia"},
        {"id": "c", "texto": "El importante papel económico y social que cumple la mujer nicaragüense"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Que la mayoría de los pequeños negocios comunitarios sean manejados por mujeres refleja su importante papel económico."
}'::jsonb, 10, 60);


-- Tema: "La mujer en los distintos ámbitos de la vida en sociedad"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6160122b-4ae9-4164-aa90-256b834585c3', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["AMBITO", "SOCIAL", "CULTURAL", "ECONOMICO", "POLITICO", "FAMILIAR", "EDUCATIVO"],
    "pistas": [
        "Espacio o área en la que se desenvuelve una persona",
        "Ámbito relacionado con la vida en comunidad",
        "Ámbito relacionado con las tradiciones y el arte",
        "Ámbito relacionado con el trabajo y los recursos",
        "Ámbito relacionado con la toma de decisiones públicas",
        "Ámbito relacionado con la vida en el hogar",
        "Ámbito relacionado con la enseñanza y el aprendizaje"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6160122b-4ae9-4164-aa90-256b834585c3', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cuáles son algunos de los ámbitos en los que participa la mujer dentro de la sociedad, según esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Social, económico, cultural, político, educativo y familiar"},
        {"id": "b", "texto": "Únicamente el ámbito doméstico"},
        {"id": "c", "texto": "Solo el ámbito deportivo"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La mujer participa en múltiples ámbitos: social, económico, cultural, político, educativo y familiar."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6160122b-4ae9-4164-aa90-256b834585c3', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante que la mujer participe en el ámbito político?",
    "opciones": [
        {"id": "a", "texto": "Porque la política no debería incluir a las mujeres"},
        {"id": "b", "texto": "Porque no tiene relación con sus derechos"},
        {"id": "c", "texto": "Porque le permite influir en las decisiones que afectan a toda la sociedad"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "La participación política de la mujer le permite influir directamente en decisiones que afectan a toda la sociedad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6160122b-4ae9-4164-aa90-256b834585c3', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una mujer es electa como concejala de su municipio y propone un proyecto de agua potable para su comunidad. ¿En qué ámbito está participando?",
    "opciones": [
        {"id": "a", "texto": "En ningún ámbito relevante"},
        {"id": "b", "texto": "En el ámbito exclusivamente privado"},
        {"id": "c", "texto": "En el ámbito político y comunitario"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Proponer y gestionar proyectos comunitarios desde un cargo público es un ejemplo de participación política y comunitaria."
}'::jsonb, 10, 60);


-- Tema: "Respeto a la dignidad de la mujer y su importancia para una sociedad más justa e igualitaria"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a6aeda27-340b-4c67-9c3b-f8ab540d5191', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["DIGNIDAD", "RESPETO", "JUSTICIA", "IGUALDAD", "SOCIEDAD", "EQUIDAD", "VALOR"],
    "pistas": [
        "Valor inherente que merece todo ser humano",
        "Trato considerado hacia las demás personas",
        "Trato correcto y equitativo hacia las personas",
        "Mismos derechos y oportunidades para todas las personas",
        "Conjunto de personas que conviven en un mismo lugar",
        "Trato justo considerando las diferencias de cada persona",
        "Principio que orienta el comportamiento de las personas"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a6aeda27-340b-4c67-9c3b-f8ab540d5191', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Por qué el respeto a la dignidad de la mujer contribuye a una sociedad más justa?",
    "opciones": [
        {"id": "a", "texto": "Porque garantiza que todas las personas sean tratadas con equidad, sin discriminación"},
        {"id": "b", "texto": "Porque solo beneficia a las mujeres y a nadie más"},
        {"id": "c", "texto": "Porque no tiene relación con la justicia social"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El respeto a la dignidad de la mujer garantiza que todas las personas sean tratadas con equidad, sin discriminación."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a6aeda27-340b-4c67-9c3b-f8ab540d5191', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué se entiende por una sociedad \"igualitaria\" en el contexto de esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Una sociedad donde todos son exactamente iguales en gustos y capacidades"},
        {"id": "b", "texto": "Una sociedad donde mujeres y hombres tienen las mismas oportunidades y son tratados con el mismo valor"},
        {"id": "c", "texto": "Una sociedad sin ningún tipo de organización"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "Una sociedad igualitaria es aquella donde mujeres y hombres tienen las mismas oportunidades y el mismo valor social."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a6aeda27-340b-4c67-9c3b-f8ab540d5191', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En una asamblea comunitaria, se le da el mismo tiempo y respeto a las opiniones de hombres y mujeres para decidir sobre un proyecto del barrio. ¿Qué principio se está aplicando?",
    "opciones": [
        {"id": "a", "texto": "Un favoritismo injusto"},
        {"id": "b", "texto": "Una pérdida de tiempo"},
        {"id": "c", "texto": "El respeto a la dignidad y la igualdad de oportunidades"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Dar el mismo tiempo y respeto a las opiniones de todos en una asamblea comunitaria refleja el respeto a la dignidad humana."
}'::jsonb, 10, 60);


-- Tema: "La importancia de la mujer indígena y afrodescendiente en la construcción de la sociedad con cultura de paz" (9no)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('637a120a-36e3-414d-9463-d3885d470eac', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["INDIGENA", "CULTURA", "PAZ", "RAICES", "IDENTIDAD", "TRADICION", "COMUNIDAD"],
    "pistas": [
        "Perteneciente a los pueblos originarios",
        "Conjunto de costumbres y saberes de un pueblo",
        "Estado de convivencia sin violencia ni conflictos",
        "Origen cultural e histórico de una persona o pueblo",
        "Conjunto de características que definen a un pueblo",
        "Costumbre que se transmite de generación en generación",
        "Grupo de personas que comparten un mismo entorno"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('637a120a-36e3-414d-9463-d3885d470eac', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué aportes hacen las mujeres indígenas y afrodescendientes a la construcción de una cultura de paz?",
    "opciones": [
        {"id": "a", "texto": "Transmiten valores, tradiciones y formas de convivencia basadas en el respeto y la comunidad"},
        {"id": "b", "texto": "No tienen ningún aporte relevante"},
        {"id": "c", "texto": "Solo participan en actividades folclóricas sin importancia"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Las mujeres indígenas y afrodescendientes transmiten valores, tradiciones y formas de convivencia que fortalecen la cultura de paz."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('637a120a-36e3-414d-9463-d3885d470eac', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante valorar la identidad cultural de las mujeres indígenas y afrodescendientes?",
    "opciones": [
        {"id": "a", "texto": "Porque deben adaptarse completamente a otras culturas"},
        {"id": "b", "texto": "Porque su cultura no tiene ningún valor actual"},
        {"id": "c", "texto": "Porque enriquece la diversidad cultural del país y fortalece el respeto entre todas las personas"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Valorar la identidad cultural de todas las personas enriquece la diversidad y fortalece el respeto mutuo en la sociedad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('637a120a-36e3-414d-9463-d3885d470eac', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En una feria escolar, una abuela afrodescendiente enseña a los estudiantes cantos y bailes tradicionales de su comunidad. ¿Qué está promoviendo?",
    "opciones": [
        {"id": "a", "texto": "Una actividad sin ningún valor educativo"},
        {"id": "b", "texto": "Una pérdida de tiempo en clase"},
        {"id": "c", "texto": "La preservación cultural y la cultura de paz mediante la transmisión de tradiciones"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Enseñar cantos y bailes tradicionales a las nuevas generaciones es una forma de preservar la cultura y promover la paz."
}'::jsonb, 10, 60);


-- ============================================================
-- 9no GRADO — UNIDAD 2: Protejo mi vida con las leyes de mi país
-- ============================================================

-- Tema: "Leyes que cuidan y protegen la vida de las mujeres (Ley No. 779, artículos #1, 2, 3 incisos a, b, c, d, e; 4 inciso d, h, i, k, l, m)"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6d3e7c66-053c-4865-b026-79d3deff9e16', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["VIOLENCIA", "PROTECCION", "DERECHOS", "INTEGRAL", "ARTICULO", "INCISOS", "MUJERES"],
    "pistas": [
        "Acción que causa daño físico, psicológico o sexual",
        "Acción de resguardar a alguien de un peligro",
        "Facultades que la ley reconoce a las personas",
        "Que abarca todos los aspectos de un problema",
        "Sección de una ley que regula un tema específico",
        "Subdivisiones dentro de un artículo de ley",
        "Sujetas de los derechos protegidos en esta ley"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6d3e7c66-053c-4865-b026-79d3deff9e16', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué busca la Ley 779, estudiada en esta unidad, en relación con las mujeres?",
    "opciones": [
        {"id": "a", "texto": "Prevenir, sancionar y erradicar la violencia hacia las mujeres, protegiendo su vida y derechos"},
        {"id": "b", "texto": "Regular el comercio entre municipios"},
        {"id": "c", "texto": "Establecer el calendario escolar"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La Ley 779 busca prevenir, sancionar y erradicar la violencia hacia las mujeres, protegiendo su vida y sus derechos."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6d3e7c66-053c-4865-b026-79d3deff9e16', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante conocer los artículos específicos de una ley de protección, y no solo su nombre general?",
    "opciones": [
        {"id": "a", "texto": "Porque los artículos no tienen ninguna utilidad real"},
        {"id": "b", "texto": "Porque solo los abogados necesitan conocerlos"},
        {"id": "c", "texto": "Porque los artículos detallan exactamente qué derechos se protegen y cómo aplicarlos en la práctica"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Conocer los artículos específicos de una ley permite entender con precisión qué derechos protege y cómo aplicarlos."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6d3e7c66-053c-4865-b026-79d3deff9e16', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una joven de tu comunidad es amenazada por su expareja y no sabe qué derechos la protegen. ¿Qué deberías decirle según lo estudiado en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Que no existen leyes que puedan ayudarla"},
        {"id": "b", "texto": "Que debe resolverlo sola sin ayuda legal"},
        {"id": "c", "texto": "Que la Ley 779 la protege y puede buscar ayuda en las instituciones correspondientes"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "La Ley 779 protege a las mujeres frente a amenazas y violencia; buscar ayuda institucional es un paso importante y seguro."
}'::jsonb, 10, 60);


-- Tema: "Ley 648, artículo #1, 2, 3, sus incisos (a, b, c, f, h) - 6 (inciso #1)"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('027e9f0b-e2c5-49d9-9428-849591b3ca60', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["IGUALDAD", "DERECHOS", "EQUIDAD", "JUSTICIA", "NORMA", "ARTICULO", "INCISO"],
    "pistas": [
        "Principio central de la Ley 648",
        "Facultades que la ley reconoce a las personas",
        "Trato justo considerando las diferencias de cada persona",
        "Trato correcto hacia todas las personas",
        "Regla establecida por una ley",
        "Sección de una ley que regula un tema",
        "Subdivisión de un artículo de ley"
    ],
    "tamaño": 10
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('027e9f0b-e2c5-49d9-9428-849591b3ca60', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué tipo de ley es la Ley 648 estudiada en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Una ley de igualdad de derechos y oportunidades entre mujeres y hombres"},
        {"id": "b", "texto": "Una ley de tránsito vehicular"},
        {"id": "c", "texto": "Una ley sobre impuestos municipales"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "La Ley 648 es una ley de igualdad de derechos y oportunidades entre mujeres y hombres."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('027e9f0b-e2c5-49d9-9428-849591b3ca60', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Para qué sirve conocer los incisos específicos de un artículo de ley?",
    "opciones": [
        {"id": "a", "texto": "Para memorizar números sin ningún propósito"},
        {"id": "b", "texto": "Porque los incisos no aportan información relevante"},
        {"id": "c", "texto": "Para comprender con precisión qué situaciones y derechos están regulados"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Conocer los incisos de un artículo permite comprender con precisión qué situaciones específicas regula la ley."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('027e9f0b-e2c5-49d9-9428-849591b3ca60', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En tu comunidad, un grupo de mujeres exige que se cumplan sus derechos laborales citando la Ley 648. ¿Qué están haciendo?",
    "opciones": [
        {"id": "a", "texto": "Actuando sin ningún fundamento legal"},
        {"id": "b", "texto": "Incumpliendo alguna norma"},
        {"id": "c", "texto": "Ejerciendo su derecho a la igualdad y exigiendo el cumplimiento de la ley"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Exigir el cumplimiento de derechos laborales citando la ley es una forma legítima y fundamentada de defender la igualdad."
}'::jsonb, 10, 60);


-- Tema: "Sistema de alertas tempranas para prevenir la violencia en la mujer nicaragüense: Señales de Violencia"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('0c991698-5e7b-4e5b-88f6-35006eb5f20d', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["ALERTA", "SEÑALES", "PREVENCION", "VIOLENCIA", "CONTROL", "AMENAZA", "CELOS"],
    "pistas": [
        "Aviso que indica un posible peligro",
        "Indicios que permiten identificar un riesgo",
        "Acción de anticiparse para evitar un daño",
        "Acción que causa daño a otra persona",
        "Dominio excesivo sobre las decisiones de otra persona",
        "Advertencia de causar un daño a alguien",
        "Sentimiento de posesión o desconfianza excesiva"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('0c991698-5e7b-4e5b-88f6-35006eb5f20d', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cuál es el objetivo del sistema de alertas tempranas estudiado en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Reconocer señales de violencia a tiempo para prevenir situaciones graves"},
        {"id": "b", "texto": "Registrar estadísticas sin ninguna acción preventiva"},
        {"id": "c", "texto": "Justificar la violencia en ciertos casos"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El sistema de alertas tempranas permite reconocer señales de violencia a tiempo para poder prevenirla."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('0c991698-5e7b-4e5b-88f6-35006eb5f20d', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Cuál de las siguientes NO es una señal de alerta de violencia en una relación?",
    "opciones": [
        {"id": "a", "texto": "Control excesivo sobre las decisiones de la pareja"},
        {"id": "b", "texto": "Comunicación respetuosa y apoyo mutuo entre ambas personas"},
        {"id": "c", "texto": "Aislamiento forzado de familiares y amistades"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "La comunicación respetuosa y el apoyo mutuo son la base de una relación sana, a diferencia del control o el aislamiento."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('0c991698-5e7b-4e5b-88f6-35006eb5f20d', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Notás que una compañera cambia su forma de vestir y deja de hablar con sus amigas porque su pareja se enoja. ¿Qué deberías reconocer en esta situación?",
    "opciones": [
        {"id": "a", "texto": "Un comportamiento normal en cualquier relación"},
        {"id": "b", "texto": "Algo que no amerita ninguna atención"},
        {"id": "c", "texto": "Señales de alerta de una posible relación de control y violencia"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Cambiar de comportamiento por miedo a la reacción de la pareja es una señal de alerta que no debe ignorarse."
}'::jsonb, 10, 60);


-- Tema: "Mecanismos de Denuncia: Presencial, En Línea, Telefónicas gratuitas, Instituciones que atienden" (9no)
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('fb8be820-b7b2-4d65-8633-426fd57b7b1b', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["DENUNCIA", "PRESENCIAL", "TELEFONO", "LINEA", "GRATUITA", "ATENCION", "AYUDA"],
    "pistas": [
        "Acción de informar a una autoridad sobre un hecho",
        "Que se realiza en persona, cara a cara",
        "Aparato usado para comunicarse a distancia",
        "Canal telefónico habilitado para recibir denuncias",
        "Que no tiene ningún costo económico",
        "Servicio que brinda apoyo a quien lo necesita",
        "Apoyo brindado a una persona en dificultad"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('fb8be820-b7b2-4d65-8633-426fd57b7b1b', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cuáles son los mecanismos de denuncia disponibles para casos de violencia hacia la mujer, según esta unidad?",
    "opciones": [
        {"id": "a", "texto": "Presencial, en línea y mediante líneas telefónicas gratuitas"},
        {"id": "b", "texto": "Únicamente mediante cartas escritas"},
        {"id": "c", "texto": "Solo a través de familiares"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Existen varios mecanismos de denuncia: presencial, en línea y mediante líneas telefónicas gratuitas."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('fb8be820-b7b2-4d65-8633-426fd57b7b1b', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué ventaja ofrecen las líneas telefónicas gratuitas de denuncia?",
    "opciones": [
        {"id": "a", "texto": "Solo están disponibles para quienes pueden pagarlas"},
        {"id": "b", "texto": "No tienen ninguna utilidad real"},
        {"id": "c", "texto": "Permiten pedir ayuda de forma inmediata y accesible para todas las personas"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Las líneas gratuitas garantizan que cualquier persona, sin importar su situación económica, pueda pedir ayuda."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('fb8be820-b7b2-4d65-8633-426fd57b7b1b', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Un familiar te comenta que quiere denunciar una situación de violencia pero no puede salir de su casa. ¿Qué mecanismo de denuncia le recomendarías?",
    "opciones": [
        {"id": "a", "texto": "Decirle que no hay forma de denunciar sin salir de casa"},
        {"id": "b", "texto": "Recomendarle que no denuncie"},
        {"id": "c", "texto": "Una denuncia en línea o por línea telefónica gratuita"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Cuando alguien no puede salir de casa, la denuncia en línea o telefónica es una alternativa segura y accesible."
}'::jsonb, 10, 60);


-- ============================================================
-- 9no GRADO — UNIDAD III: Relaciones de complementariedad
-- ============================================================

-- Tema: "Las relaciones de complementariedad: Derecho a vivir en relaciones de equidad y de solidaridad (Familia, Escuela, Comunidad)"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c406b79d-9da6-478e-8c34-18420c8c9a0b', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["EQUIDAD", "DERECHO", "FAMILIA", "ESCUELA", "COMUNIDAD", "APOYO", "RESPETO"],
    "pistas": [
        "Trato justo considerando las necesidades de cada persona",
        "Facultad reconocida a toda persona",
        "Espacio donde inician las relaciones de complementariedad",
        "Espacio educativo donde se practica la equidad",
        "Espacio social donde se practica la solidaridad",
        "Ayuda que se brinda a otra persona",
        "Trato considerado hacia las demás personas"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c406b79d-9da6-478e-8c34-18420c8c9a0b', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué derecho se destaca en esta unidad sobre las relaciones de complementariedad?",
    "opciones": [
        {"id": "a", "texto": "El derecho a vivir relaciones basadas en la equidad y la solidaridad"},
        {"id": "b", "texto": "El derecho a la propiedad privada"},
        {"id": "c", "texto": "El derecho al voto únicamente"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Esta unidad destaca el derecho a vivir relaciones basadas en la equidad y la solidaridad en distintos espacios."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c406b79d-9da6-478e-8c34-18420c8c9a0b', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué significa \"solidaridad\" en el contexto de las relaciones familiares, escolares y comunitarias?",
    "opciones": [
        {"id": "a", "texto": "Competir para obtener beneficios personales"},
        {"id": "b", "texto": "Ignorar los problemas de otras personas"},
        {"id": "c", "texto": "Apoyarse mutuamente ante las necesidades y dificultades de los demás"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Solidaridad significa apoyarse mutuamente ante las necesidades y dificultades de los demás."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c406b79d-9da6-478e-8c34-18420c8c9a0b', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Los estudiantes de un salón organizan una colecta para ayudar a un compañero cuya familia perdió su casa en una inundación. ¿Qué valor están practicando?",
    "opciones": [
        {"id": "a", "texto": "Ninguno relevante"},
        {"id": "b", "texto": "Competencia entre compañeros"},
        {"id": "c", "texto": "Solidaridad y equidad en las relaciones comunitarias"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Organizar una colecta para ayudar a un compañero en dificultades es una muestra concreta de solidaridad comunitaria."
}'::jsonb, 10, 60);


-- Tema: "Los procesos de cambio en las relaciones de complementariedad: Familia, Escuela, Comunidad"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f450f1bd-f5f7-4642-8c06-edd22041c879', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["CAMBIO", "PROCESO", "FAMILIA", "ESCUELA", "COMUNIDAD", "EVOLUCION", "EQUIDAD"],
    "pistas": [
        "Transformación de una práctica o idea tradicional",
        "Conjunto de pasos hacia una transformación",
        "Espacio donde pueden darse procesos de cambio",
        "Espacio educativo donde se promueven cambios positivos",
        "Espacio social donde se reflejan los cambios",
        "Desarrollo progresivo hacia una mejora",
        "Meta que se busca alcanzar con los procesos de cambio"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f450f1bd-f5f7-4642-8c06-edd22041c879', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿A qué se refieren los \"procesos de cambio\" en las relaciones de complementariedad, según esta unidad?",
    "opciones": [
        {"id": "a", "texto": "A la transformación gradual de roles y responsabilidades hacia relaciones más equitativas"},
        {"id": "b", "texto": "A cambios que no tienen ninguna relación con la igualdad"},
        {"id": "c", "texto": "A un proceso que no puede ocurrir en la vida real"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Los procesos de cambio implican transformar gradualmente los roles hacia relaciones más equitativas."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f450f1bd-f5f7-4642-8c06-edd22041c879', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué factores pueden impulsar procesos de cambio positivos en la familia, la escuela y la comunidad?",
    "opciones": [
        {"id": "a", "texto": "La imposición de una sola opinión sin diálogo"},
        {"id": "b", "texto": "La educación, el diálogo y la práctica de valores de equidad"},
        {"id": "c", "texto": "La resistencia a cualquier tipo de cambio"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "La educación, el diálogo y la práctica de valores de equidad impulsan cambios positivos en las relaciones."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f450f1bd-f5f7-4642-8c06-edd22041c879', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Antes, en una familia solo la madre cocinaba; ahora todos los miembros se turnan para preparar la comida. ¿Qué representa este cambio?",
    "opciones": [
        {"id": "a", "texto": "Un problema familiar"},
        {"id": "b", "texto": "Una situación sin ninguna importancia"},
        {"id": "c", "texto": "Un proceso de cambio hacia relaciones más equitativas y complementarias"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Que todos los miembros de la familia compartan las tareas del hogar refleja un proceso de cambio hacia la equidad."
}'::jsonb, 10, 60);


-- Tema: "La influencia del medio social en las relaciones de complementariedad"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('d42906ed-893c-4093-af24-df553b4ad62d', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["INFLUENCIA", "MEDIO", "SOCIAL", "RELACION", "CULTURA", "ENTORNO", "COMUNIDAD"],
    "pistas": [
        "Efecto que algo o alguien ejerce sobre otra persona",
        "Entorno en el que se desenvuelve una persona",
        "Relacionado con la convivencia entre personas",
        "Vínculo que se establece entre dos o más personas",
        "Conjunto de costumbres que influyen en el comportamiento",
        "Ambiente que rodea a una persona",
        "Grupo de personas que comparten un mismo entorno"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('d42906ed-893c-4093-af24-df553b4ad62d', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué se entiende por \"medio social\" en el contexto de esta unidad?",
    "opciones": [
        {"id": "a", "texto": "El entorno cultural, familiar y comunitario que influye en cómo las personas se relacionan"},
        {"id": "b", "texto": "Un lugar físico específico sin ninguna influencia"},
        {"id": "c", "texto": "Un concepto sin relación con las relaciones humanas"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El medio social es el entorno cultural, familiar y comunitario que influye en cómo las personas se relacionan entre sí."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('d42906ed-893c-4093-af24-df553b4ad62d', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Cómo puede el medio social influir de forma negativa en las relaciones de complementariedad?",
    "opciones": [
        {"id": "a", "texto": "Promoviendo siempre relaciones justas y equitativas"},
        {"id": "b", "texto": "No tiene ninguna influencia en las relaciones"},
        {"id": "c", "texto": "Reforzando estereotipos y roles de género rígidos que limitan la equidad"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Cuando el entorno refuerza estereotipos rígidos, limita las posibilidades de relaciones equitativas."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('d42906ed-893c-4093-af24-df553b4ad62d', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En una comunidad donde se valora que hombres y mujeres compartan responsabilidades, los jóvenes crecen practicando la equidad de forma natural. ¿Qué demuestra esta situación?",
    "opciones": [
        {"id": "a", "texto": "Una situación aislada sin ninguna relación con el entorno"},
        {"id": "b", "texto": "Algo que ocurre por casualidad"},
        {"id": "c", "texto": "La influencia positiva del medio social en las relaciones de complementariedad"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Un entorno que valora la equidad ayuda a que las nuevas generaciones la practiquen de forma natural."
}'::jsonb, 10, 60);


-- Tema: "La importancia de las relaciones de complementariedad: Familia, Escuela, Comunidad"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ce1bf3bd-b1aa-45cb-b669-9c2530f2f2d5', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["RELACION", "FAMILIA", "ESCUELA", "COMUNIDAD", "EQUIDAD", "BIENESTAR", "ARMONIA"],
    "pistas": [
        "Vínculo que se establece entre dos o más personas",
        "Espacio donde se practican las primeras relaciones complementarias",
        "Espacio donde también se fortalecen estas relaciones",
        "Espacio social donde se reflejan las relaciones complementarias",
        "Base de unas relaciones complementarias saludables",
        "Estado de satisfacción y buena convivencia",
        "Equilibrio y buena relación entre las personas"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ce1bf3bd-b1aa-45cb-b669-9c2530f2f2d5', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Por qué son importantes las relaciones de complementariedad en la familia, la escuela y la comunidad?",
    "opciones": [
        {"id": "a", "texto": "Porque fortalecen la armonía, el bienestar y la equidad entre todas las personas"},
        {"id": "b", "texto": "Porque solo benefician a un grupo de personas"},
        {"id": "c", "texto": "Porque no tienen ningún impacto en la convivencia"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Las relaciones de complementariedad fortalecen la armonía, el bienestar y la equidad en la familia, la escuela y la comunidad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ce1bf3bd-b1aa-45cb-b669-9c2530f2f2d5', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué beneficios trae para una comunidad practicar relaciones complementarias basadas en la equidad?",
    "opciones": [
        {"id": "a", "texto": "Más conflictos y divisiones"},
        {"id": "b", "texto": "Ningún beneficio identificable"},
        {"id": "c", "texto": "Mayor cooperación, bienestar colectivo y mejores relaciones entre sus miembros"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Practicar relaciones complementarias basadas en la equidad genera mayor cooperación y bienestar colectivo."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('ce1bf3bd-b1aa-45cb-b669-9c2530f2f2d5', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En una escuela donde estudiantes y docentes de ambos géneros participan por igual en actividades deportivas y culturales, se observa mayor unión y respeto. ¿Qué refleja esta situación?",
    "opciones": [
        {"id": "a", "texto": "Una coincidencia sin relación con la equidad"},
        {"id": "b", "texto": "Un problema de organización"},
        {"id": "c", "texto": "La importancia de las relaciones de complementariedad para el bienestar escolar"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "La participación equitativa en actividades escolares fortalece la unión y el respeto entre toda la comunidad educativa."
}'::jsonb, 10, 60);


-- Tema: "Ley 648: de igualdad de derechos y oportunidades (Capítulo IV, En el Ámbito Social, Art. 23, numeral 1, 2, 3, 4, 6 y 10)"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6db04972-06b1-4967-b527-4a3f9b0c4fd1', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["IGUALDAD", "DERECHOS", "SOCIAL", "EDUCACION", "EQUIDAD", "NUMERAL", "CAPITULO"],
    "pistas": [
        "Principio central de la Ley 648",
        "Facultades que la ley reconoce a las personas",
        "Ámbito regulado por el Capítulo IV de la Ley 648",
        "Área donde deben eliminarse las desigualdades, según la ley",
        "Trato justo considerando las diferencias de cada persona",
        "Subdivisión de un artículo dentro de una ley",
        "Gran división dentro de una ley"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6db04972-06b1-4967-b527-4a3f9b0c4fd1', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué ámbito regula el Capítulo IV de la Ley 648 estudiado en esta unidad?",
    "opciones": [
        {"id": "a", "texto": "El ámbito social, incluyendo temas como educación y prevención de la desigualdad"},
        {"id": "b", "texto": "El ámbito exclusivamente deportivo"},
        {"id": "c", "texto": "El ámbito de tránsito vehicular"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El Capítulo IV de la Ley 648 regula el ámbito social, incluyendo temas educativos y de prevención de la desigualdad."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6db04972-06b1-4967-b527-4a3f9b0c4fd1', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "Según el Artículo 23 de la Ley 648, ¿qué deben hacer las instituciones estatales en el ámbito educativo?",
    "opciones": [
        {"id": "a", "texto": "Mantener sin cambios los programas educativos"},
        {"id": "b", "texto": "Excluir a las mujeres de ciertas materias"},
        {"id": "c", "texto": "Eliminar las desigualdades en el acceso a la educación y los estereotipos sexistas en el currículo"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "El Artículo 23 establece que las instituciones deben eliminar desigualdades en el acceso a la educación y los estereotipos sexistas."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('6db04972-06b1-4967-b527-4a3f9b0c4fd1', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Un colegio actualiza sus libros de texto para eliminar imágenes que muestran solo a hombres en profesiones científicas. ¿Qué principio de la Ley 648 está aplicando?",
    "opciones": [
        {"id": "a", "texto": "Un cambio sin ningún propósito"},
        {"id": "b", "texto": "Una decisión que no tiene relación con la ley"},
        {"id": "c", "texto": "La eliminación de estereotipos sexistas en el diseño curricular"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Actualizar materiales educativos para eliminar estereotipos es una aplicación directa de lo que exige la Ley 648."
}'::jsonb, 10, 60);


-- ============================================================
-- 9no GRADO — UNIDAD IV: Protagonismo y liderazgo en unidad
-- ============================================================

-- Tema: "Protagonismo de la mujer en la historia de Nicaragua: Empoderamiento de la mujer nicaragüense en el área laboral"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f1107eb9-fb8a-4b00-b6b9-f9c74b3cfe04', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["HISTORIA", "NICARAGUA", "TRABAJO", "LABORAL", "LOGRO", "AVANCE", "LIDERAZGO"],
    "pistas": [
        "Relato de los hechos y logros del pasado",
        "País donde se estudia el protagonismo laboral de la mujer",
        "Actividad que genera ingresos y desarrollo",
        "Relacionado con el ámbito del trabajo",
        "Meta alcanzada gracias al esfuerzo propio",
        "Progreso hacia una mejor condición",
        "Capacidad de guiar a un grupo hacia una meta"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f1107eb9-fb8a-4b00-b6b9-f9c74b3cfe04', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué significa el \"empoderamiento\" de la mujer en el área laboral?",
    "opciones": [
        {"id": "a", "texto": "El proceso mediante el cual la mujer gana autonomía, confianza y acceso a mejores oportunidades de trabajo"},
        {"id": "b", "texto": "La obligación de trabajar sin ningún derecho"},
        {"id": "c", "texto": "La exclusión de la mujer del ámbito laboral"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El empoderamiento laboral es el proceso mediante el cual la mujer gana autonomía y acceso a mejores oportunidades de trabajo."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f1107eb9-fb8a-4b00-b6b9-f9c74b3cfe04', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Cómo ha sido el protagonismo de la mujer en la historia laboral de Nicaragua?",
    "opciones": [
        {"id": "a", "texto": "Se ha mantenido igual desde siempre sin ningún avance"},
        {"id": "b", "texto": "Ha ido en aumento, con mujeres accediendo a más espacios profesionales y de liderazgo"},
        {"id": "c", "texto": "Ha disminuido con el paso del tiempo"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "A lo largo de la historia, el protagonismo laboral de la mujer nicaragüense ha ido en aumento."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('f1107eb9-fb8a-4b00-b6b9-f9c74b3cfe04', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una mujer nicaragüense funda su propia cooperativa agrícola y genera empleo para otras mujeres de su comunidad. ¿Qué está demostrando?",
    "opciones": [
        {"id": "a", "texto": "Una actividad sin ningún impacto social"},
        {"id": "b", "texto": "Una situación poco relevante para la historia del país"},
        {"id": "c", "texto": "Empoderamiento económico y protagonismo laboral"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Fundar una cooperativa que genera empleo para otras mujeres es un claro ejemplo de empoderamiento económico."
}'::jsonb, 10, 60);


-- Tema: "Derechos e Igualdad de oportunidades en el área laboral: Protección de la mujer trabajadora"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('adc05aec-ef15-4f33-96d7-92539830d47a', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["DERECHOS", "IGUALDAD", "TRABAJO", "LABORAL", "PROTECCION", "SALARIO", "EMPLEO"],
    "pistas": [
        "Facultades reconocidas a toda persona trabajadora",
        "Principio de tener las mismas oportunidades laborales",
        "Actividad realizada a cambio de una remuneración",
        "Relacionado con el ámbito del empleo",
        "Acción de resguardar a la mujer trabajadora",
        "Pago que se recibe por un trabajo realizado",
        "Ocupación laboral remunerada"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('adc05aec-ef15-4f33-96d7-92539830d47a', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Qué derechos laborales se destacan en esta unidad para proteger a la mujer trabajadora?",
    "opciones": [
        {"id": "a", "texto": "La igualdad de oportunidades, salario justo y protección frente a la discriminación laboral"},
        {"id": "b", "texto": "La obligación de trabajar sin descanso"},
        {"id": "c", "texto": "La exclusión de puestos directivos"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "Esta unidad destaca la igualdad de oportunidades, el salario justo y la protección frente a la discriminación laboral."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('adc05aec-ef15-4f33-96d7-92539830d47a', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Por qué es importante la protección laboral de la mujer trabajadora?",
    "opciones": [
        {"id": "a", "texto": "Porque las mujeres no necesitan ningún tipo de protección"},
        {"id": "b", "texto": "Porque solo aplica a ciertos trabajos"},
        {"id": "c", "texto": "Porque garantiza condiciones justas de empleo y evita la discriminación por género"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "La protección laboral garantiza condiciones justas de empleo y evita la discriminación por género."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('adc05aec-ef15-4f33-96d7-92539830d47a', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Una empresa decide dar el mismo salario a hombres y mujeres que realizan el mismo trabajo y con la misma experiencia. ¿Qué derecho está garantizando?",
    "opciones": [
        {"id": "a", "texto": "Un beneficio innecesario"},
        {"id": "b", "texto": "Una práctica que no tiene relación con los derechos laborales"},
        {"id": "c", "texto": "La igualdad de oportunidades y de salario en el área laboral"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Pagar el mismo salario por el mismo trabajo y experiencia es una forma concreta de garantizar la igualdad laboral."
}'::jsonb, 10, 60);


-- Tema: "La actitud de la mujer frente al trabajo: Erradicación de la pobreza"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a8cc6b24-0a40-4da1-9a90-1afbe11eae31', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["TRABAJO", "POBREZA", "ESFUERZO", "ACTITUD", "SUPERACION", "ECONOMIA", "FAMILIA"],
    "pistas": [
        "Actividad que genera ingresos para una familia",
        "Condición de carecer de recursos económicos suficientes",
        "Dedicación y empeño puesto en una actividad",
        "Disposición o forma de enfrentar una situación",
        "Proceso de mejorar la propia condición de vida",
        "Sistema de producción e intercambio de bienes",
        "Grupo que se beneficia del esfuerzo económico"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a8cc6b24-0a40-4da1-9a90-1afbe11eae31', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Cómo contribuye la actitud positiva de la mujer frente al trabajo a la erradicación de la pobreza?",
    "opciones": [
        {"id": "a", "texto": "A través del esfuerzo y la superación, generando ingresos que mejoran la economía familiar y comunitaria"},
        {"id": "b", "texto": "No tiene ninguna relación con la pobreza"},
        {"id": "c", "texto": "Solo afecta negativamente a la familia"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El esfuerzo y la superación de la mujer frente al trabajo contribuyen a mejorar la economía familiar y comunitaria."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a8cc6b24-0a40-4da1-9a90-1afbe11eae31', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué actitud demuestra una mujer que, a pesar de las dificultades económicas, busca capacitarse y emprender un negocio propio?",
    "opciones": [
        {"id": "a", "texto": "Una actitud de conformismo"},
        {"id": "b", "texto": "Una actitud sin ningún valor social"},
        {"id": "c", "texto": "Una actitud de esfuerzo y superación frente a la pobreza"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Buscar capacitarse y emprender pese a las dificultades es una actitud de superación frente a la pobreza."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('a8cc6b24-0a40-4da1-9a90-1afbe11eae31', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "En una comunidad rural, un grupo de mujeres forma una cooperativa de costura para generar ingresos propios. ¿Qué está reflejando esta iniciativa?",
    "opciones": [
        {"id": "a", "texto": "Una actividad sin ningún impacto económico"},
        {"id": "b", "texto": "Una decisión sin relación con el desarrollo comunitario"},
        {"id": "c", "texto": "Una actitud de superación que contribuye a erradicar la pobreza"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Formar una cooperativa para generar ingresos propios es una iniciativa que contribuye directamente a erradicar la pobreza."
}'::jsonb, 10, 60);


-- Tema: "Mujeres que han hecho historia en Nicaragua"
INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c9a8da8e-689c-4cbd-a36b-5e0e6bcfdae7', (SELECT id FROM tipos_actividad WHERE nombre = 'sopa_letras'), 1,
'{
    "palabras": ["HISTORIA", "NICARAGUA", "LEGADO", "MEMORIA", "APORTE", "HEROINA", "LUCHA"],
    "pistas": [
        "Relato de los hechos y logros del pasado",
        "País donde se reconoce a estas mujeres destacadas",
        "Aporte que perdura después del paso de una persona",
        "Recuerdo colectivo de hechos importantes",
        "Contribución positiva a la sociedad",
        "Mujer reconocida por sus acciones valiosas",
        "Esfuerzo sostenido por alcanzar un objetivo justo"
    ],
    "tamaño": 12
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c9a8da8e-689c-4cbd-a36b-5e0e6bcfdae7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 1,
'{
    "pregunta": "¿Por qué es importante conocer la historia de mujeres que han dejado huella en Nicaragua?",
    "opciones": [
        {"id": "a", "texto": "Porque su legado inspira y demuestra el papel fundamental de la mujer en la construcción del país"},
        {"id": "b", "texto": "Porque no tiene relación con la actualidad"},
        {"id": "c", "texto": "Porque solo interesa a un pequeño grupo de personas"}
    ],
    "respuesta_correcta": "a",
    "retroalimentacion": "El legado de las mujeres que han hecho historia inspira y demuestra su papel fundamental en la construcción del país."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c9a8da8e-689c-4cbd-a36b-5e0e6bcfdae7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 2,
'{
    "pregunta": "¿Qué tipo de legado pueden dejar las mujeres que han hecho historia en distintos ámbitos?",
    "opciones": [
        {"id": "a", "texto": "Ningún legado relevante"},
        {"id": "b", "texto": "Aportes en la educación, la cultura, la política o la lucha por los derechos humanos"},
        {"id": "c", "texto": "Solo legados materiales"}
    ],
    "respuesta_correcta": "b",
    "retroalimentacion": "El legado de estas mujeres puede reflejarse en aportes educativos, culturales, políticos o en la lucha por los derechos humanos."
}'::jsonb, 10, 60);

INSERT INTO actividades (tema_id, tipo_actividad_id, grupo_variante, config_json, puntos_recompensa, puntaje_minimo_aprobacion) VALUES
('c9a8da8e-689c-4cbd-a36b-5e0e6bcfdae7', (SELECT id FROM tipos_actividad WHERE nombre = 'quiz'), 3,
'{
    "pregunta": "Un municipio decide colocar una placa conmemorativa en honor a una maestra que fundó la primera escuela rural de la zona hace décadas. ¿Qué se está reconociendo?",
    "opciones": [
        {"id": "a", "texto": "Un hecho sin importancia"},
        {"id": "b", "texto": "Una decisión arbitraria sin fundamento"},
        {"id": "c", "texto": "Su legado histórico y su aporte a la educación de la comunidad"}
    ],
    "respuesta_correcta": "c",
    "retroalimentacion": "Reconocer con una placa a quien fundó una escuela rural es una forma de valorar su legado histórico y educativo."
}'::jsonb, 10, 60);


-- ============================================================
-- VERIFICACIÓN: corré esto después de ejecutar el seed
-- ============================================================
-- SELECT t.titulo, COUNT(a.id) as actividades FROM temas t LEFT JOIN actividades a ON a.tema_id = t.id GROUP BY t.titulo ORDER BY actividades, t.titulo;
