"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal } from "@/lib/auth";

interface Tema {
  id: string;
  titulo: string;
  orden: number;
}

interface UnidadInfo {
  titulo: string;
  numero_unidad: number;
}

export default function UnidadPage({ params }: { params: { unitId: string } }) {
  const [unidad, setUnidad] = useState<UnidadInfo | null>(null);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [completados, setCompletados] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const estudiante = getEstudianteLocal();

      const { data: unidadData } = await supabase
        .from("unidades")
        .select("titulo, numero_unidad")
        .eq("id", params.unitId)
        .maybeSingle();

      setUnidad(unidadData);

      const { data: temasData } = await supabase
        .from("temas")
        .select("id, titulo, orden")
        .eq("unidad_id", params.unitId)
        .order("orden", { ascending: true });

      setTemas(temasData ?? []);

      if (estudiante && temasData?.length) {
        const temaIds = temasData.map((t) => t.id);
        const { data: progresos } = await supabase
          .from("progreso_estudiante")
          .select("tema_id, lectura_completada, actividad_completada, reflexion_respondida")
          .eq("estudiante_id", estudiante.id)
          .in("tema_id", temaIds);

        setCompletados(
          new Set(
            (progresos ?? [])
              .filter((p) => p.lectura_completada && p.actividad_completada && p.reflexion_respondida)
              .map((p) => p.tema_id)
          )
        );
      }

      setCargando(false);
    }
    cargar();
  }, [params.unitId]);

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <style>{`
        @keyframes entrar {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tema-card {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }
        .tema-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(240, 168, 182, 0.15);
        }
      `}</style>

      <Link
        href="/niveles"
        className="text-sm font-medium hover:underline"
        style={{ color: "#A4CDD5" }}
      >
        ← Volver a Unidades
      </Link>

      <div style={{ animation: "entrar 500ms ease forwards" }} className="mt-3 mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#F0A8B6" }}>
          {unidad ? `Unidad ${unidad.numero_unidad}` : "Cargando..."}
        </p>
        <h1 className="text-3xl font-bold" style={{ color: "#160B24" }}>
          {unidad?.titulo ?? "Temas"}
        </h1>
      </div>

      {cargando ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ backgroundColor: "rgba(22,11,36,0.06)" }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {temas.map((tema, idx) => {
            const completado = completados.has(tema.id);
            return (
              <Link
                key={tema.id}
                href={`/niveles/${params.unitId}/${tema.id}`}
                className="tema-card block rounded-2xl p-5"
                style={{
                  backgroundColor: completado ? "rgba(164,205,213,0.1)" : "rgba(22,11,36,0.03)",
                  border: `1.5px solid ${completado ? "rgba(164,205,213,0.35)" : "rgba(22,11,36,0.08)"}`,
                  animation: `entrar ${400 + idx * 100}ms ease forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      backgroundColor: completado ? "#A4CDD5" : "#F0A8B6",
                      color: "#160B24",
                    }}
                  >
                    {tema.orden}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold" style={{ color: "#160B24" }}>
                      {tema.titulo}
                    </h2>
                    <p
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: completado ? "#0F6E56" : "#9CA3AF" }}
                    >
                      {completado ? "✓ Completado" : "Pendiente"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
