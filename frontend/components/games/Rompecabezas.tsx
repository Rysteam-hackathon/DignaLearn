"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import { getEstudianteLocal } from "@/lib/auth";
import { marcarElementoCompletado, mapLogrosDesbloqueados, PROGRESO_ACTUALIZADO_EVENT } from "@/lib/progress";
import LogroCelebracion, { type Logro } from "@/components/LogroCelebracion";

interface RompecabezasConfig {
  imagen_url: string;
  filas: number;
  columnas: number;
}

interface RompecabezasProps {
  config: RompecabezasConfig;
  temaId: string;
}

const CELDA_PX = 100;

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

function mezclar(total: number): number[] {
  const orden = Array.from({ length: total }, (_, i) => i);
  let resuelto = true;
  do {
    for (let i = orden.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [orden[i], orden[j]] = [orden[j], orden[i]];
    }
    resuelto = orden.every((v, i) => v === i);
  } while (resuelto && total > 1);
  return orden;
}

export default function Rompecabezas({ config, temaId }: RompecabezasProps) {
  const { imagen_url, filas, columnas } = config;
  const esOscuro = useModoOscuro();
  const total = filas * columnas;

  const [orden, setOrden] = useState<number[]>(() => mezclar(total));
  const [progresoGuardado, setProgresoGuardado] = useState(false);
  const [logrosQueue, setLogrosQueue] = useState<Logro[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLogroCierre = useCallback(() => {
    setTimeout(() => {
      setLogrosQueue((prev) => prev.slice(1));
    }, 500);
  }, []);

  const completo = useMemo(() => orden.every((piezaIndex, slotIndex) => piezaIndex === slotIndex), [orden]);

  function handleDragEnd(slotOrigen: number, info: PanInfo) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const relX = info.point.x - rect.left;
    const relY = info.point.y - rect.top;
    const col = Math.min(Math.max(Math.floor(relX / CELDA_PX), 0), columnas - 1);
    const row = Math.min(Math.max(Math.floor(relY / CELDA_PX), 0), filas - 1);
    const slotDestino = row * columnas + col;

    if (slotDestino === slotOrigen) return;

    setOrden((prev) => {
      const copia = [...prev];
      [copia[slotOrigen], copia[slotDestino]] = [copia[slotDestino], copia[slotOrigen]];
      return copia;
    });
  }

  useEffect(() => {
    if (!completo || progresoGuardado) return;

    const estudiante = getEstudianteLocal();
    if (!estudiante) return;

    setProgresoGuardado(true);
    marcarElementoCompletado(estudiante.id, temaId, "actividad")
      .then((actualizado) => {
        window.dispatchEvent(new Event(PROGRESO_ACTUALIZADO_EVENT));
        if (actualizado.logros_desbloqueados.length > 0) {
          setLogrosQueue(mapLogrosDesbloqueados(actualizado.logros_desbloqueados));
        }
      })
      .catch((error) => {
        console.error("Error al guardar progreso (Rompecabezas):", error);
      });
  }, [completo, progresoGuardado, temaId]);

  return (
    <>
      {logrosQueue.length > 0 && (
        <LogroCelebracion
          key={logrosQueue[0].id}
          logro={logrosQueue[0]}
          onClose={handleLogroCierre}
        />
      )}

      <p className="text-sm mb-3" style={{ color: esOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.5)" }}>
        Arrastrá las piezas para armar la imagen completa.
      </p>

      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden select-none"
        style={{
          width: columnas * CELDA_PX,
          height: filas * CELDA_PX,
          border: `2px solid ${esOscuro ? "rgba(255,255,255,0.15)" : "rgba(22,11,36,0.15)"}`,
        }}
      >
        {orden.map((piezaIndex, slotIndex) => {
          const slotCol = slotIndex % columnas;
          const slotRow = Math.floor(slotIndex / columnas);
          const piezaCol = piezaIndex % columnas;
          const piezaRow = Math.floor(piezaIndex / columnas);
          const correcta = piezaIndex === slotIndex;

          return (
            <motion.div
              key={piezaIndex}
              drag={!correcta}
              dragMomentum={false}
              dragElastic={0.15}
              dragConstraints={containerRef}
              onDragEnd={(_e, info) => handleDragEnd(slotIndex, info)}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              animate={{
                x: slotCol * CELDA_PX,
                y: slotRow * CELDA_PX,
                boxShadow: correcta
                  ? "0 0 0 3px #A4CDD5, 0 0 14px rgba(164,205,213,0.7)"
                  : "0 0 0 1px rgba(0,0,0,0.08)",
                scale: correcta ? 1 : 1,
              }}
              className="absolute top-0 left-0"
              style={{
                width: CELDA_PX,
                height: CELDA_PX,
                backgroundImage: `url(${imagen_url})`,
                backgroundSize: `${columnas * 100}% ${filas * 100}%`,
                backgroundPositionX: columnas > 1 ? `${(piezaCol / (columnas - 1)) * 100}%` : "0%",
                backgroundPositionY: filas > 1 ? `${(piezaRow / (filas - 1)) * 100}%` : "0%",
                cursor: correcta ? "default" : "grab",
                zIndex: correcta ? 1 : 2,
              }}
            />
          );
        })}
      </div>

      {completo && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold text-emerald-600 mt-4"
        >
          ¡Armaste el rompecabezas!
        </motion.p>
      )}
    </>
  );
}
