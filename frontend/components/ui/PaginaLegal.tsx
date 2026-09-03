"use client";
import { motion, type TargetAndTransition } from "framer-motion";
import Link from "next/link";
import LogoDignaLearn from "@/components/ui/LogoDignaLearn";

interface ElementoFlotante {
  simbolo: string;
  top?: string; bottom?: string;
  left?: string; right?: string;
  color: string;
  size: string;
  duracion: number;
  animacion: TargetAndTransition;
}

interface PaginaLegalProps {
  badge: string;
  titulo: string;
  subtitulo: string;
  elementos: ElementoFlotante[];
  children: React.ReactNode;
}

export default function PaginaLegal({
  badge, titulo, subtitulo, elementos, children
}: PaginaLegalProps) {
  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "#160B24" }}
    >
      {/* Fondo animado */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
           aria-hidden="true">
        {elementos.map((el, i) => (
          <motion.span
            key={i}
            className="absolute select-none"
            style={{
              top: el.top, bottom: el.bottom,
              left: el.left, right: el.right,
              color: el.color, opacity: 0.08,
              fontSize: el.size,
            }}
            animate={el.animacion}
            transition={{
              duration: el.duracion,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {el.simbolo}
          </motion.span>
        ))}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center
                 px-6 py-4 border-b border-white/5"
           style={{ backgroundColor: "rgba(22,11,36,0.85)",
                    backdropFilter: "blur(12px)" }}>
        <LogoDignaLearn size={36} showWordmark={true} darkBackground={true} />
        <Link
          href="/"
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          ← Volver al inicio
        </Link>
      </nav>

      {/* Contenido */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-6 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {/* Badge */}
        <span className="inline-block bg-[#F0A8B6]/15 text-[#F0A8B6]
                         rounded-full px-4 py-1.5 text-sm mb-4">
          {badge}
        </span>

        {/* Título */}
        <h1
          className="text-4xl md:text-5xl font-bold text-white mt-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {titulo}
        </h1>

        {/* Subtítulo */}
        <p className="text-white/50 mt-3 text-sm">{subtitulo}</p>

        <hr className="border-white/10 my-8" />

        {/* Contenido de la página */}
        {children}

        {/* Footer */}
        <div className="text-center text-white/30 text-sm mt-16 pb-8">
          <p>© 2026 DignaLearn — Equipo Rysteam · Hackathon Nicaragua 2026</p>
          <Link
            href="/"
            className="text-[#F0A8B6]/60 hover:text-[#F0A8B6]
                       transition-colors mt-2 inline-block"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export function SeccionLegal({
  titulo, color, children
}: {
  titulo: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <h2
        className="font-semibold text-lg mb-3"
        style={{ color }}
      >
        {titulo}
      </h2>
      <div className="text-white/70 leading-relaxed text-sm space-y-2">
        {children}
      </div>
    </motion.div>
  );
}
