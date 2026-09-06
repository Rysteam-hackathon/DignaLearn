"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastErrorProps {
  mensaje: string | null;
  onCerrar: () => void;
  esOscuro: boolean;
}

const DURACION_MS = 4000;

export default function ToastError({ mensaje, onCerrar, esOscuro }: ToastErrorProps) {
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(onCerrar, DURACION_MS);
    return () => clearTimeout(timer);
  }, [mensaje, onCerrar]);

  return (
    <AnimatePresence>
      {mensaje && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="alert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium max-w-[90vw] text-center"
          style={{
            backgroundColor: esOscuro ? "#160B24" : "#ffffff",
            color: esOscuro ? "#ffffff" : "#160B24",
            border: "1px solid rgba(240,168,182,0.5)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          ⚠️ {mensaje}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
