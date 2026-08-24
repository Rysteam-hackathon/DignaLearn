import Link from "next/link";
import { supabase } from "@/lib/supabase";
import WordSearch from "@/components/games/WordSearch";
import Quiz from "@/components/games/Quiz";

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

export default async function TemaPage({
  params,
}: {
  params: { unitId: string; topicId: string };
}) {
  const { data: tema } = await supabase
    .from("temas")
    .select("titulo, contenido_lectura")
    .eq("id", params.topicId)
    .single();

  const { data: actividades } = await supabase
    .from("actividades")
    .select("config_json, tipos_actividad!inner(nombre)")
    .eq("tema_id", params.topicId)
    .eq("tipos_actividad.nombre", "sopa_letras");

  const actividad =
    actividades && actividades.length > 0
      ? actividades[Math.floor(Math.random() * actividades.length)]
      : null;

  const sopaConfig = actividad?.config_json as SopaLetrasConfig | undefined;

  const { data: quizActividades } = await supabase
    .from("actividades")
    .select("config_json, tipos_actividad!inner(nombre)")
    .eq("tema_id", params.topicId)
    .eq("tipos_actividad.nombre", "quiz");

  const quizActividad =
    quizActividades && quizActividades.length > 0
      ? quizActividades[Math.floor(Math.random() * quizActividades.length)]
      : null;

  const quizConfig = quizActividad?.config_json as QuizConfig | undefined;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link
        href={`/niveles/${params.unitId}`}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Volver a Temas
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-3">{tema?.titulo}</h1>

      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">1 de 3 elementos</p>
        <div className="w-full h-2 rounded-full bg-gray-200">
          <div className="h-2 rounded-full bg-blue-500" style={{ width: "33%" }} />
        </div>
      </div>

      <p className="text-base leading-relaxed whitespace-pre-line">
        {tema?.contenido_lectura}
      </p>

      {sopaConfig && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Sopa de letras</h2>
          <WordSearch config={sopaConfig} />
        </div>
      )}

      {quizConfig && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Quiz</h2>
          <Quiz config={quizConfig} />
        </div>
      )}
    </main>
  );
}
