"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { getEstudianteLocal } from "@/lib/auth";
import { marcarElementoCompletado, PROGRESO_ACTUALIZADO_EVENT } from "@/lib/progress";

interface QuizOption {
  id: string;
  texto: string;
}

interface QuizConfig {
  pregunta: string;
  opciones: QuizOption[];
  respuesta_correcta: string;
  retroalimentacion: string;
}

interface QuizProps {
  config: QuizConfig;
  temaId: string;
}

function useModoOscuro(): boolean {
  const [esOscuro, setEsOscuro] = useState(false);

  useEffect(() => {
    const detectar = () => setEsOscuro(document.documentElement.classList.contains("dark"));
    detectar();

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", detectar);

    const observer = new MutationObserver(detectar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mq.removeEventListener("change", detectar);
      observer.disconnect();
    };
  }, []);

  return esOscuro;
}

export default function Quiz({ config, temaId }: QuizProps) {
  const { pregunta, opciones, respuesta_correcta, retroalimentacion } = config;
  const esOscuro = useModoOscuro();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const esCorrecta = confirmed && selectedId === respuesta_correcta;

  function handleSelect(id: string) {
    if (confirmed) return;
    setSelectedId(id);
  }

  function handleConfirmar() {
    if (!selectedId) return;
    setConfirmed(true);

    const estudiante = getEstudianteLocal();
    if (estudiante) {
      marcarElementoCompletado(estudiante.id, temaId, "actividad")
        .then(() => {
          window.dispatchEvent(new Event(PROGRESO_ACTUALIZADO_EVENT));
        })
        .catch(() => {
          // no bloqueamos la UI si falla el guardado de progreso
        });
    }
  }

  function optionStyle(opcion: QuizOption): CSSProperties {
    const isSelected = selectedId === opcion.id;

    if (!confirmed) {
      if (isSelected) {
        return {
          backgroundColor: "rgba(240,168,182,0.2)",
          borderColor: "#F0A8B6",
          color: esOscuro ? "#ffffff" : "#160B24",
        };
      }
      return esOscuro
        ? { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "#ffffff" }
        : { backgroundColor: "rgba(22,11,36,0.05)", borderColor: "rgba(22,11,36,0.15)", color: "#160B24" };
    }

    const isCorrecta = opcion.id === respuesta_correcta;
    if (isCorrecta) {
      return { backgroundColor: "#A4CDD5", borderColor: "transparent", color: "#160B24" };
    }
    if (isSelected && !isCorrecta) {
      return {
        backgroundColor: "rgba(239,68,68,0.15)",
        borderColor: "rgba(239,68,68,0.3)",
        color: esOscuro ? "#ffffff" : "#160B24",
      };
    }
    return {
      backgroundColor: esOscuro ? "rgba(255,255,255,0.08)" : "rgba(22,11,36,0.05)",
      borderColor: esOscuro ? "rgba(255,255,255,0.15)" : "rgba(22,11,36,0.15)",
      color: esOscuro ? "#ffffff" : "#160B24",
      opacity: esOscuro ? 0.35 : 0.4,
    };
  }

  return (
    <div className="max-w-xl">
      <style>{`
        @keyframes quiz-entrar {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .quiz-opcion {
          animation: quiz-entrar 350ms ease forwards;
          opacity: 0;
        }
      `}</style>

      <p className="text-base font-medium mb-4" style={{ color: esOscuro ? "#ffffff" : "#160B24" }}>
        {pregunta}
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {opciones.map((opcion, idx) => (
          <button
            key={opcion.id}
            type="button"
            onClick={() => handleSelect(opcion.id)}
            disabled={confirmed}
            className="quiz-opcion text-left px-4 py-3 rounded-lg border text-sm transition-colors"
            style={{ ...optionStyle(opcion), animationDelay: `${idx * 80}ms` }}
          >
            {opcion.texto}
          </button>
        ))}
      </div>

      {!confirmed ? (
        <button
          type="button"
          onClick={handleConfirmar}
          disabled={!selectedId}
          className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
        >
          Confirmar respuesta
        </button>
      ) : (
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: esCorrecta ? "#A4CDD5" : "#F0A8B6" }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: "#160B24" }}>
            {esCorrecta ? "¡Correcto!" : "Incorrecto"}
          </p>
          <p className="text-sm" style={{ color: "#160B24" }}>{retroalimentacion}</p>
        </div>
      )}
    </div>
  );
}
