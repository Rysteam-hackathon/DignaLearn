"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal } from "@/lib/auth";

// ---------- Figuras decorativas alrededor de las cards de stats ----------
// A diferencia del fondo de pantalla completa (dashboard/extras), acá las
// figuras viven DENTRO del contenedor de las cards (position: absolute,
// no fixed), distribuidas arriba, entre y debajo de las 3 tarjetas.

type IconoTematico = "venus" | "libro" | "estrella" | "balanza" | "lapiz";

interface FiguraDecorativaConfig {
  icono: IconoTematico;
  zona: "arriba" | "entre" | "abajo";
  style: { top?: string; left?: string; right?: string; bottom?: string };
  size: number;
  duracion: number;
  delay: number;
  distancia: number;
  opLight: number;
  opDark: number;
}

const FIGURAS_DECORATIVAS: FiguraDecorativaConfig[] = [
  // Arriba de las cards
  { icono: "venus",    zona: "arriba", style: { top: "-20px", left: "6%" },     size: 48, duracion: 7.2, delay: 0,   distancia: -14, opLight: 0.07, opDark: 0.09 },
  { icono: "estrella", zona: "arriba", style: { top: "10px",  right: "8%" },    size: 34, duracion: 6.1, delay: 1.2, distancia: -12, opLight: 0.08, opDark: 0.11 },
  // Entre las cards (a la altura media de la fila, en los huecos entre columnas)
  { icono: "libro",    zona: "entre",  style: { top: "48%",   left: "31%" },    size: 56, duracion: 8.6, delay: 2.0, distancia: -18, opLight: 0.06, opDark: 0.09 },
  { icono: "balanza",  zona: "entre",  style: { top: "48%",   left: "64%" },    size: 52, duracion: 9.0, delay: 0.6, distancia: -18, opLight: 0.06, opDark: 0.09 },
  // Debajo de las cards
  { icono: "lapiz",    zona: "abajo",  style: { bottom: "-20px", left: "18%" }, size: 44, duracion: 7.2, delay: 2.6, distancia: -14, opLight: 0.07, opDark: 0.09 },
  { icono: "estrella", zona: "abajo",  style: { bottom: "-45px", right: "12%" }, size: 40, duracion: 6.7, delay: 1.6, distancia: -14, opLight: 0.08, opDark: 0.11 },
];

function IconoSvg({ tipo }: { tipo: IconoTematico }) {
  switch (tipo) {
    case "venus":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <circle cx="10" cy="12" r="6" />
          <line x1="10" y1="18" x2="10" y2="23" />
          <line x1="7" y1="20.5" x2="13" y2="20.5" />
          <line x1="14.5" y1="7.5" x2="20" y2="2" />
          <polyline points="15,2 20,2 20,7" />
        </svg>
      );
    case "libro":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-full h-full">
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
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2 L14.9 9.1 L22.5 9.5 L16.5 14.3 L18.5 21.5 L12 17.3 L5.5 21.5 L7.5 14.3 L1.5 9.5 L9.1 9.1 Z" />
        </svg>
      );
    case "balanza":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <line x1="12" y1="4" x2="12" y2="16" />
          <line x1="5" y1="7" x2="19" y2="7" />
          <path d="M12 16 L7 21 H17 Z" />
        </svg>
      );
    case "lapiz":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className="w-full h-full">
          <path d="M5 19 L17 7 L20 10 L8 22 Z" />
          <path d="M5 19 L3 21 L6 22 Z" />
        </svg>
      );
  }
}

function FigurasDecorativas({ esOscuro }: { esOscuro: boolean }) {
  const colorTematico = esOscuro ? "#F0A8B6" : "#160B24";
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {FIGURAS_DECORATIVAS.map((fig, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{ ...fig.style, width: fig.size, height: fig.size, color: colorTematico }}
          animate={{
            y: [0, fig.distancia, 0],
            opacity: esOscuro
              ? [fig.opDark * 0.6, fig.opDark, fig.opDark * 0.6]
              : [fig.opLight * 0.6, fig.opLight, fig.opLight * 0.6],
          }}
          transition={{ duration: fig.duracion, repeat: Infinity, ease: "easeInOut", delay: fig.delay }}
        >
          <IconoSvg tipo={fig.icono} />
        </motion.div>
      ))}
    </div>
  );
}

// ---------- Página ----------

interface ProgresoData {
  racha: number;
  temasCompletados: number;
  ultimoLogro: { titulo: string; desbloqueado_en: string } | null;
}

