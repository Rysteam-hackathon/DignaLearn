"use client";

import { useState } from "react";
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

export default function Quiz({ config, temaId }: QuizProps) {
  const { pregunta, opciones, respuesta_correcta, retroalimentacion } = config;

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

  function optionClass(opcion: QuizOption): string {
    const isSelected = selectedId === opcion.id;

    if (!confirmed) {
      return isSelected
        ? "border-[#F0A8B6] bg-[#F0A8B6]/15"
        : "border-gray-200 bg-[#160B24]/[0.03] hover:bg-[#160B24]/[0.06]";
    }

    const isCorrecta = opcion.id === respuesta_correcta;
    if (isCorrecta) return "border-transparent bg-[#A4CDD5]";
    if (isSelected && !isCorrecta) return "border-transparent bg-red-400/20";
    return "border-gray-200 bg-white opacity-50";
  }

  return (
    <div className="max-w-xl">
      <p className="text-base font-medium mb-4">{pregunta}</p>

      <div className="flex flex-col gap-2 mb-4">
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            onClick={() => handleSelect(opcion.id)}
            disabled={confirmed}
            className={`text-left px-4 py-3 rounded-lg border text-sm text-[#160B24] transition-colors ${optionClass(
              opcion
            )}`}
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
          <p className="text-sm font-semibold mb-1 text-gray-900">
            {esCorrecta ? "¡Correcto!" : "Incorrecto"}
          </p>
          <p className="text-sm text-gray-900">{retroalimentacion}</p>
        </div>
      )}
    </div>
  );
}
