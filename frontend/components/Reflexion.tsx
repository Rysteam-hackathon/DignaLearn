"use client";

import { useState } from "react";
import { getEstudianteLocal } from "@/lib/auth";
import {
  marcarElementoCompletado,
  PROGRESO_ACTUALIZADO_EVENT,
  type ProgresoTema,
} from "@/lib/progress";

interface ReflexionOption {
  id: string;
  texto: string;
}

interface ReflexionConfig {
  pregunta: string;
  opciones: ReflexionOption[];
  respuesta_correcta: string;
  dato_extra: string;
}

interface ReflexionProps {
  temaId: string;
  config: ReflexionConfig;
}

export default function Reflexion({ temaId, config }: ReflexionProps) {
  const { pregunta, opciones, respuesta_correcta, dato_extra } = config;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [temaDominado, setTemaDominado] = useState(false);

  const esCorrecta = respondida && selectedId === respuesta_correcta;

  function handleSelect(id: string) {
    if (respondida) return;
    setSelectedId(id);
  }

  function handleResponder() {
    if (!selectedId) return;
    setRespondida(true);

    const estudiante = getEstudianteLocal();
    if (!estudiante) return;

    marcarElementoCompletado(estudiante.id, temaId, "reflexion")
      .then((progreso: ProgresoTema) => {
        window.dispatchEvent(new Event(PROGRESO_ACTUALIZADO_EVENT));
        if (
          progreso.lectura_completada &&
          progreso.actividad_completada &&
          progreso.reflexion_respondida
        ) {
          setTemaDominado(true);
        }
      })
      .catch(() => {
        // no bloqueamos la UI si falla el guardado de progreso
      });
  }

  function optionClass(opcion: ReflexionOption): string {
    const isSelected = selectedId === opcion.id;

    if (!respondida) {
      return isSelected
        ? "border-gray-800 bg-gray-100"
        : "border-gray-300 bg-white hover:bg-gray-50";
    }

    const isCorrecta = opcion.id === respuesta_correcta;
    if (isCorrecta) return "border-transparent bg-[#A4CDD5]";
    if (isSelected && !isCorrecta) return "border-transparent bg-[#F0A8B6]";
    return "border-gray-300 bg-white opacity-60";
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
            disabled={respondida}
            className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${optionClass(
              opcion
            )}`}
          >
            {opcion.texto}
          </button>
        ))}
      </div>

      {!respondida ? (
        <button
          type="button"
          onClick={handleResponder}
          disabled={!selectedId}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Responder
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: esCorrecta ? "#A4CDD5" : "#F0A8B6" }}
          >
            <p className="text-sm font-semibold text-gray-900">
              {esCorrecta ? "¡Correcto!" : "Incorrecto"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500 mb-1">Dato extra</p>
            <p className="text-sm text-gray-800">{dato_extra}</p>
          </div>

          {temaDominado && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-2">
              <span className="text-xl" aria-hidden>
                ⭐
              </span>
              <p className="text-sm font-semibold text-amber-700">¡Tema dominado!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
