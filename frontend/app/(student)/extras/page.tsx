"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------- Fondo animado (temático + partículas), 100% Framer Motion ----------

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
}

const FIGURAS_FLOTANTES: FiguraFlotanteConfig[] = [
  { icono: "venus",    top: "8%",  left: "8%",   size: 55, duracion: 7.4, delay: 0,   distancia: -18, opLight: 0.05, opDark: 0.07 },
  { icono: "libro",    top: "18%", right: "10%", size: 75, duracion: 8.8, delay: 1.3, distancia: -22, opLight: 0.04, opDark: 0.07 },
  { icono: "estrella", top: "40%", left: "14%",  size: 40, duracion: 6.3, delay: 2.1, distancia: -14, opLight: 0.06, opDark: 0.09 },
  { icono: "balanza",  top: "52%", right: "18%", size: 65, duracion: 9.2, delay: 0.7, distancia: -22, opLight: 0.05, opDark: 0.07 },
  { icono: "lapiz",    top: "70%", left: "10%",  size: 50, duracion: 7.6, delay: 2.8, distancia: -18, opLight: 0.04, opDark: 0.07 },
  { icono: "estrella", top: "85%", right: "14%", size: 45, duracion: 6.9, delay: 1.6, distancia: -16, opLight: 0.06, opDark: 0.09 },
];

interface ParticulaConfig {
  top: string;
  left: string;
  size: number;
  color: string;
  duracion: number;
  delay: number;
  distancia: number;
}

