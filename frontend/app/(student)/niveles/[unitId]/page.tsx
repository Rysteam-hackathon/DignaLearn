"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [esOscuro, setEsOscuro] = useState(false);
  const [temaShakeId, setTemaShakeId] = useState<string | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const detectar = () => setEsOscuro(document.documentElement.classList.contains("dark"));
    detectar();
    const observer = new MutationObserver(detectar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  function handleTemaBloqueadoClick(temaId: string) {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    setTemaShakeId(temaId);
    shakeTimeoutRef.current = setTimeout(() => setTemaShakeId(null), 1500);
  }

  const colorTitulo = esOscuro ? "#ffffff" : "#160B24";
  const cardBg = esOscuro ? "rgba(255,255,255,0.05)" : "rgba(22,11,36,0.03)";
  const cardBorder = esOscuro ? "rgba(255,255,255,0.08)" : "rgba(22,11,36,0.1)";
  const skeletonBg = esOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.06)";

  const colorTituloBloqueado = esOscuro ? "rgba(255,255,255,0.35)" : "rgba(22,11,36,0.35)";
  const cardBgBloqueado = esOscuro ? "rgba(255,255,255,0.02)" : "rgba(22,11,36,0.02)";
  const cardBorderBloqueado = esOscuro ? "rgba(255,255,255,0.05)" : "rgba(22,11,36,0.06)";
  const lockBadgeBg = esOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.06)";

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
        <h1 className="text-3xl font-bold" style={{ color: colorTitulo }}>
          {unidad?.titulo ?? "Temas"}
        </h1>
      </div>

      {cargando ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ backgroundColor: skeletonBg }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {temas.map((tema, idx) => {
            const completado = completados.has(tema.id);
            const bloqueado = idx > 0 && !completados.has(temas[idx - 1].id);

            if (bloqueado) {
              return (
                <div key={tema.id} className="relative">
                  <motion.div
                    role="button"
                    aria-disabled="true"
                    tabIndex={0}
                    onClick={() => handleTemaBloqueadoClick(tema.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleTemaBloqueadoClick(tema.id);
                    }}
                    animate={temaShakeId === tema.id ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="tema-card block rounded-2xl p-5 cursor-not-allowed select-none"
                    style={{
                      backgroundColor: cardBgBloqueado,
                      border: `1px solid ${cardBorderBloqueado}`,
                      animation: `entrar ${400 + idx * 100}ms ease forwards`,
                      opacity: 0,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: lockBadgeBg, color: colorTituloBloqueado }}
                      >
                        🔒
                      </div>
                      <div className="flex-1">
                        <h2 className="text-base font-bold" style={{ color: colorTituloBloqueado }}>
                          {tema.titulo}
                        </h2>
                        <span
                          className="inline-block text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: lockBadgeBg, color: colorTituloBloqueado }}
                        >
                          🔒 Bloqueado
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {temaShakeId === tema.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg z-10 whitespace-nowrap"
                        style={{ backgroundColor: "#160B24", color: "#ffffff" }}
                      >
                        Completá el tema anterior primero
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={tema.id}
                href={`/niveles/${params.unitId}/${tema.id}`}
                className="tema-card block rounded-2xl p-5"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  animation: `entrar ${400 + idx * 100}ms ease forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
                  >
                    {tema.orden}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold" style={{ color: colorTitulo }}>
                      {tema.titulo}
                    </h2>
                    <span
                      className="inline-block text-xs font-semibold mt-1 px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: completado ? "rgba(164,205,213,0.2)" : "rgba(240,168,182,0.15)",
                        color: completado ? "#A4CDD5" : "#F0A8B6",
                      }}
                    >
                      {completado ? "✓ Completado" : "Pendiente"}
                    </span>
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
