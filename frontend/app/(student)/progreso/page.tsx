"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal } from "@/lib/auth";

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
  const cardBorder = esOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.08)";
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
      <style>{`
        @keyframes progreso-entrar {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .progreso-card {
          animation: progreso-entrar 400ms ease forwards;
          opacity: 0;
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .progreso-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px rgba(240, 168, 182, 0.15);
        }
      `}</style>

      <div style={{ animation: "progreso-entrar 400ms ease forwards" }} className="mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
          Progreso
        </h1>
        <p className="text-sm" style={{ color: colorSecundario }}>
          Tu historial de actividad y logros.
        </p>
      </div>

      {cargando ? (
        <p className="text-sm" style={{ color: colorSecundario }}>Cargando progreso...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {tarjetas.map((t, idx) => (
            <div
              key={t.label}
              className="progreso-card rounded-2xl p-5"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, animationDelay: `${idx * 90}ms` }}
            >
              <p className="text-2xl mb-2" aria-hidden>{t.emoji}</p>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: t.accent }}>
                {t.label}
              </p>
              <p className="text-base font-bold truncate" style={{ color: "var(--foreground)" }}>
                {t.valor}
              </p>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/logros"
        className="progreso-card inline-flex items-center gap-3 rounded-2xl p-4 transition-colors"
        style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, animationDelay: "270ms" }}
      >
        <span className="text-2xl" aria-hidden>🏆</span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Ver mis logros</p>
          <p className="text-xs" style={{ color: colorSecundario }}>Todos tus logros desbloqueados</p>
        </div>
      </Link>
    </div>
  );
}
