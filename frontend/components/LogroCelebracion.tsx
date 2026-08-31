"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LogroIcono from "./LogroIcono";

export interface Logro {
  id: string;
  titulo: string;
  descripcion: string | null;
  icono_url: string | null;
  tipo_condicion: string;
  nivel: string;
}

interface LogroCelebracionProps {
  logro: Logro;
  onClose: () => void;
}

const AUTO_CIERRE_MS = 4000;
const COLORES_CONFETTI = ["#F0A8B6", "#A4CDD5"];
const CANTIDAD_CONFETTI = 10;

interface Particula {
  id: number;
  left: number;
  color: string;
  delay: number;
  duracion: number;
}

function generarConfetti(cantidad: number): Particula[] {
  return Array.from({ length: cantidad }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORES_CONFETTI[i % COLORES_CONFETTI.length],
    delay: Math.random() * 0.8,
    duracion: 1.8 + Math.random() * 1.2,
  }));
}

export default function LogroCelebracion({ logro, onClose }: LogroCelebracionProps) {
  const [visible, setVisible] = useState(true);
  const [particulas] = useState(() => generarConfetti(CANTIDAD_CONFETTI));

  const cerrar = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(cerrar, AUTO_CIERRE_MS);
    return () => clearTimeout(timer);
  }, [cerrar]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence onExitComplete={onClose}>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
          style={{ backgroundColor: "#160B24" }}
          role="dialog"
          aria-modal="true"
          aria-label={`Logro desbloqueado: ${logro.titulo}`}
          onClick={cerrar}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {particulas.map((p) => (
              <motion.span
                key={p.id}
                className="absolute top-0 rounded-sm"
                style={{
                  left: `${p.left}%`,
                  width: 8,
                  height: 8,
                  backgroundColor: p.color,
                }}
                initial={{ y: "-10vh", opacity: 0 }}
                animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
                transition={{ duration: p.duracion, delay: p.delay, ease: "easeIn" }}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              opacity: { duration: 0.3, delay: 0.2 },
              scale: { type: "spring", stiffness: 300, damping: 20, delay: 0.2 },
            }}
            className="relative flex flex-col items-center text-center max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="mb-6"
              initial={{ rotate: 0, scale: 1 }}
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              {logro.icono_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logro.icono_url}
                  alt=""
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <LogroIcono tipo_condicion={logro.tipo_condicion ?? ""} nivel={logro.nivel ?? "tema"} size={96} />
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-xs font-semibold tracking-wide uppercase text-white/60 mb-2"
            >
              ¡Logro desbloqueado!
            </motion.p>

            <h2 className="text-2xl font-bold mb-3" style={{ color: "#F0A8B6" }}>
              {logro.titulo}
            </h2>

            {logro.descripcion && (
              <p className="text-sm mb-8" style={{ color: "#A4CDD5" }}>
                {logro.descripcion}
              </p>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/logros"
                onClick={(e) => e.stopPropagation()}
                className="rounded-lg bg-white text-gray-900 text-sm font-medium px-5 py-2.5 hover:bg-white/90 transition-colors inline-block"
              >
                Ver mis logros
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
