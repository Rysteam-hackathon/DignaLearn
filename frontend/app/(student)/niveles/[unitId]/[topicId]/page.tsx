"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabaseEstudiante } from "@/lib/supabase";
import { getEstudianteLocal } from "@/lib/auth";
import { obtenerProgresoPorTema } from "@/lib/progress";
import WordSearch from "@/components/games/WordSearch";
import Quiz from "@/components/games/Quiz";
import Conectores from "@/components/games/Conectores";
import Clasificacion from "@/components/games/Clasificacion";
import ProgresoLectura from "@/components/ProgresoLectura";
import Reflexion from "@/components/Reflexion";

// Elige qué variante de actividad mostrar:
// - Si el estudiante todavía no completó la actividad de este tema, siempre
//   la variante 1 (versión base para la primera exposición al concepto).
// - Si ya la completó antes y vuelve a entrar, una al azar entre 2 y 3
//   (nunca la 1 de nuevo), para que el repaso se sienta distinto.
// - Si el tema no tiene variantes 2/3 cargadas, cae de nuevo a la 1.
function elegirActividad<T extends { grupo_variante: number }>(
  actividades: T[],
  actividadYaCompletada: boolean
): T | null {
  if (!actividades.length) return null;

  if (actividadYaCompletada) {
    const repaso = actividades.filter((a) => a.grupo_variante === 2 || a.grupo_variante === 3);
    if (repaso.length > 0) {
      return repaso[Math.floor(Math.random() * repaso.length)];
    }
  }

  return actividades.find((a) => a.grupo_variante === 1) ?? actividades[0];
}

interface SopaLetrasConfig {
  palabras: string[];
  pistas: string[];
  tamaño: number;
}

interface QuizConfig {
  pregunta: string;
  opciones: { id: string; texto: string }[];
  respuesta_correcta: string;
  retroalimentacion: string;
}

interface ReflexionConfig {
  pregunta: string;
  opciones: { id: string; texto: string }[];
  respuesta_correcta: string;
  dato_extra: string;
}

interface ConectoresConfig {
  pares: { concepto: string; definicion: string }[];
}

interface ClasificacionConfig {
  situaciones: { texto: string; es_correcto: boolean; explicacion: string }[];
}

interface TemaData {
  titulo: string;
  contenido_lectura: string | null;
}

function Separador({ emoji, esOscuro }: { emoji: string; esOscuro: boolean }) {
  const lineColor = esOscuro ? "rgba(255,255,255,0.12)" : "rgba(22,11,36,0.12)";
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px" style={{ backgroundColor: lineColor }} />
      <span className="text-xl" aria-hidden>{emoji}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: lineColor }} />
    </div>
  );
}

