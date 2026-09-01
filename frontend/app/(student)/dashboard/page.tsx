"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal, type EstudianteProfile } from "@/lib/auth";

interface DashboardData {
  racha: number;
  continuarTema: { titulo: string; unidadTitulo: string; temaId: string; unidadId: string } | null;
  ultimoLogro: { titulo: string; desbloqueado_en: string } | null;
  unidadesCompletadas: number;
}

function calcularRacha(fechas: string[]): number {
  if (!fechas.length) return 0;
  const dias = Array.from(new Set(fechas))
    .map((f) => new Date(f).toISOString().split("T")[0])
    .sort().reverse();
  let racha = 1;
  for (let i = 0; i < dias.length - 1; i++) {
    const diff = (new Date(dias[i]).getTime() - new Date(dias[i + 1]).getTime()) / 86400000;
    if (diff === 1) racha++;
    else break;
  }
  return racha;
}

function saludo(nombre: string | null): string {
  const hora = new Date().getHours();
  const momento = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  return nombre ? `${momento}, ${nombre.split(" ")[0]}` : momento;
}

type AccesoRapidoId = "niveles" | "logros" | "historia";

const ANIMACION_POR_ACCESO: Record<AccesoRapidoId, { animate: Record<string, number[]>; duration: number; ease: "easeInOut" }> = {
  niveles:  { animate: { scale: [1, 1.12, 1] },   duration: 3,   ease: "easeInOut" },
  logros:   { animate: { rotate: [-8, 8, -8] },   duration: 2.8, ease: "easeInOut" },
  historia: { animate: { scale: [1, 1.1, 1], rotate: [-5, 5, -5] }, duration: 3, ease: "easeInOut" },
};

const ACCESOS_RAPIDOS: { id: AccesoRapidoId; href: string; emoji: string; label: string; color: string }[] = [
  { id: "niveles",  href: "/niveles",  emoji: "📖", label: "Niveles",  color: "#F0A8B6" },
  { id: "logros",   href: "/logros",   emoji: "🏆", label: "Logros",   color: "#A4CDD5" },
  { id: "historia", href: "/historia", emoji: "🎭", label: "Historia", color: "#F0A8B6" },
];

