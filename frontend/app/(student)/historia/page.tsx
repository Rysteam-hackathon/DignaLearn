"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
        <motion.div
          animate={{ opacity: [1, 0.55, 1] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6"
          style={{ backgroundColor: "rgba(240,168,182,0.15)", color: "#F0A8B6", border: "1px solid rgba(240,168,182,0.3)" }}
        >
          ✨ Próximamente
        </motion.div>

        <motion.p
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          className="text-7xl mb-6"
          aria-hidden
        >
          📖
        </motion.p>

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