function calcularRacha(fechas: string[]): number {
  if (!fechas.length) return 0;
  const dias = Array.from(new Set(fechas))
    .map((f) => new Date(f).toISOString().split("T")[0])
    .sort()
    .reverse();
  let racha = 1;
  for (let i = 0; i < dias.length - 1; i++) {
    const diff = (new Date(dias[i]).getTime() - new Date(dias[i + 1]).getTime()) / 86400000;
    if (diff === 1) racha++;
    else break;
  }
  return racha;
}

export default function ProgresoPage() {
  const [esOscuro, setEsOscuro] = useState(false);
  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const obs = new MutationObserver(actualizar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const [datos, setDatos] = useState<ProgresoData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const estudiante = getEstudianteLocal();
      if (!estudiante) {
        setCargando(false);
        return;
      }

      try {
        const { data: actividad } = await supabase
          .from("actividad_diaria")
          .select("fecha_actividad")
          .eq("estudiante_id", estudiante.id)
          .order("fecha_actividad", { ascending: false })
          .limit(60);

        const racha = calcularRacha(actividad?.map((a) => a.fecha_actividad) ?? []);

        const { data: progresos } = await supabase
          .from("progreso_estudiante")
          .select("tema_id, lectura_completada, actividad_completada, reflexion_respondida")
          .eq("estudiante_id", estudiante.id);

        const temasCompletados = (progresos ?? []).filter(
          (p) => p.lectura_completada && p.actividad_completada && p.reflexion_respondida
        ).length;

        const { data: logroData } = await supabase
          .from("estudiante_logros")
          .select("desbloqueado_en, logros(titulo)")
          .eq("estudiante_id", estudiante.id)
          .order("desbloqueado_en", { ascending: false })
          .limit(1)
          .maybeSingle();

        const ultimoLogro = logroData
          ? {
              titulo: (logroData.logros as unknown as { titulo: string } | null)?.titulo ?? "",
              desbloqueado_en: logroData.desbloqueado_en,
            }
          : null;

        setDatos({ racha, temasCompletados, ultimoLogro });
      } catch {
        setDatos({ racha: 0, temasCompletados: 0, ultimoLogro: null });
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const cardBg = esOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.03)";
  const cardBorder = esOscuro ? "rgba(255,255,255,0.16)" : "rgba(22,11,36,0.14)";
  const colorSecundario = esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)";

  const tarjetas = [
    {
      emoji: "🔥",
      label: "Racha actual",
      valor: datos ? `${datos.racha} ${datos.racha === 1 ? "día" : "días"}` : "—",
      accent: "#F0A8B6",
    },
    {
      emoji: "📖",
      label: "Temas completados",
      valor: datos ? `${datos.temasCompletados}` : "—",
      accent: "#A4CDD5",
    },
    {
      emoji: "🏆",
      label: "Último logro",
      valor: datos?.ultimoLogro?.titulo ?? "Ninguno todavía",
      accent: "#F0A8B6",
    },
  ];

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Progreso
        </h1>
        <p className="text-sm" style={{ color: colorSecundario }}>
          Tu historial de actividad y logros.
        </p>
      </motion.div>

      {/* Contenedor relativo: las figuras decorativas viven acá adentro,
          arriba/entre/debajo de las cards, en vez de flotar en los bordes
          de toda la pantalla. */}
      <div className="relative mb-6 py-5">
        <FigurasDecorativas esOscuro={esOscuro} />

        {cargando ? (
          <p className="relative z-10 text-sm" style={{ color: colorSecundario }}>Cargando progreso...</p>
        ) : (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {tarjetas.map((t, idx) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: idx * 0.1 }}
                whileHover={{ scale: 1.04, boxShadow: `0 18px 40px ${t.accent}40` }}
                className="rounded-3xl p-7 overflow-hidden flex flex-col items-center text-center"
                style={{
                  background: esOscuro
                    ? `linear-gradient(135deg, ${t.accent}22, ${t.accent}08)`
                    : `linear-gradient(135deg, ${t.accent}18, ${t.accent}05)`,
                  border: `1.5px solid ${cardBorder}`,
                }}
              >
                <motion.p
                  className="text-4xl mb-4"
                  aria-hidden
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                >
                  {t.emoji}
                </motion.p>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: t.accent }}>
                  {t.label}
                </p>
                <p className="text-2xl font-bold line-clamp-2" style={{ color: "var(--foreground)" }}>
                  {t.valor}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
        whileHover={{ scale: 1.02, boxShadow: "0 16px 36px rgba(240,168,182,0.2)" }}
      >
        <Link
          href="/logros"
          className="flex items-center gap-3 rounded-2xl p-5"
          style={{ backgroundColor: cardBg, border: `1.5px solid ${cardBorder}` }}
        >
          <span className="text-2xl" aria-hidden>🏆</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Ver mis logros</p>
            <p className="text-xs" style={{ color: colorSecundario }}>Todos tus logros desbloqueados</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
