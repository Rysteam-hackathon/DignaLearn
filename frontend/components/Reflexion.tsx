"use client";

import { useState, useCallback, useEffect, type CSSProperties } from "react";
import { getEstudianteLocal } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import {
  marcarElementoCompletado,
  registrarActividadDiaria,
  PROGRESO_ACTUALIZADO_EVENT,
  type ProgresoTema,
} from "@/lib/progress";
import LogroCelebracion, { type Logro } from "@/components/LogroCelebracion";

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

interface LogroApiResponse {
  id: string;
  titulo: string;
  descripcion: string | null;
  icono_url: string | null;
  tipo_condicion: string;
  nivel_nombre: string | null;
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

export default function Reflexion({ temaId, config }: ReflexionProps) {
  const { pregunta, opciones, respuesta_correcta, dato_extra } = config;
  const esOscuro = useModoOscuro();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [temaDominado, setTemaDominado] = useState(false);
  const [logrosQueue, setLogrosQueue] = useState<Logro[]>([]);

  const esCorrecta = respondida && selectedId === respuesta_correcta;

  function handleSelect(id: string) {
    if (respondida) return;
    setSelectedId(id);
  }

  const handleLogroCierre = useCallback(() => {
    setTimeout(() => {
      setLogrosQueue((prev) => prev.slice(1));
    }, 500);
  }, []);

  async function evaluarLogros(estudianteId: string) {
    try {
      const res = await apiFetch(
        `/api/gamification/evaluar/${estudianteId}`,
        {
          method: "POST",
          body: JSON.stringify({ tema_id: temaId }),
        }
      );
      if (!res.ok) return;
      const data: LogroApiResponse[] = await res.json();
      const logros: Logro[] = data.map((item) => ({
        id: item.id,
        titulo: item.titulo,
        descripcion: item.descripcion,
        icono_url: item.icono_url,
        tipo_condicion: item.tipo_condicion,
        nivel: item.nivel_nombre ?? "tema",
      }));
      if (logros.length > 0) {
        setLogrosQueue(logros);
      }
    } catch {
      // no bloqueamos la UI si falla la evaluación de logros
    }
  }

  function handleResponder() {
    if (!selectedId) return;
    setRespondida(true);

    const estudiante = getEstudianteLocal();
    if (!estudiante) return;

    marcarElementoCompletado(estudiante.id, temaId, "reflexion")
      .then(async (progreso: ProgresoTema) => {
        window.dispatchEvent(new Event(PROGRESO_ACTUALIZADO_EVENT));

        // Registrar actividad del día (alimenta la racha diaria)
        await registrarActividadDiaria(estudiante.id).catch(() => {});

        if (
          progreso.lectura_completada &&
          progreso.actividad_completada &&
          progreso.reflexion_respondida
        ) {
          setTemaDominado(true);
          // Evaluar y mostrar logros desbloqueados
          await evaluarLogros(estudiante.id);
        }
      })
      .catch(() => {});
  }

  function optionStyle(opcion: ReflexionOption): CSSProperties {
    const isSelected = selectedId === opcion.id;

    if (!respondida) {
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
    <>
      {logrosQueue.length > 0 && (
        <LogroCelebracion
          key={logrosQueue[0].id}
          logro={logrosQueue[0]}
          onClose={handleLogroCierre}
        />
      )}

      <div className="max-w-xl">
        <style>{`
          @keyframes reflexion-entrar {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .reflexion-opcion {
            animation: reflexion-entrar 350ms ease forwards;
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
              disabled={respondida}
              className="reflexion-opcion text-left px-4 py-3 rounded-lg border text-sm transition-colors"
              style={{ ...optionStyle(opcion), animationDelay: `${idx * 80}ms` }}
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
            className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
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

            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: esOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.03)",
                border: esOscuro ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(22,11,36,0.08)",
              }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.4)" }}
              >
                Dato extra
              </p>
              <p className="text-sm" style={{ color: esOscuro ? "#ffffff" : "#160B24" }}>
                {dato_extra}
              </p>
            </div>

            {temaDominado && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  ⭐
                </span>
                <p className="text-sm font-semibold text-amber-700">
                  ¡Tema dominado!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
