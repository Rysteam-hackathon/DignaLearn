"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal } from "@/lib/auth";
import LogroIcono from "@/components/LogroIcono";

interface LogroDesbloqueado {
  id: string;
  desbloqueado_en: string;
  logro: {
    titulo: string;
    descripcion: string | null;
    tipo_condicion: string;
    nivel: string;
  };
}

const NIVEL_COLORES: Record<string, string> = {
  tema: "#F0A8B6",
  unidad: "#160B24",
  especial: "#A4CDD5",
};

const NIVEL_ETIQUETA: Record<string, string> = {
  tema: "Tema",
  unidad: "Unidad",
  especial: "Especial",
};

export default function LogrosPage() {
  const [logros, setLogros] = useState<LogroDesbloqueado[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const estudiante = getEstudianteLocal();
      if (!estudiante) return;

      const { data } = await supabase
        .from("estudiante_logros")
        .select(`
          id,
          desbloqueado_en,
          logros (
            titulo,
            descripcion,
            tipo_condicion,
            niveles_logro ( nombre )
          )
        `)
        .eq("estudiante_id", estudiante.id)
        .order("desbloqueado_en", { ascending: false });

      const formateados: LogroDesbloqueado[] = (data ?? []).map((item) => {
        const logroRaw = item.logros as unknown as {
          titulo: string;
          descripcion: string | null;
          tipo_condicion: string;
          niveles_logro: { nombre: string } | null;
        } | null;

        return {
          id: item.id,
          desbloqueado_en: item.desbloqueado_en,
          logro: {
            titulo: logroRaw?.titulo ?? "",
            descripcion: logroRaw?.descripcion ?? null,
            tipo_condicion: logroRaw?.tipo_condicion ?? "",
            nivel: logroRaw?.niveles_logro?.nombre ?? "tema",
          },
        };
      });

      setLogros(formateados);
      setCargando(false);
    }
    cargar();
  }, []);

  function formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString("es-NI", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#160B24" }}>
        Mis logros
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {logros.length} {logros.length === 1 ? "logro desbloqueado" : "logros desbloqueados"}
      </p>

      {cargando ? (
        <p className="text-sm text-gray-400">Cargando logros...</p>
      ) : logros.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4" aria-hidden>🏆</p>
          <p className="text-gray-500 text-sm">Completá tu primer tema para desbloquear logros.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logros.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: NIVEL_COLORES[item.logro.nivel] + "25" }}
              >
                <LogroIcono tipo_condicion={item.logro.tipo_condicion} nivel={item.logro.nivel} size={40} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.logro.titulo}
                  </p>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: NIVEL_COLORES[item.logro.nivel] + "20",
                      color: NIVEL_COLORES[item.logro.nivel] === "#F0A8B6"
                        ? "#993556"
                        : NIVEL_COLORES[item.logro.nivel] === "#160B24"
                        ? "#160B24"
                        : "#0F6E56",
                    }}
                  >
                    {NIVEL_ETIQUETA[item.logro.nivel] ?? item.logro.nivel}
                  </span>
                </div>
                {item.logro.descripcion && (
                  <p className="text-xs text-gray-500">{item.logro.descripcion}</p>
                )}
              </div>
              <p className="text-xs text-gray-400 shrink-0">
                {formatearFecha(item.desbloqueado_en)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