const PARTICULAS: ParticulaConfig[] = [
  { top: "12%", left: "42%", size: 8, color: "#F0A8B6", duracion: 5.4, delay: 0.2, distancia: -30 },
  { top: "28%", left: "72%", size: 6, color: "#A4CDD5", duracion: 6.1, delay: 1.0, distancia: -24 },
  { top: "48%", left: "50%", size: 7, color: "#F0A8B6", duracion: 5.8, delay: 1.9, distancia: -28 },
  { top: "63%", left: "26%", size: 5, color: "#A4CDD5", duracion: 6.7, delay: 0.5, distancia: -20 },
  { top: "78%", left: "58%", size: 6, color: "#F0A8B6", duracion: 5.1, delay: 1.5, distancia: -26 },
  { top: "92%", left: "36%", size: 5, color: "#A4CDD5", duracion: 6.3, delay: 2.3, distancia: -22 },
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

function FondoAnimado({ esModoOscuro }: { esModoOscuro: boolean }) {
  const colorTematico = esModoOscuro ? "#F0A8B6" : "#160B24";
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {FIGURAS_FLOTANTES.map((fig, idx) => (
        <motion.div
          key={`fig-${idx}`}
          className="absolute"
          style={{ top: fig.top, left: fig.left, right: fig.right, bottom: fig.bottom, width: fig.size, height: fig.size, color: colorTematico }}
          animate={{
            y: [0, fig.distancia, 0],
            opacity: esModoOscuro
              ? [fig.opDark * 0.6, fig.opDark, fig.opDark * 0.6]
              : [fig.opLight * 0.6, fig.opLight, fig.opLight * 0.6],
          }}
          transition={{ duration: fig.duracion, repeat: Infinity, ease: "easeInOut", delay: fig.delay }}
        >
          <IconoSvg tipo={fig.icono} />
        </motion.div>
      ))}

      {PARTICULAS.map((p, idx) => (
        <motion.span
          key={`particula-${idx}`}
          className="absolute rounded-full"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, backgroundColor: p.color }}
          animate={{
            y: [0, p.distancia, 0],
            x: [0, 8, 0],
            opacity: esModoOscuro ? [0.15, 0.45, 0.15] : [0.1, 0.3, 0.1],
          }}
          transition={{ duration: p.duracion, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

// ---------- Íconos animados del equipo ----------

type TipoIconoMiembro = "bocadillo" | "estrella" | "engranaje" | "pincel" | "pantalla";

function IconoMiembroSvg({ tipo }: { tipo: TipoIconoMiembro }) {
  switch (tipo) {
    case "bocadillo":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "estrella":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2 L14.9 9.1 L22.5 9.5 L16.5 14.3 L18.5 21.5 L12 17.3 L5.5 21.5 L7.5 14.3 L1.5 9.5 L9.1 9.1 Z" />
        </svg>
      );
    case "engranaje":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "pincel":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
      );
    case "pantalla":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <rect x="2" y="4" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
  }
}

const ANIMACION_POR_ICONO: Record<TipoIconoMiembro, { animate: Record<string, number[] | number>; duration: number; ease: "easeInOut" | "linear" }> = {
  estrella:  { animate: { scale: [1, 1.15, 1] },  duration: 2.2, ease: "easeInOut" },
  bocadillo: { animate: { rotate: [-8, 8, -8] },   duration: 2.6, ease: "easeInOut" },
  engranaje: { animate: { rotate: 360 },           duration: 6,   ease: "linear" },
  pincel:    { animate: { rotate: [-12, 12, -12] }, duration: 2.4, ease: "easeInOut" },
  pantalla:  { animate: { opacity: [1, 0.65, 1], scale: [1, 1.06, 1] }, duration: 2.4, ease: "easeInOut" },
};

function IconoMiembroAnimado({ tipo, color }: { tipo: TipoIconoMiembro; color: string }) {
  const config = ANIMACION_POR_ICONO[tipo];
  return (
    <motion.div
      className="w-7 h-7"
      style={{ color }}
      animate={config.animate}
      transition={{ duration: config.duration, repeat: Infinity, ease: config.ease }}
      whileHover={{ scale: 1.2, color: "#ffffff" }}
    >
      <IconoMiembroSvg tipo={tipo} />
    </motion.div>
  );
}

// ---------- Íconos sol / luna del toggle ----------

function IconoSol() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ---------- Equipo ----------

interface MiembroEquipo {
  nombre: string;
  rol: string;
  icono: TipoIconoMiembro;
}

const EQUIPO: MiembroEquipo[] = [
  { nombre: "Dirk Martinez", rol: "Backend", icono: "engranaje" },
  { nombre: "Eddy Marenco", rol: "Líder y Marketing", icono: "estrella" },
  { nombre: "Ronald Dávila", rol: "Comunicador", icono: "bocadillo" },
  { nombre: "Sharis Peralta", rol: "Diseño", icono: "pincel" },
  { nombre: "Sidar Perez", rol: "Frontend y Modo Historia", icono: "pantalla" },
];

const seccionVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function ExtrasPage() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [esModoOscuro, setEsModoOscuro] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("dignalearn_tema");
    setModoOscuro(guardado === "dark");
  }, []);

  useEffect(() => {
    const actualizar = () => setEsModoOscuro(document.documentElement.classList.contains('dark'));
    actualizar();
    const observer = new MutationObserver(actualizar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  function toggleTema() {
    const nuevo = !modoOscuro;
    setModoOscuro(nuevo);
    if (nuevo) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dignalearn_tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dignalearn_tema", "light");
    }
  }

  const cardBg = esModoOscuro ? "rgba(255,255,255,0.06)" : "rgba(22,11,36,0.03)";
  const cardBorder = esModoOscuro ? "rgba(255,255,255,0.16)" : "rgba(22,11,36,0.14)";
  const textoSecundario = esModoOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)";
  const cardStyle = { backgroundColor: cardBg, border: `1.5px solid ${cardBorder}` };

  return (
    <div className="relative p-5 max-w-3xl mx-auto">
      <FondoAnimado esModoOscuro={esModoOscuro} />

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 text-3xl font-bold mb-6"
        style={{ color: "var(--foreground)" }}
      >
        Extras
      </motion.h1>

      {/* Configuración */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={seccionVariants}
        transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
        whileHover={{ scale: 1.03, boxShadow: "0 16px 36px rgba(240,168,182,0.22)" }}
        className="relative z-10 overflow-hidden rounded-2xl p-6 mb-4"
        style={{
          background: esModoOscuro
            ? "linear-gradient(135deg, rgba(240,168,182,0.14), rgba(164,205,213,0.08))"
            : "linear-gradient(135deg, rgba(240,168,182,0.12), rgba(164,205,213,0.06))",
          border: `1.5px solid ${cardBorder}`,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(240,168,182,0.18)", color: "#F0A8B6" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={modoOscuro ? "moon" : "sun"}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.35 }}
                  className="w-6 h-6"
                >
                  {modoOscuro ? <IconoLuna /> : <IconoSol />}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Modo oscuro
              </p>
              <p className="text-xs mt-0.5" style={{ color: textoSecundario }}>
                Cambia la apariencia de la plataforma
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTema}
            className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0"
            style={{ backgroundColor: modoOscuro ? "#F0A8B6" : "#D1D5DB" }}
            aria-label={modoOscuro ? "Desactivar modo oscuro" : "Activar modo oscuro"}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: modoOscuro ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
        </div>
      </motion.div>

      {/* Acerca de */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={seccionVariants}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.03, boxShadow: "0 16px 36px rgba(164,205,213,0.22)" }}
        className="relative z-10 rounded-2xl p-6 mb-4"
        style={cardStyle}
      >
        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Acerca de DignaLearn
        </h2>
        <p className="text-sm mb-4" style={{ color: textoSecundario }}>
          Experiencia educativa gamificada para la asignatura &quot;Derechos y Dignidad de la Mujer&quot; del MINED Nicaragua. Fortalecemos el aprendizaje de los derechos y la dignidad de la mujer en Nicaragua, haciendo que cada estudiante descubra, comprenda y viva estos valores en su vida diaria.
        </p>
        <p className="text-xs" style={{ color: textoSecundario }}>
          Contenido educativo basado en documentos oficiales del MINED Nicaragua.
        </p>
      </motion.div>

      {/* Equipo */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={seccionVariants}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.015 }}
        className="relative z-10 rounded-2xl p-6 mb-4"
        style={cardStyle}
      >
        <h2 className="text-base font-semibold mb-5" style={{ color: "var(--foreground)" }}>
          Equipo Rysteam
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {EQUIPO.map((miembro, idx) => {
            const color = idx % 2 === 0 ? "#F0A8B6" : "#A4CDD5";
            return (
              <motion.div
                key={miembro.nombre}
                initial={{ opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, boxShadow: `0 14px 32px ${color}55` }}
                className="flex flex-col items-center text-center rounded-2xl p-4 flex-1 basis-[120px] max-w-[150px]"
                style={{ backgroundColor: esModoOscuro ? "rgba(255,255,255,0.04)" : "rgba(22,11,36,0.02)", border: `1px solid ${cardBorder}` }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3 shrink-0"
                  style={{ backgroundColor: `${color}26` }}
                >
                  <IconoMiembroAnimado tipo={miembro.icono} color={color} />
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
                  {miembro.nombre}
                </p>
                <p className="text-xs mt-1" style={{ color: textoSecundario }}>
                  {miembro.rol}
                </p>
              </motion.div>
            );
          })}
        </div>
        <p className="text-xs mt-5 text-center" style={{ color: textoSecundario }}>
          Hecho con ❤️ en Nicaragua · Hackathon Nicaragua 2026
        </p>
      </motion.div>

      {/* Política de privacidad */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={seccionVariants}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.03, boxShadow: "0 16px 36px rgba(164,205,213,0.22)" }}
        className="relative z-10 rounded-2xl p-6"
        style={cardStyle}
      >
        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          Política de privacidad
        </h2>
        <div className="flex flex-col gap-3 text-sm" style={{ color: textoSecundario }}>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Datos que recopilamos:</span>{" "}
            nombre para mostrar, código de acceso y progreso académico dentro de la plataforma.
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Lo que NO recopilamos:</span>{" "}
            datos personales sensibles de menores, correo electrónico de estudiantes, ni información financiera.
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Uso de datos:</span>{" "}
            los datos se utilizan exclusivamente para mostrar el progreso del estudiante y permitir que el docente acompañe el aprendizaje. No se venden ni comparten con terceros.
          </p>
          <p>
            <span className="font-medium" style={{ color: "var(--foreground)" }}>Alineado con:</span>{" "}
            Ley N° 787 de Protección de Datos Personales de Nicaragua.
          </p>
        </div>
        <p className="text-xs mt-4" style={{ color: textoSecundario }}>
          Consultas: contacto@dignalearn.com
        </p>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10 text-center text-xs mt-6"
        style={{ color: textoSecundario }}
      >
        © 2026 DignaLearn — Equipo Rysteam · Hackathon Nicaragua 2026
      </motion.p>
    </div>
  );
}
