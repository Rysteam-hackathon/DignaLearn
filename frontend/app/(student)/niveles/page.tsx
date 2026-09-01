"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

// Animación específica por ícono de unidad, mismo patrón que ANIMACION_POR_ICONO en extras/page.tsx
const ANIMACION_ICONO_UNIDAD: { animate: Record<string, number[]>; duration: number; ease: "easeInOut" }[] = [
  { animate: { rotate: [-8, 8, -8] },                        duration: 3.2, ease: "easeInOut" }, // 🌸 flor
  { animate: { x: [-3, 3, -3] },                             duration: 2.8, ease: "easeInOut" }, // ⚖️ balanza
  { animate: { scale: [1, 1.12, 1] },                        duration: 2.6, ease: "easeInOut" }, // 🤝 pulse
  { animate: { rotate: [-10, 10, -10], scale: [1, 1.1, 1] }, duration: 3.4, ease: "easeInOut" }, // 🌟 estrella
];

export default function NivelesPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [unidadesCompletas, setUnidadesCompletas] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(true);
  const [gradoNombre, setGradoNombre] = useState<string>("");
  const [unidadShakeId, setUnidadShakeId] = useState<string | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function cargarUnidades() {
      console.log("[niveles] cargarUnidades: iniciando");
      const estudiante = getEstudianteLocal();
      console.log("[niveles] getEstudianteLocal():", estudiante);
      if (!estudiante) {
        console.log("[niveles] sin estudiante local — no hay sesión activa, deteniendo carga");
        setCargando(false);
        return;
      }

      try {
        console.log("[niveles] consultando grado con id:", estudiante.grado_id, "tipo:", typeof estudiante.grado_id);

        const { data: grado, error: gradoError } = await supabase
          .from("grados")
          .select("numero_grado, nivel")
          .eq("id", estudiante.grado_id)
          .maybeSingle();

        console.log("[niveles] grado query result:", grado, gradoError);
        console.log("[niveles] grado data completo:", JSON.stringify(grado));
        console.log("[niveles] grado error completo:", JSON.stringify(gradoError));

        if (grado) setGradoNombre(`${grado.numero_grado}mo grado — ${grado.nivel}`);

        console.log("[niveles] consultando unidades con grado_id:", estudiante.grado_id);

        const { data, error: unidadesError } = await supabase
          .from("unidades")
          .select("id, titulo, numero_unidad")
          .eq("grado_id", estudiante.grado_id)
          .order("numero_unidad", { ascending: true });

        console.log("[niveles] unidades query result:", data, unidadesError);

        const unidadesData = data ?? [];
        setUnidades(unidadesData);

        if (unidadesData.length) {
          const unidadIds = unidadesData.map((u) => u.id);
          const { data: temasData } = await supabase
            .from("temas")
            .select("id, unidad_id")
            .in("unidad_id", unidadIds);

          const temas = temasData ?? [];
          const temaIds = temas.map((t) => t.id);

          let temasCompletados = new Set<string>();
          if (temaIds.length) {
            const { data: progresos, error: progresoError } = await supabase
              .from("progreso_estudiante")
              .select("tema_id, lectura_completada, actividad_completada, reflexion_respondida")
              .eq("estudiante_id", estudiante.id)
              .in("tema_id", temaIds);

            console.log("[niveles] progreso query result:", progresos, progresoError);

            temasCompletados = new Set(
              (progresos ?? [])
                .filter((p) => p.lectura_completada && p.actividad_completada && p.reflexion_respondida)
                .map((p) => p.tema_id)
            );
          }

          const completas = new Set<string>();
          for (const unidadId of unidadIds) {
            const temasDeUnidad = temas.filter((t) => t.unidad_id === unidadId);
            const todosCompletados =
              temasDeUnidad.length === 0 ||
              temasDeUnidad.every((t) => temasCompletados.has(t.id));
            if (todosCompletados) completas.add(unidadId);
          }
          setUnidadesCompletas(completas);
        }
      } catch (error) {
        // si falla la red, no dejamos la página colgada en skeleton infinito
        console.error("[niveles] error en cargarUnidades:", error);
        setUnidades([]);
      } finally {
        console.log("[niveles] cargarUnidades: terminado, setCargando(false)");
        console.log("[niveles] estado final - unidades:", unidades.length, "grado:", gradoNombre);
        setCargando(false);
      }
    }
    cargarUnidades();
  }, []);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    };
  }, []);

  function handleUnidadBloqueadaClick(unidadId: string) {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    setUnidadShakeId(unidadId);
    shakeTimeoutRef.current = setTimeout(() => setUnidadShakeId(null), 1500);
  }

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <style>{`
        @keyframes entrar {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .unidad-card {
          cursor: pointer;
        }
      `}</style>

      {/* Header */}
      <div style={{ animation: "entrar 500ms ease forwards" }} className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#F0A8B6" }}>
          {gradoNombre || "Cargando..."}
        </p>
        <h1 className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
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
            const bloqueada = idx > 0 && !unidadesCompletas.has(unidades[idx - 1].id);

            if (bloqueada) {
              return (
                <div key={unidad.id} className="relative">
                  <motion.div
                    role="button"
                    aria-disabled="true"
                    tabIndex={0}
                    onClick={() => handleUnidadBloqueadaClick(unidad.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleUnidadBloqueadaClick(unidad.id);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      unidadShakeId === unidad.id
                        ? { opacity: 1, y: 0, x: [0, -8, 8, -8, 8, -4, 4, 0] }
                        : { opacity: 1, y: 0, x: 0 }
                    }
                    transition={
                      unidadShakeId === unidad.id
                        ? { duration: 0.45, ease: "easeInOut" }
                        : { type: "spring", stiffness: 300, damping: 24, delay: idx * 0.1 }
                    }
                    className="unidad-card block rounded-2xl p-6 cursor-not-allowed select-none"
                    style={{
                      backgroundColor: "rgba(22,11,36,0.03)",
                      border: "1.5px solid rgba(22,11,36,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{ backgroundColor: "rgba(22,11,36,0.08)" }}
                      >
                        🔒
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--foreground)", opacity: 0.35 }}>
                          Unidad {unidad.numero_unidad}
                        </p>
                        <h2 className="text-lg font-bold" style={{ color: "var(--foreground)", opacity: 0.35 }}>
                          {unidad.titulo}
                        </h2>
                      </div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {unidadShakeId === unidad.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg z-10 whitespace-nowrap"
                        style={{ backgroundColor: "#160B24", color: "#ffffff" }}
                      >
                        Completá la unidad anterior primero
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <motion.div
                key={unidad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: `0 16px 40px ${color.accent}40` }}
                className="unidad-card rounded-2xl"
              >
                <Link
                  href={`/niveles/${unidad.id}`}
                  className="block rounded-2xl p-6"
                  style={{
                    backgroundColor: color.bg,
                    border: `1.5px solid ${color.border}`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <motion.div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: color.border }}
                      animate={ANIMACION_ICONO_UNIDAD[idx % ANIMACION_ICONO_UNIDAD.length].animate}
                      transition={{
                        duration: ANIMACION_ICONO_UNIDAD[idx % ANIMACION_ICONO_UNIDAD.length].duration,
                        repeat: Infinity,
                        ease: ANIMACION_ICONO_UNIDAD[idx % ANIMACION_ICONO_UNIDAD.length].ease,
                        delay: idx * 0.15,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {icono}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: color.accent }}>
                        Unidad {unidad.numero_unidad}
                      </p>
                      <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                        {unidad.titulo}
                      </h2>
                    </div>
                    <div className="text-2xl opacity-30" style={{ color: color.accent }}>→</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
