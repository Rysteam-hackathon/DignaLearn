"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getEstudianteLocal } from "@/lib/auth";
import { marcarElementoCompletado, mapLogrosDesbloqueados, PROGRESO_ACTUALIZADO_EVENT } from "@/lib/progress";
import LogroCelebracion, { type Logro } from "@/components/LogroCelebracion";
import ToastError from "@/components/ToastError";

const MENSAJE_ERROR_GUARDADO = "No se pudo guardar tu progreso, verificá tu conexión.";

interface Par {
  concepto: string;
  definicion: string;
}

interface ConectoresConfig {
  pares: Par[];
}

interface ConectoresProps {
  config: ConectoresConfig;
  temaId: string;
}

interface DefinicionItem {
  parIndex: number;
  texto: string;
}

function useModoOscuro(): boolean {
  const [esOscuro, setEsOscuro] = useState(false);
  useEffect(() => {
    const detectar = () => setEsOscuro(document.documentElement.classList.contains("dark"));
    detectar();
    const observer = new MutationObserver(detectar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return esOscuro;
}

function shuffle<T>(items: T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default function Conectores({ config, temaId }: ConectoresProps) {
  const { pares } = config;
  const esOscuro = useModoOscuro();

  const definiciones = useMemo<DefinicionItem[]>(
    () => shuffle(pares.map((par, parIndex) => ({ parIndex, texto: par.definicion }))),
    [pares]
  );

  const [conceptoSeleccionado, setConceptoSeleccionado] = useState<number | null>(null);
  const [emparejados, setEmparejados] = useState<Set<number>>(new Set());
  const [shakeConcepto, setShakeConcepto] = useState<number | null>(null);
  const [shakeDefinicion, setShakeDefinicion] = useState<number | null>(null);
  const [progresoGuardado, setProgresoGuardado] = useState(false);
  const [logrosQueue, setLogrosQueue] = useState<Logro[]>([]);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogroCierre = useCallback(() => {
    setTimeout(() => {
      setLogrosQueue((prev) => prev.slice(1));
    }, 500);
  }, []);

  function handleClickConcepto(parIndex: number) {
    if (emparejados.has(parIndex)) return;
    setConceptoSeleccionado(parIndex);
  }

  function handleClickDefinicion(defIndex: number, targetParIndex: number) {
    if (emparejados.has(targetParIndex) || conceptoSeleccionado === null) return;

    if (conceptoSeleccionado === targetParIndex) {
      setEmparejados((prev) => new Set(prev).add(targetParIndex));
      setConceptoSeleccionado(null);
      return;
    }

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    setShakeConcepto(conceptoSeleccionado);
    setShakeDefinicion(defIndex);
    shakeTimeoutRef.current = setTimeout(() => {
      setShakeConcepto(null);
      setShakeDefinicion(null);
    }, 450);
    setConceptoSeleccionado(null);
  }

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  const completado = emparejados.size === pares.length;

  useEffect(() => {
    if (!completado || progresoGuardado) return;

    const estudiante = getEstudianteLocal();
    if (!estudiante) return;

    setProgresoGuardado(true);
    marcarElementoCompletado(estudiante.id, temaId, "actividad")
      .then((actualizado) => {
        window.dispatchEvent(new Event(PROGRESO_ACTUALIZADO_EVENT));
        if (actualizado.logros_desbloqueados.length > 0) {
          setLogrosQueue(mapLogrosDesbloqueados(actualizado.logros_desbloqueados));
        }
      })
      .catch((error) => {
        console.error("Error al guardar progreso (Conectores):", error);
        setErrorGuardado(MENSAJE_ERROR_GUARDADO);
      });
  }, [completado, progresoGuardado, temaId]);

  function estiloConcepto(parIndex: number): React.CSSProperties {
    if (emparejados.has(parIndex)) {
      return { backgroundColor: "#A4CDD5", borderColor: "transparent", color: "#160B24" };
    }
    if (conceptoSeleccionado === parIndex) {
      return { backgroundColor: "rgba(240,168,182,0.2)", borderColor: "#F0A8B6", color: esOscuro ? "#ffffff" : "#160B24" };
    }
    return esOscuro
      ? { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "#ffffff" }
      : { backgroundColor: "rgba(22,11,36,0.05)", borderColor: "rgba(22,11,36,0.15)", color: "#160B24" };
  }

  function estiloDefinicion(parIndex: number): React.CSSProperties {
    if (emparejados.has(parIndex)) {
      return { backgroundColor: "#A4CDD5", borderColor: "transparent", color: "#160B24" };
    }
    return esOscuro
      ? { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "#ffffff" }
      : { backgroundColor: "rgba(22,11,36,0.05)", borderColor: "rgba(22,11,36,0.15)", color: "#160B24" };
  }

  return (
    <>
      <ToastError mensaje={errorGuardado} onCerrar={() => setErrorGuardado(null)} esOscuro={esOscuro} />

      {logrosQueue.length > 0 && (
        <LogroCelebracion
          key={logrosQueue[0].id}
          logro={logrosQueue[0]}
          onClose={handleLogroCierre}
        />
      )}

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div className="flex flex-col gap-2">
          {pares.map((par, parIndex) => (
            <motion.button
              key={`concepto-${parIndex}`}
              type="button"
              onClick={() => handleClickConcepto(parIndex)}
              disabled={emparejados.has(parIndex)}
              animate={
                shakeConcepto === parIndex
                  ? { x: [0, -8, 8, -8, 8, -4, 4, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors"
              style={estiloConcepto(parIndex)}
            >
              <span className="flex items-center gap-2">
                {emparejados.has(parIndex) && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    ✓
                  </motion.span>
                )}
                {par.concepto}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {definiciones.map((def, idx) => (
            <motion.button
              key={`def-${idx}`}
              type="button"
              onClick={() => handleClickDefinicion(idx, def.parIndex)}
              disabled={emparejados.has(def.parIndex)}
              animate={
                shakeDefinicion === idx
                  ? { x: [0, -8, 8, -8, 8, -4, 4, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="text-left px-4 py-3 rounded-lg border text-sm transition-colors"
              style={estiloDefinicion(def.parIndex)}
            >
              {def.texto}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {completado && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-emerald-600 mt-4"
          >
            ¡Completaste todos los emparejamientos!
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
