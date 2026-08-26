"use client";

import { useEffect } from "react";
import Link from "next/link";
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

export default function LogroCelebracion({ logro, onClose }: LogroCelebracionProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_CIERRE_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-logro-overlay-fade"
      style={{ backgroundColor: "#160B24" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Logro desbloqueado: ${logro.titulo}`}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center text-center max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="animate-logro-pop mb-6">
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
        </div>

        <p className="text-xs font-semibold tracking-wide uppercase text-white/60 mb-2">
          ¡Logro desbloqueado!
        </p>

        <h2 className="text-2xl font-bold mb-3" style={{ color: "#F0A8B6" }}>
          {logro.titulo}
        </h2>

        {logro.descripcion && (
          <p className="text-sm mb-8" style={{ color: "#A4CDD5" }}>
            {logro.descripcion}
          </p>
        )}

        <Link
          href="/logros"
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg bg-white text-gray-900 text-sm font-medium px-5 py-2.5 hover:bg-white/90 transition-colors"
        >
          Ver mis logros
        </Link>
      </div>
    </div>
  );
}