export default function TemaPage({
  params,
}: {
  params: { unitId: string; topicId: string };
}) {
  const [esOscuro, setEsOscuro] = useState(false);
  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const obs = new MutationObserver(actualizar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const [tema, setTema] = useState<TemaData | null>(null);
  const [sopaConfig, setSopaConfig] = useState<SopaLetrasConfig | undefined>();
  const [quizConfig, setQuizConfig] = useState<QuizConfig | undefined>();
  const [conectoresConfig, setConectoresConfig] = useState<ConectoresConfig | undefined>();
  const [clasificacionConfig, setClasificacionConfig] = useState<ClasificacionConfig | undefined>();
  const [reflexionConfig, setReflexionConfig] = useState<ReflexionConfig | undefined>();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data: temaData } = await supabaseEstudiante
        .from("temas")
        .select("titulo, contenido_lectura")
        .eq("id", params.topicId)
        .maybeSingle();
      setTema(temaData);

      let actividadYaCompletada = false;
      const estudiante = getEstudianteLocal();
      if (estudiante) {
        const progreso = await obtenerProgresoPorTema(estudiante.id, params.topicId);
        actividadYaCompletada = progreso.actividad_completada;
      }

      const { data: actividades } = await supabaseEstudiante
        .from("actividades")
        .select("config_json, grupo_variante, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "sopa_letras");

      const actividad = elegirActividad(actividades ?? [], actividadYaCompletada);
      setSopaConfig(actividad?.config_json as SopaLetrasConfig | undefined);

      const { data: quizActividades } = await supabaseEstudiante
        .from("actividades")
        .select("config_json, grupo_variante, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "quiz");

      const quizActividad = elegirActividad(quizActividades ?? [], actividadYaCompletada);
      setQuizConfig(quizActividad?.config_json as QuizConfig | undefined);

      const { data: conectoresActividades } = await supabaseEstudiante
        .from("actividades")
        .select("config_json, grupo_variante, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "conectores");

      const conectoresActividad = elegirActividad(conectoresActividades ?? [], actividadYaCompletada);
      setConectoresConfig(conectoresActividad?.config_json as ConectoresConfig | undefined);

      const { data: clasificacionActividades } = await supabaseEstudiante
        .from("actividades")
        .select("config_json, grupo_variante, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "clasificacion");

      const clasificacionActividad = elegirActividad(clasificacionActividades ?? [], actividadYaCompletada);
      setClasificacionConfig(clasificacionActividad?.config_json as ClasificacionConfig | undefined);

      const { data: scenarioActividades } = await supabaseEstudiante
        .from("actividades")
        .select("config_json, grupo_variante, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "scenario");

      const scenarioActividad = elegirActividad(scenarioActividades ?? [], actividadYaCompletada);
      setReflexionConfig(scenarioActividad?.config_json as ReflexionConfig | undefined);

      setCargando(false);
    }
    cargar();
  }, [params.topicId]);

  const colorTitulo = esOscuro ? "#ffffff" : "#160B24";
  const colorSecundario = esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.55)";
  const cardBg = esOscuro ? "rgba(255,255,255,0.05)" : "rgba(22,11,36,0.03)";
  const cardBorder = esOscuro ? "rgba(255,255,255,0.08)" : "rgba(22,11,36,0.08)";

  return (
    <main className="max-w-2xl mx-auto p-6">
      {cargando ? (
        <p className="text-sm" style={{ color: colorSecundario }}>Cargando tema...</p>
      ) : (
        <>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0 }}
            className="text-3xl font-bold mb-4"
            style={{ color: colorTitulo }}
          >
            {tema?.titulo}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.06 }}
          >
            <ProgresoLectura temaId={params.topicId} />
          </motion.div>

          {/* Lectura */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <p
              className="text-lg leading-relaxed whitespace-pre-line"
              style={{ color: colorTitulo }}
            >
              {tema?.contenido_lectura}
            </p>
          </motion.div>

          {sopaConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.28 }}
              className="mt-4"
            >
              <Separador emoji="🔤" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Sopa de letras
              </h2>
              <WordSearch config={sopaConfig} temaId={params.topicId} />
            </motion.div>
          )}

          {quizConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.36 }}
              className="mt-4"
            >
              <Separador emoji="❓" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Quiz
              </h2>
              <Quiz config={quizConfig} temaId={params.topicId} />
            </motion.div>
          )}

          {conectoresConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.4 }}
              className="mt-4"
            >
              <Separador emoji="🔗" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Conectores
              </h2>
              <Conectores config={conectoresConfig} temaId={params.topicId} />
            </motion.div>
          )}

          {clasificacionConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.42 }}
              className="mt-4"
            >
              <Separador emoji="⚖️" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Clasificación
              </h2>
              <Clasificacion config={clasificacionConfig} temaId={params.topicId} />
            </motion.div>
          )}

          {reflexionConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.44 }}
              className="mt-4"
            >
              <Separador emoji="💭" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Reflexión
              </h2>
              <Reflexion config={reflexionConfig} temaId={params.topicId} />
            </motion.div>
          )}
        </>
      )}
    </main>
  );
}
