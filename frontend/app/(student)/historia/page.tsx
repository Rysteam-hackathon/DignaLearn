"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoriaPage() {
  const [esOscuro, setEsOscuro] = useState(false);
  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const obs = new MutationObserver(actualizar);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const colorTitulo = esOscuro ? "#ffffff" : "#160B24";
  const colorSecundario = esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)";

  return (
    <div className="relative overflow-hidden min-h-[70vh] flex flex-col items-center justify-center text-center p-5 max-w-3xl mx-auto">
      <style>{`
        @keyframes historia-flotar {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes historia-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .historia-emoji { animation: historia-flotar 4s ease-in-out infinite; }
        .historia-badge { animation: historia-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full opacity-10"
          style={{ width: 280, height: 280, background: "#F0A8B6", top: -80, left: -80 }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{ width: 220, height: 220, background: "#A4CDD5", bottom: -70, right: -70 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="historia-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6"
          style={{ backgroundColor: "rgba(240,168,182,0.15)", color: "#F0A8B6", border: "1px solid rgba(240,168,182,0.3)" }}
        >
          ✨ Próximamente
        </div>

        <p className="historia-emoji text-7xl mb-6" aria-hidden>📖</p>

        <h1 className="text-3xl font-bold mb-3" style={{ color: colorTitulo }}>
          Modo Historia
        </h1>

        <p className="text-sm mb-8 max-w-sm" style={{ color: colorSecundario }}>
          Vas a poder recorrer momentos clave de Nicaragua desde la perspectiva de sus protagonistas, tomando decisiones que moldean tu propio camino. Seguí completando temas mientras terminamos de construir esta experiencia.
        </p>

        <Link
          href="/niveles"
          className="rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
        >
          Ir a Unidades →
        </Link>
      </div>
    </div>
  );
}