export default function DashboardPage() {
  const [estudiante, setEstudiante] = useState<EstudianteProfile | null>(null);
  const [datos, setDatos] = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [esOscuro, setEsOscuro] = useState(false);

  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains("dark"));
    actualizar();
    const obs = new MutationObserver(actualizar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const est = getEstudianteLocal();
    if (!est) return;
    setEstudiante(est);

    async function cargar() {
      if (!est) return;
      try {
        const { data: actividad } = await supabase
          .from("actividad_diaria")
          .select("fecha_actividad")
          .eq("estudiante_id", est.id)
          .order("fecha_actividad", { ascending: false })
          .limit(60);

        const racha = calcularRacha(actividad?.map((a) => a.fecha_actividad) ?? []);

        const { data: logrosData } = await supabase
          .from("estudiante_logros")
          .select("desbloqueado_en, logros(titulo)")
          .eq("estudiante_id", est.id)
          .order("desbloqueado_en", { ascending: false })
          .limit(1)
          .maybeSingle();

        const ultimoLogro = logrosData ? {
          titulo: (logrosData.logros as unknown as { titulo: string } | null)?.titulo ?? "",
          desbloqueado_en: logrosData.desbloqueado_en,
        } : null;

        const { data: logrosUnidad } = await supabase
          .from("estudiante_logros")
          .select("logros(tipo_condicion)")
          .eq("estudiante_id", est.id);

        const unidadesCompletadas = (logrosUnidad ?? []).filter(
          (l) => (l.logros as unknown as { tipo_condicion: string } | null)?.tipo_condicion === "unidad_completada"
        ).length;

        const { data: unidades } = await supabase
          .from("unidades")
          .select("id, titulo, numero_unidad")
          .eq("grado_id", est.grado_id)
          .order("numero_unidad", { ascending: true });

        let continuarTema: DashboardData["continuarTema"] = null;

        for (const unidad of unidades ?? []) {
          const { data: temas } = await supabase
            .from("temas")
            .select("id, titulo, orden")
            .eq("unidad_id", unidad.id)
            .order("orden", { ascending: true });

          if (!temas?.length) continue;
          const temaIds = temas.map((t) => t.id);

          const { data: progresos } = await supabase
            .from("progreso_estudiante")
            .select("tema_id, lectura_completada, actividad_completada, reflexion_respondida")
            .eq("estudiante_id", est.id)
            .in("tema_id", temaIds);

          const completados = new Set(
            (progresos ?? [])
              .filter((p) => p.lectura_completada && p.actividad_completada && p.reflexion_respondida)
              .map((p) => p.tema_id)
          );

          const pendiente = temas.find((t) => !completados.has(t.id));
          if (pendiente) {
            continuarTema = { titulo: pendiente.titulo, unidadTitulo: unidad.titulo, temaId: pendiente.id, unidadId: unidad.id };
            break;
          }
        }

        setDatos({ racha, continuarTema, ultimoLogro, unidadesCompletadas });
      } catch (error) {
        console.error("Error:", error);
        setDatos({ racha: 0, continuarTema: null, ultimoLogro: null, unidadesCompletadas: 0 });
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <div className="min-h-screen p-5 max-w-3xl mx-auto">
      <style>{`
        .card-hover {
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(240,168,182,0.12);
        }
        .btn-continuar {
          transition: transform 150ms ease, opacity 150ms ease;
        }
        .btn-continuar:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }
      `}</style>

      {/* Saludo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="mb-8"
      >
        {datos?.racha && datos.racha > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3 text-xs font-bold"
            style={{ backgroundColor: "rgba(240,168,182,0.15)", color: "#F0A8B6", border: "1px solid rgba(240,168,182,0.3)" }}>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🔥
            </motion.span>
            {datos.racha} {datos.racha === 1 ? "día" : "días"} seguidos
          </div>
        ) : null}
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
          {saludo(estudiante?.nombre_display ?? null)}
        </h1>
        <p className="text-sm text-gray-400 mt-1">¿Qué aprendemos hoy?</p>
      </motion.div>

      {cargando ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl h-44 animate-pulse" style={{ backgroundColor: "rgba(22,11,36,0.08)" }} />
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl h-32 animate-pulse" style={{ backgroundColor: "rgba(22,11,36,0.06)" }} />
            <div className="rounded-2xl h-32 animate-pulse" style={{ backgroundColor: "rgba(22,11,36,0.06)" }} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Tarjeta continuar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
            className="rounded-3xl p-7 relative overflow-hidden"
            style={{
              background: esOscuro ? "#160B24" : "linear-gradient(135deg, #F0A8B6, #A4CDD5)",
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-10 translate-x-10"
              style={{ backgroundColor: esOscuro ? "#F0A8B6" : "#160B24" }} />
            <div className="absolute bottom-0 left-20 w-24 h-24 rounded-full opacity-5"
              style={{ backgroundColor: esOscuro ? "#A4CDD5" : "#160B24" }} />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: esOscuro ? "#A4CDD5" : "#160B24" }}>
                {datos?.continuarTema ? "Continuar donde quedaste" : "¡Bienvenido a DignaLearn!"}
              </p>
              <p className="text-xl font-bold mb-1" style={{ color: esOscuro ? "#ffffff" : "#160B24" }}>
                {datos?.continuarTema?.titulo ?? "Comenzá tu primer tema"}
              </p>
              <p className="text-sm mb-6" style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.6)" }}>
                {datos?.continuarTema?.unidadTitulo ?? "Dignidad y Respeto para Vivir en Armonía"}
              </p>
              <Link
                href={datos?.continuarTema ? `/niveles/${datos.continuarTema.unidadId}/${datos.continuarTema.temaId}` : "/niveles"}
                className="btn-continuar inline-block rounded-2xl px-6 py-3 text-sm font-bold"
                style={{ backgroundColor: esOscuro ? "#F0A8B6" : "#160B24", color: esOscuro ? "#160B24" : "#ffffff" }}
              >
                {datos?.continuarTema ? "Continuar →" : "Comenzar →"}
              </Link>
            </div>
          </motion.div>

          {/* Tarjetas métricas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Último logro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0 * 0.08 }}
              className="card-hover rounded-2xl p-5"
              style={{ border: "1.5px solid rgba(240,168,182,0.2)", backgroundColor: esOscuro ? "rgba(240,168,182,0.08)" : "rgba(240,168,182,0.04)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.4)" }}>Último logro</p>
              {datos?.ultimoLogro ? (
                <>
                  <motion.p
                    className="text-3xl mb-2"
                    aria-hidden
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🏆
                  </motion.p>
                  <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{datos.ultimoLogro.titulo}</p>
                </>
              ) : (
                <>
                  <motion.p
                    className="text-3xl mb-2 opacity-20"
                    aria-hidden
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🏆
                  </motion.p>
                  <p className="text-xs" style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.4)" }}>Completá tu primer tema</p>
                </>
              )}
            </motion.div>

            {/* Unidades */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24, delay: 1 * 0.08 }}
              className="card-hover rounded-2xl p-5"
              style={{ border: "1.5px solid rgba(164,205,213,0.2)", backgroundColor: esOscuro ? "rgba(164,205,213,0.08)" : "rgba(164,205,213,0.04)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.4)" }}>Unidades</p>
              <p className="text-4xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                {datos?.unidadesCompletadas ?? 0}
              </p>
              <p className="text-xs mb-3" style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.4)" }}>de 4 completadas</p>
              <div className="flex gap-1">
                {[1,2,3,4].map((n) => (
                  <div key={n} className="flex-1 h-1.5 rounded-full"
                    style={{ backgroundColor: n <= (datos?.unidadesCompletadas ?? 0) ? "#F0A8B6" : esOscuro ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)" }} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Accesos rápidos */}
          <div className="grid grid-cols-3 gap-3">
            {ACCESOS_RAPIDOS.map((item, idx) => {
              const config = ANIMACION_POR_ACCESO[item.id];
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.03, boxShadow: `0 14px 32px ${item.color}55` }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl"
                >
                  <Link
                    href={item.href}
                    className="block rounded-2xl p-4 text-center"
                    style={{ border: "1.5px solid rgba(22,11,36,0.08)", backgroundColor: "rgba(22,11,36,0.03)" }}
                  >
                    <motion.p
                      className="text-2xl mb-1"
                      aria-hidden
                      animate={config.animate}
                      transition={{ duration: config.duration, repeat: Infinity, ease: config.ease }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.emoji}
                    </motion.p>
                    <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{item.label}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
