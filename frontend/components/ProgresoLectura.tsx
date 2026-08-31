"use client";

import { useCallback, useEffect, useState } from "react";
import { getEstudianteLocal } from "@/lib/auth";
import {
  marcarElementoCompletado,
  mapLogrosDesbloqueados,
  obtenerProgresoPorTema,
  PROGRESO_ACTUALIZADO_EVENT,
  type ProgresoTema,
} from "@/lib/progress";
import LogroCelebracion, { type Logro } from "@/components/LogroCelebracion";

interface ProgresoLecturaProps {
  temaId: string;
}

export default function ProgresoLectura({ temaId }: ProgresoLecturaProps) {
  const [estudianteId, setEstudianteId] = useState<string | null>(null);
  const [progreso, setProgreso] = useState<ProgresoTema | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [esOscuro, setEsOscuro] = useState(false);
  const [logrosQueue, setLogrosQueue] = useState<Logro[]>([]);

  const handleLogroCierre = useCallback(() => {
    setTimeout(() => {
      setLogrosQueue((prev) => prev.slice(1));
    }, 500);
  }, []);

  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const obs = new MutationObserver(actualizar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const estudiante = getEstudianteLocal();
    if (estudiante) {
      setEstudianteId(estudiante.id);
    }
  }, []);

  const refrescarProgreso = useCallback(() => {
    if (!estudianteId) return;
    obtenerProgresoPorTema(estudianteId, temaId).then(setProgreso);
  }, [estudianteId, temaId]);

  useEffect(() => {
    refrescarProgreso();
  }, [refrescarProgreso]);

  useEffect(() => {
    window.addEventListener(PROGRESO_ACTUALIZADO_EVENT, refrescarProgreso);
    return () => {
      window.removeEventListener(PROGRESO_ACTUALIZADO_EVENT, refrescarProgreso);
    };
  }, [refrescarProgreso]);

  async function handleMarcarLectura() {
    if (!estudianteId || guardando) return;
    setGuardando(true);
    try {
      console.log("Marcando lectura como completada...");
      const actualizado = await marcarElementoCompletado(estudianteId, temaId, "lectura");
      console.log("Progreso actualizado:", actualizado);
      setProgreso(actualizado);
      window.dispatchEvent(new Event(PROGRESO_ACTUALIZADO_EVENT));

      // El backend evalúa los logros en la misma llamada si este elemento
      // deja los 3 flags en true, sin importar el orden en que se completaron.
      console.log("Logros recibidos:", actualizado.logros_desbloqueados);
      if (actualizado.logros_desbloqueados.length > 0) {
        setLogrosQueue(mapLogrosDesbloqueados(actualizado.logros_desbloqueados));
      }
    } catch (error) {
      console.error("Error al marcar lectura:", error);
    } finally {
      setGuardando(false);
    }
  }

  const completados = progreso
    ? [
        progreso.lectura_completada,
        progreso.actividad_completada,
        progreso.reflexion_respondida,
      ].filter(Boolean).length
    : 0;

  const colorSecundario = esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)";
  const trackBg = esOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.08)";

  return (
    <div className="mb-6">
      {logrosQueue.length > 0 && (
        <LogroCelebracion
          key={logrosQueue[0].id}
          logro={logrosQueue[0]}
          onClose={handleLogroCierre}
        />
      )}

      <p className="text-sm mb-1" style={{ color: colorSecundario }}>{completados} de 3 elementos</p>
      <div className="w-full h-2 rounded-full" style={{ backgroundColor: trackBg }}>
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${(completados / 3) * 100}%`, backgroundColor: "#F0A8B6" }}
        />
      </div>

      {estudianteId ? (
        <button
          type="button"
          onClick={handleMarcarLectura}
          disabled={guardando || progreso?.lectura_completada}
          className="mt-3 rounded-lg text-sm font-semibold px-4 py-2 disabled:opacity-50"
          style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
        >
          {progreso?.lectura_completada
            ? "Lectura completada"
            : guardando
            ? "Guardando..."
            : "Marcar lectura como completada"}
        </button>
      ) : (
        <p className="mt-3 text-sm" style={{ color: colorSecundario }}>
          Iniciá sesión como estudiante para guardar tu progreso.
        </p>
      )}
    </div>
  );
}
