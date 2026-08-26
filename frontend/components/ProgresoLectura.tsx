"use client";

import { useCallback, useEffect, useState } from "react";
import {
  marcarElementoCompletado,
  obtenerProgresoPorTema,
  PROGRESO_ACTUALIZADO_EVENT,
  type ProgresoTema,
} from "@/lib/progress";

interface EstudianteLocal {
  id: string;
  usuario_id: string;
  grado_id: number;
  codigo_acceso: string;
  nombre_display: string | null;
}

interface ProgresoLecturaProps {
  temaId: string;
}

export default function ProgresoLectura({ temaId }: ProgresoLecturaProps) {
  const [estudianteId, setEstudianteId] = useState<string | null>(null);
  const [progreso, setProgreso] = useState<ProgresoTema | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [esOscuro, setEsOscuro] = useState(false);

  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const obs = new MutationObserver(actualizar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("dignalearn_user");
    if (!raw) return;

    try {
      const estudiante = JSON.parse(raw) as EstudianteLocal;
      setEstudianteId(estudiante.id);
    } catch {
      // dignalearn_user corrupto o de otro flujo (docente): se ignora
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
      const actualizado = await marcarElementoCompletado(estudianteId, temaId, "lectura");
      setProgreso(actualizado);
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
