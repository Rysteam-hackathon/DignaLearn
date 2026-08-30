"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type IconoTematico = "venus" | "libro" | "estrella" | "balanza" | "lapiz";

interface FiguraTematicaConfig {
  icono: IconoTematico;
  top?: string;
  left?: string;
  right?: string;
  size: number;
  duration: number;
  delay: number;
  distancia: number;
  opLight: number;
  opDark: number;
}

const FIGURAS_TEMATICAS: FiguraTematicaConfig[] = [
  { icono: "venus",    top: "8%",  left: "6%",   size: 60, duration: 7.2, delay: 0,   distancia: -18, opLight: 0.05, opDark: 0.06 },
  { icono: "libro",    top: "15%", right: "10%", size: 80, duration: 8.6, delay: 1.4, distancia: -22, opLight: 0.04, opDark: 0.07 },
  { icono: "estrella", top: "34%", left: "18%",  size: 42, duration: 6.1, delay: 2.2, distancia: -14, opLight: 0.06, opDark: 0.08 },
  { icono: "balanza",  top: "46%", right: "22%", size: 70, duration: 9.4, delay: 0.6, distancia: -24, opLight: 0.05, opDark: 0.06 },
  { icono: "lapiz",    top: "60%", left: "8%",   size: 55, duration: 7.8, delay: 3.0, distancia: -18, opLight: 0.04, opDark: 0.07 },
  { icono: "estrella", top: "70%", right: "12%", size: 48, duration: 6.6, delay: 1.9, distancia: -16, opLight: 0.06, opDark: 0.08 },
  { icono: "venus",    top: "82%", left: "30%",  size: 65, duration: 8.1, delay: 0.9, distancia: -20, opLight: 0.05, opDark: 0.06 },
  { icono: "libro",    top: "90%", right: "34%", size: 90, duration: 9.9, delay: 2.6, distancia: -26, opLight: 0.04, opDark: 0.07 },
];

function IconoSvg({ tipo }: { tipo: IconoTematico }) {
  switch (tipo) {
    case "venus":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="12" r="6" />
          <line x1="10" y1="18" x2="10" y2="23" />
          <line x1="7" y1="20.5" x2="13" y2="20.5" />
          <line x1="14.5" y1="7.5" x2="20" y2="2" />
          <polyline points="15,2 20,2 20,7" />
        </svg>
      );
    case "libro":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="5" width="9" height="14" rx="1" />
          <rect x="13" y="5" width="9" height="14" rx="1" />
          <line x1="4.5" y1="9" x2="8.5" y2="9" />
          <line x1="4.5" y1="12" x2="8.5" y2="12" />
          <line x1="15.5" y1="9" x2="19.5" y2="9" />
          <line x1="15.5" y1="12" x2="19.5" y2="12" />
        </svg>
      );
    case "estrella":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 L14.9 9.1 L22.5 9.5 L16.5 14.3 L18.5 21.5 L12 17.3 L5.5 21.5 L7.5 14.3 L1.5 9.5 L9.1 9.1 Z" />
        </svg>
      );
    case "balanza":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="4" x2="12" y2="16" />
          <line x1="5" y1="7" x2="19" y2="7" />
          <path d="M12 16 L7 21 H17 Z" />
        </svg>
      );
    case "lapiz":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M5 19 L17 7 L20 10 L8 22 Z" />
          <path d="M5 19 L3 21 L6 22 Z" />
        </svg>
      );
  }
}

