"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { obtenerPistaPorTipo } from "@/lib/pistas";

interface MascotaProps {
  tiposActividad: string[];
}

const NOMBRE_POR_TIPO: Record<string, string> = {
  sopa_letras: "Sopa de letras",
  quiz: "Quiz",
  conectores: "Conectores",
  clasificacion: "Clasificación",
  rompecabezas: "Rompecabezas",
};

interface PistaCargada {
  tipo: string;
  texto: string | null;
}

function useModoOscuro(): boolean {
  const [esOscuro, setEsOscuro] = useState(false);
  useEffect(() => {
    const detectar = () => setEsOscuro(document.documentElement.classList.contains("dark"));
    detectar();
    const observer = new MutationObserver(detectar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return esOscuro;
}

function IconoMascota() {
  return (
    <svg viewBox="0 0 44 44" width="26" height="26" fill="none">
      <circle cx="22" cy="22" r="20" fill="#160B24" />
      <circle cx="15" cy="19" r="2.5" fill="#F0A8B6" />
      <circle cx="29" cy="19" r="2.5" fill="#F0A8B6" />
      <path
        d="M18 28c1.5 1.5 6.5 1.5 8 0"
        stroke="#A4CDD5"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Mascota({ tiposActividad }: MascotaProps) {
  const esOscuro = useModoOscuro();
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [pistas, setPistas] = useState<PistaCargada[]>([]);

  async function handleClick() {
    if (abierto) {
      setAbierto(false);
      return;
    }
    setAbierto(true);

    if (pistas.length === 0 && tiposActividad.length > 0) {
      setCargando(true);
      const resultados = await Promise.all(
        tiposActividad.map(async (tipo) => ({
          tipo,
          texto: await obtenerPistaPorTipo(tipo),
        }))
      );
      setPistas(resultados);
      setCargando(false);
    }
  }

  if (tiposActividad.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-2xl p-4 w-72 max-w-[80vw]"
            style={{
              backgroundColor: esOscuro ? "#160B24" : "#ffffff",
              border: `1px solid ${esOscuro ? "rgba(255,255,255,0.12)" : "rgba(22,11,36,0.12)"}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wide mb-2"
              style={{ color: "#F0A8B6" }}
            >
              💡 Una ayudita
            </p>

            {cargando ? (
              <p className="text-sm" style={{ color: esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)" }}>
                Pensando...
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {pistas.map(({ tipo, texto }) => (
                  <div key={tipo}>
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: esOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.45)" }}
                    >
                      {NOMBRE_POR_TIPO[tipo] ?? tipo}
                    </p>
                    <p className="text-sm leading-snug" style={{ color: esOscuro ? "#ffffff" : "#160B24" }}>
                      {texto ?? "Todavía no hay pista para esta actividad."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleClick}
        aria-label="Pedir una pista"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#F0A8B6", boxShadow: "0 6px 16px rgba(240,168,182,0.5)" }}
      >
        <IconoMascota />
      </motion.button>
    </div>
  );
}
