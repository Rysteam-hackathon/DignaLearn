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

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-500 mb-1">{completados} de 3 elementos</p>
      <div className="w-full h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all"
          style={{ width: `${(completados / 3) * 100}%` }}
        />
      </div>

      {estudianteId ? (
        <button
          type="button"
          onClick={handleMarcarLectura}
          disabled={guardando || progreso?.lectura_completada}
          className="mt-3 rounded-lg bg-gray-900 text-white text-sm px-4 py-2 disabled:opacity-50"
        >
          {progreso?.lectura_completada
            ? "Lectura completada"
            : guardando
            ? "Guardando..."
            : "Marcar lectura como completada"}
        </button>
      ) : (
        <p className="mt-3 text-sm text-gray-400">
          Iniciá sesión como estudiante para guardar tu progreso.
        </p>
      )}
    </div>
  );
}