function FondoTematico() {
  return (
    <div
      className="fondo-tematico"
      style={{ position: "fixed", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none" }}
      aria-hidden="true"
    >
      {FIGURAS_TEMATICAS.map((fig, idx) => (
        <div
          key={idx}
          className="figura-tematica"
          style={{
            position: "absolute",
            top: fig.top,
            left: fig.left,
            right: fig.right,
            width: fig.size,
            height: fig.size,
            animationDuration: `${fig.duration}s`,
            animationDelay: `${fig.delay}s`,
            ["--flota-dist" as string]: `${fig.distancia}px`,
            ["--op-light" as string]: fig.opLight,
            ["--op-dark" as string]: fig.opDark,
          } as React.CSSProperties}
        >
          <IconoSvg tipo={fig.icono} />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [estudiante, setEstudiante] = useState<EstudianteProfile | null>(null);
  const [datos, setDatos] = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);

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
      } catch {
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
        @keyframes entrar {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulso-racha {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
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
        .figura-tematica {
          color: #160B24;
          opacity: var(--op-light, 0.05);
          animation-name: flotar-fondo;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .figura-tematica svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .dark .figura-tematica {
          color: #F0A8B6;
          opacity: var(--op-dark, 0.06);
        }
      `}</style>

      <FondoTematico />

      {/* Saludo */}
      <div style={{ animation: "entrar 500ms ease forwards" }} className="mb-8">
        {datos?.racha && datos.racha > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-3 text-xs font-bold"
            style={{ backgroundColor: "rgba(240,168,182,0.15)", color: "#F0A8B6", border: "1px solid rgba(240,168,182,0.3)", animation: "pulso-racha 2s ease-in-out infinite" }}>
            🔥 {datos.racha} {datos.racha === 1 ? "día" : "días"} seguidos
          </div>
        ) : null}
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
          {saludo(estudiante?.nombre_display ?? null)}
        </h1>
        <p className="text-sm text-gray-400 mt-1">¿Qué aprendemos hoy?</p>
      </div>

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
          <div
            className="rounded-3xl p-7 relative overflow-hidden"
            style={{ backgroundColor: "#160B24", animation: "entrar 500ms ease 100ms both" }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-10 translate-x-10"
              style={{ backgroundColor: "#F0A8B6" }} />
            <div className="absolute bottom-0 left-20 w-24 h-24 rounded-full opacity-5"
              style={{ backgroundColor: "#A4CDD5" }} />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#A4CDD5" }}>
                {datos?.continuarTema ? "Continuar donde quedaste" : "¡Bienvenido a DignaLearn!"}
              </p>
              <p className="text-white text-xl font-bold mb-1">
                {datos?.continuarTema?.titulo ?? "Comenzá tu primer tema"}
              </p>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                {datos?.continuarTema?.unidadTitulo ?? "Dignidad y Respeto para Vivir en Armonía"}
              </p>
              <Link
                href={datos?.continuarTema ? `/niveles/${datos.continuarTema.unidadId}/${datos.continuarTema.temaId}` : "/niveles"}
                className="btn-continuar inline-block rounded-2xl px-6 py-3 text-sm font-bold"
                style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
              >
                {datos?.continuarTema ? "Continuar →" : "Comenzar →"}
              </Link>
            </div>
          </div>

          {/* Tarjetas métricas */}
          <div className="grid grid-cols-2 gap-4" style={{ animation: "entrar 500ms ease 200ms both" }}>
            {/* Último logro */}
            <div className="card-hover rounded-2xl p-5" style={{ border: "1.5px solid rgba(240,168,182,0.2)", backgroundColor: "rgba(240,168,182,0.04)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-400">Último logro</p>
              {datos?.ultimoLogro ? (
                <>
                  <p className="text-3xl mb-2" aria-hidden>🏆</p>
                  <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{datos.ultimoLogro.titulo}</p>
                </>
              ) : (
                <>
                  <p className="text-3xl mb-2 opacity-20" aria-hidden>🏆</p>
                  <p className="text-xs text-gray-400">Completá tu primer tema</p>
                </>
              )}
            </div>

            {/* Unidades */}
            <div className="card-hover rounded-2xl p-5" style={{ border: "1.5px solid rgba(164,205,213,0.2)", backgroundColor: "rgba(164,205,213,0.04)" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-400">Unidades</p>
              <p className="text-4xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
                {datos?.unidadesCompletadas ?? 0}
              </p>
              <p className="text-xs text-gray-400 mb-3">de 4 completadas</p>
              <div className="flex gap-1">
                {[1,2,3,4].map((n) => (
                  <div key={n} className="flex-1 h-1.5 rounded-full"
                    style={{ backgroundColor: n <= (datos?.unidadesCompletadas ?? 0) ? "#F0A8B6" : "rgba(0,0,0,0.08)" }} />
                ))}
              </div>
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="grid grid-cols-3 gap-3" style={{ animation: "entrar 500ms ease 300ms both" }}>
            {[
              { href: "/niveles", emoji: "📖", label: "Niveles" },
              { href: "/logros", emoji: "🏆", label: "Logros" },
              { href: "/historia", emoji: "🎭", label: "Historia" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card-hover rounded-2xl p-4 text-center"
                style={{ border: "1.5px solid rgba(22,11,36,0.08)", backgroundColor: "rgba(22,11,36,0.03)" }}
              >
                <p className="text-2xl mb-1" aria-hidden>{item.emoji}</p>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
