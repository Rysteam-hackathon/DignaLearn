"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Fondo animado compartido — figuras SVG temáticas, coexiste con los
// círculos de .fondo-flotante (definidos en layout.tsx / globals.css).
// Se renderiza una sola vez desde (student)/layout.tsx y aplica a
// todas las páginas del estudiante.

type IconoTematico = "venus" | "libro" | "estrella" | "balanza" | "lapiz";

interface FiguraFlotanteConfig {
  icono: IconoTematico;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: number;
  duracion: number;
  delay: number;
  distancia: number;
  opLight: number;
  opDark: number;
  colorDark: "#F0A8B6" | "#A4CDD5";
}

const FIGURAS_FLOTANTES: FiguraFlotanteConfig[] = [
  { icono: "venus",    top: "6%",  left: "22%",  size: 55, duracion: 7.4, delay: 0,   distancia: -18, opLight: 0.05, opDark: 0.07, colorDark: "#F0A8B6" },
  { icono: "libro",    top: "15%", right: "8%",  size: 80, duracion: 8.8, delay: 1.3, distancia: -22, opLight: 0.04, opDark: 0.06, colorDark: "#A4CDD5" },
  { icono: "estrella", top: "30%", left: "35%",  size: 42, duracion: 6.3, delay: 2.1, distancia: -14, opLight: 0.06, opDark: 0.08, colorDark: "#F0A8B6" },
  { icono: "balanza",  top: "42%", right: "15%", size: 68, duracion: 9.2, delay: 0.7, distancia: -22, opLight: 0.05, opDark: 0.07, colorDark: "#A4CDD5" },
  { icono: "lapiz",    top: "55%", left: "25%",  size: 50, duracion: 7.6, delay: 2.8, distancia: -18, opLight: 0.04, opDark: 0.06, colorDark: "#F0A8B6" },
  { icono: "estrella", top: "68%", right: "22%", size: 46, duracion: 6.9, delay: 1.6, distancia: -16, opLight: 0.06, opDark: 0.08, colorDark: "#A4CDD5" },
  { icono: "venus",    top: "80%", left: "40%",  size: 60, duracion: 8.1, delay: 3.4, distancia: -20, opLight: 0.05, opDark: 0.07, colorDark: "#F0A8B6" },
  { icono: "libro",    top: "90%", right: "10%", size: 72, duracion: 9.6, delay: 0.9, distancia: -24, opLight: 0.04, opDark: 0.06, colorDark: "#A4CDD5" },
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

export default function FondoAnimado() {
  const [esOscuro, setEsOscuro] = useState(false);

  useEffect(() => {
    const actualizar = () => setEsOscuro(document.documentElement.classList.contains("dark"));
    actualizar();
    const observer = new MutationObserver(actualizar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {FIGURAS_FLOTANTES.map((fig, idx) => (
        <motion.div
          key={`fig-${idx}`}
          className="absolute"
          style={{
            top: fig.top,
            left: fig.left,
            right: fig.right,
            bottom: fig.bottom,
            width: fig.size,
            height: fig.size,
            color: esOscuro ? fig.colorDark : "#160B24",
          }}
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
