"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import WordSearch from "@/components/games/WordSearch";
import Quiz from "@/components/games/Quiz";
import ProgresoLectura from "@/components/ProgresoLectura";
import Reflexion from "@/components/Reflexion";

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
  const [reflexionConfig, setReflexionConfig] = useState<ReflexionConfig | undefined>();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data: temaData } = await supabase
        .from("temas")
        .select("titulo, contenido_lectura")
        .eq("id", params.topicId)
        .maybeSingle();
      setTema(temaData);

      const { data: actividades } = await supabase
        .from("actividades")
        .select("config_json, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "sopa_letras");

      const actividad =
        actividades && actividades.length > 0
          ? actividades[Math.floor(Math.random() * actividades.length)]
          : null;
      setSopaConfig(actividad?.config_json as SopaLetrasConfig | undefined);

      const { data: quizActividades } = await supabase
        .from("actividades")
        .select("config_json, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "quiz");

      const quizActividad =
        quizActividades && quizActividades.length > 0
          ? quizActividades[Math.floor(Math.random() * quizActividades.length)]
          : null;
      setQuizConfig(quizActividad?.config_json as QuizConfig | undefined);

      const { data: scenarioActividades } = await supabase
        .from("actividades")
        .select("config_json, tipos_actividad!inner(nombre)")
        .eq("tema_id", params.topicId)
        .eq("tipos_actividad.nombre", "scenario");

      const scenarioActividad =
        scenarioActividades && scenarioActividades.length > 0
          ? scenarioActividades[Math.floor(Math.random() * scenarioActividades.length)]
          : null;
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
      <style>{`
        @keyframes tema-entrar {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tema-seccion {
          animation: tema-entrar 450ms ease forwards;
          opacity: 0;
        }
      `}</style>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-4 flex-wrap" style={{ color: colorSecundario }}>
        <Link href="/niveles" className="hover:underline" style={{ color: "#A4CDD5" }}>
          Niveles
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/niveles/${params.unitId}`} className="hover:underline" style={{ color: "#A4CDD5" }}>
          Temas
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate max-w-[160px]" style={{ color: colorSecundario }}>
          {tema?.titulo ?? "..."}
        </span>
      </nav>

      {cargando ? (
        <p className="text-sm" style={{ color: colorSecundario }}>Cargando tema...</p>
      ) : (
        <>
          <h1
            className="tema-seccion text-3xl font-bold mb-4"
            style={{ color: colorTitulo, animationDelay: "0ms" }}
          >
            {tema?.titulo}
          </h1>

          <div className="tema-seccion" style={{ animationDelay: "60ms" }}>
            <ProgresoLectura temaId={params.topicId} />
          </div>

          {/* Lectura */}
          <div
            className="tema-seccion rounded-2xl p-6"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, animationDelay: "120ms" }}
          >
            <p
              className="text-lg leading-relaxed whitespace-pre-line"
              style={{ color: colorTitulo }}
            >
              {tema?.contenido_lectura}
            </p>
          </div>

          {sopaConfig && (
            <div className="tema-seccion mt-4" style={{ animationDelay: "180ms" }}>
              <Separador emoji="🔤" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Sopa de letras
              </h2>
              <WordSearch config={sopaConfig} temaId={params.topicId} />
            </div>
          )}

          {quizConfig && (
            <div className="tema-seccion mt-4" style={{ animationDelay: "240ms" }}>
              <Separador emoji="❓" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Quiz
              </h2>
              <Quiz config={quizConfig} temaId={params.topicId} />
            </div>
          )}

          {reflexionConfig && (
            <div className="tema-seccion mt-4" style={{ animationDelay: "300ms" }}>
              <Separador emoji="💭" esOscuro={esOscuro} />
              <h2 className="text-xl font-bold mb-4" style={{ color: colorTitulo }}>
                Reflexión
              </h2>
              <Reflexion config={reflexionConfig} temaId={params.topicId} />
            </div>
          )}
        </>
      )}
    </main>
  );
}
