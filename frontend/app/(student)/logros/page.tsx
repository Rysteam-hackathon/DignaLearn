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

function badgeStyle(nivel: string, esOscuro: boolean): { bg: string; text: string; label: string } {
  if (nivel === "tema") return { bg: "rgba(240,168,182,0.2)", text: "#F0A8B6", label: "Tema" };
  if (nivel === "especial") return { bg: "rgba(164,205,213,0.2)", text: "#A4CDD5", label: "Especial" };
  return esOscuro
    ? { bg: "rgba(255,255,255,0.15)", text: "#ffffff", label: "Unidad" }
    : { bg: "rgba(22,11,36,0.1)", text: "#160B24", label: "Unidad" };
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

  const cardBg = esOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.03)";
  const cardBorder = esOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.08)";
  const colorSecundario = esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)";

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <style>{`
        @keyframes logros-entrar {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logros-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.75; }
        }
        .logro-card {
          animation: logros-entrar 400ms ease forwards;
          opacity: 0;
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .logro-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(240, 168, 182, 0.18);
        }
        .logro-emoji-vacio {
          animation: logros-pulse 2.2s ease-in-out infinite;
        }
      `}</style>

      <div style={{ animation: "logros-entrar 400ms ease forwards" }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Mis logros
        </h1>
        <p className="text-sm mb-6" style={{ color: colorSecundario }}>
          {logros.length} {logros.length === 1 ? "logro desbloqueado" : "logros desbloqueados"}
        </p>
      </div>

      {cargando ? (
        <p className="text-sm" style={{ color: colorSecundario }}>Cargando logros...</p>
      ) : logros.length === 0 ? (
        <div className="text-center py-16">
          <p className="logro-emoji-vacio text-6xl mb-4" aria-hidden>🏆</p>
          <p className="text-sm" style={{ color: colorSecundario }}>
            Completá tu primer tema para desbloquear logros.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logros.map((item, idx) => {
            const badge = badgeStyle(item.logro.nivel, esOscuro);
            return (
              <div
                key={item.id}
                className="logro-card rounded-2xl p-4 flex items-center gap-4"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  animationDelay: `${idx * 70}ms`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: badge.bg }}
                >
                  <LogroIcono tipo_condicion={item.logro.tipo_condicion} nivel={item.logro.nivel} size={44} />
                </div>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
