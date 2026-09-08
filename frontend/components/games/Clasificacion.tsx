"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getEstudianteLocal } from "@/lib/auth";
import { marcarElementoCompletado, mapLogrosDesbloqueados, PROGRESO_ACTUALIZADO_EVENT } from "@/lib/progress";
import LogroCelebracion, { type Logro } from "@/components/LogroCelebracion";
import ToastError from "@/components/ToastError";

const MENSAJE_ERROR_GUARDADO = "No se pudo guardar tu progreso, verificá tu conexión.";

interface Situacion {
  texto: string;
  es_correcto: boolean;
  explicacion: string;
}

interface ClasificacionConfig {
  situaciones: Situacion[];
}

interface ClasificacionProps {
  config: ClasificacionConfig;
  temaId: string;
}

const TIEMPO_FEEDBACK_MS = 1800;

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

export default function Clasificacion({ config, temaId }: ClasificacionProps) {
  const { situaciones } = config;
  const esOscuro = useModoOscuro();

  const [indice, setIndice] = useState(0);
  const [respuesta, setRespuesta] = useState<boolean | null>(null);
  const [completado, setCompletado] = useState(false);
  const [progresoGuardado, setProgresoGuardado] = useState(false);
  const [logrosQueue, setLogrosQueue] = useState<Logro[]>([]);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);
  // Ref, no state: se muta de forma síncrona en el momento del click, sin la
  // ventana de carrera que tiene `respuesta` (estado de React, actualiza
  // recién en el próximo render). Un doble-click/doble-toque muy rápido — o
  // tocar los dos botones casi a la vez — podía colar una segunda llamada a
  // handleResponder mientras `respuesta` seguía leyendo null, disparando dos
  // setTimeout que avanzaban el índice dos veces y saltaban una situación.
  const respondiendoRef = useRef(false);
  const avanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (avanceTimeoutRef.current) clearTimeout(avanceTimeoutRef.current);
    };
  }, []);

  const handleLogroCierre = useCallback(() => {
    setTimeout(() => {
      setLogrosQueue((prev) => prev.slice(1));
    }, 500);
  }, []);

  const situacionActual = situaciones[indice];
  const enFeedback = respuesta !== null;
  const acerto = enFeedback && respuesta === situacionActual.es_correcto;

  function handleResponder(valor: boolean) {
    if (respondiendoRef.current) return;
    respondiendoRef.current = true;
    setRespuesta(valor);

    avanceTimeoutRef.current = setTimeout(() => {
      if (indice + 1 < situaciones.length) {
        setIndice((i) => i + 1);
        setRespuesta(null);
        respondiendoRef.current = false;
      } else {
        setCompletado(true);
      }
    }, TIEMPO_FEEDBACK_MS);
  }

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
        console.error("Error al guardar progreso (Clasificacion):", error);
        setErrorGuardado(MENSAJE_ERROR_GUARDADO);
      });
  }, [completado, progresoGuardado, temaId]);

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

      <div className="max-w-xl">
        <p className="text-sm mb-3" style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.5)" }}>
          Situación {Math.min(indice + 1, situaciones.length)} de {situaciones.length}
        </p>

        {!completado && (
          <AnimatePresence mode="wait">
            <motion.div
              key={indice}
              initial={{ opacity: 0, x: 60, rotate: 6 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -60, rotate: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: esOscuro ? "rgba(255,255,255,0.05)" : "rgba(22,11,36,0.03)",
                border: `1px solid ${esOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.1)"}`,
              }}
            >
              {!enFeedback ? (
                <>
                  <p className="text-base font-medium mb-6" style={{ color: esOscuro ? "#ffffff" : "#160B24" }}>
                    {situacionActual.texto}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => handleResponder(true)}
                      className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: "#A4CDD5", color: "#160B24" }}
                    >
                      Respeta el derecho
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResponder(false)}
                      className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
                    >
                      Viola el derecho
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl"
                    style={{ backgroundColor: acerto ? "#A4CDD5" : "#F0A8B6", color: "#160B24" }}
                  >
                    {acerto ? "✓" : "✗"}
                  </motion.div>
                  <p className="text-sm font-semibold mb-2" style={{ color: esOscuro ? "#ffffff" : "#160B24" }}>
                    {acerto ? "¡Correcto!" : "No exactamente"}
                  </p>
                  <p className="text-sm" style={{ color: esOscuro ? "rgba(255,255,255,0.7)" : "rgba(22,11,36,0.7)" }}>
                    {situacionActual.explicacion}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {completado && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-emerald-600"
          >
            ¡Clasificaste todas las situaciones!
          </motion.p>
        )}
      </div>
    </>
  );
}
