"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    valor_condicion: number | null;
  };
}

function badgeStyle(nivel: string, esOscuro: boolean): { bg: string; text: string; label: string } {
  if (nivel === "tema") return { bg: "rgba(240,168,182,0.2)", text: "#F0A8B6", label: "Tema" };
  if (nivel === "especial") return { bg: "rgba(164,205,213,0.2)", text: "#A4CDD5", label: "Especial" };
  return esOscuro
    ? { bg: "rgba(255,255,255,0.15)", text: "#ffffff", label: "Unidad" }
    : { bg: "rgba(22,11,36,0.1)", text: "#160B24", label: "Unidad" };
}

const POSICIONES_DESTELLOS = [
  { top: "-6px", left: "2px" },
  { top: "8%", right: "-6px" },
  { bottom: "-6px", left: "34%" },
  { top: "45%", left: "-8px" },
];

function DestellosEspeciales() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {POSICIONES_DESTELLOS.map((pos, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ ...pos, backgroundColor: i % 2 === 0 ? "#F0A8B6" : "#A4CDD5" }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.3, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function LogrosPage() {
  const [logros, setLogros] = useState<LogroDesbloqueado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [esOscuro, setEsOscuro] = useState(false);

  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const obs = new MutationObserver(actualizar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

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
            valor_condicion,
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
          valor_condicion: number | null;
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
            valor_condicion: logroRaw?.valor_condicion ?? null,
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

  const cardBg = esOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.03)";
  const cardBorder = esOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.08)";
  const colorSecundario = esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)";

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Mis logros
        </h1>
        <p className="text-sm mb-6" style={{ color: colorSecundario }}>
          {logros.length} {logros.length === 1 ? "logro desbloqueado" : "logros desbloqueados"}
        </p>
      </motion.div>

      {cargando ? (
        <p className="text-sm" style={{ color: colorSecundario }}>Cargando logros...</p>
      ) : logros.length === 0 ? (
        <div className="text-center py-16">
          <motion.p
            className="text-6xl mb-4"
            aria-hidden
            animate={{ scale: [1, 1.08, 1], opacity: [1, 0.75, 1] }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
          >
            🏆
          </motion.p>
          <p className="text-sm" style={{ color: colorSecundario }}>
            Completá tu primer tema para desbloquear logros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
          {logros.map((item, idx) => {
            const badge = badgeStyle(item.logro.nivel, esOscuro);
            const esEspecial = item.logro.nivel === "especial";
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 16px 36px rgba(240,168,182,0.25)" }}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: badge.bg }}
                >
                  {esEspecial && <DestellosEspeciales />}
                  <LogroIcono
                    tipo_condicion={item.logro.tipo_condicion}
                    nivel={item.logro.nivel}
                    size={44}
                    nombre_logro={item.logro.titulo}
                    condicion_valor={item.logro.valor_condicion ?? undefined}
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {item.logro.titulo}
                    </p>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  {item.logro.descripcion && (
                    <p className="text-xs" style={{ color: colorSecundario }}>
                      {item.logro.descripcion}
                    </p>
                  )}
                </div>
                <p className="text-xs shrink-0" style={{ color: colorSecundario }}>
                  {formatearFecha(item.desbloqueado_en)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
