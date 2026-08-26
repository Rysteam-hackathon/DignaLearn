"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal } from "@/lib/auth";

interface Unidad {
  id: string;
  titulo: string;
  numero_unidad: number;
}

const ICONOS_UNIDAD = ["🌸", "⚖️", "🤝", "🌟"];
const COLORES_UNIDAD = [
  { bg: "rgba(240,168,182,0.1)", border: "rgba(240,168,182,0.3)", accent: "#F0A8B6" },
  { bg: "rgba(164,205,213,0.1)", border: "rgba(164,205,213,0.3)", accent: "#A4CDD5" },
  { bg: "rgba(240,168,182,0.08)", border: "rgba(240,168,182,0.2)", accent: "#F0A8B6" },
  { bg: "rgba(164,205,213,0.08)", border: "rgba(164,205,213,0.2)", accent: "#A4CDD5" },
];

export default function NivelesPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [gradoNombre, setGradoNombre] = useState<string>("");

  useEffect(() => {
    async function cargarUnidades() {
      const estudiante = getEstudianteLocal();
      if (!estudiante) { setCargando(false); return; }

      const { data: grado } = await supabase
        .from("grados")
        .select("numero_grado, nivel")
        .eq("id", estudiante.grado_id)
        .maybeSingle();

      if (grado) setGradoNombre(`${grado.numero_grado}mo grado — ${grado.nivel}`);

      const { data } = await supabase
        .from("unidades")
        .select("id, titulo, numero_unidad")
        .eq("grado_id", estudiante.grado_id)
        .order("numero_unidad", { ascending: true });

      setUnidades(data ?? []);
      setCargando(false);
    }
    cargarUnidades();
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <style>{`
        @keyframes entrar {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .unidad-card {
          transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;
          cursor: pointer;
        }
        .unidad-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 16px 40px rgba(240, 168, 182, 0.15);
        }
      `}</style>

      {/* Header */}
      <div style={{ animation: "entrar 500ms ease forwards" }} className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#F0A8B6" }}>
          {gradoNombre || "Cargando..."}
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "#160B24" }}>
          Tus unidades
        </h1>
        <p className="text-sm mt-2 text-gray-400">
          Completá cada unidad para desbloquear logros y avanzar en tu aprendizaje.
        </p>
      </div>

      {cargando ? (
        <div className="flex flex-col gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="rounded-2xl h-28 animate-pulse" style={{ backgroundColor: "rgba(22,11,36,0.06)" }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {unidades.map((unidad, idx) => {
            const color = COLORES_UNIDAD[idx % COLORES_UNIDAD.length];
            const icono = ICONOS_UNIDAD[idx % ICONOS_UNIDAD.length];
            return (
              <Link
                key={unidad.id}
                href={`/niveles/${unidad.id}`}
                className="unidad-card block rounded-2xl p-6"
                style={{
                  backgroundColor: color.bg,
                  border: `1.5px solid ${color.border}`,
                  animation: `entrar ${400 + idx * 100}ms ease forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex items-center gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: color.border }}
                  >
                    {icono}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: color.accent }}>
                      Unidad {unidad.numero_unidad}
                    </p>
                    <h2 className="text-lg font-bold" style={{ color: "#160B24" }}>
                      {unidad.titulo}
                    </h2>
                  </div>
                  <div className="text-2xl opacity-30" style={{ color: color.accent }}>→</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
