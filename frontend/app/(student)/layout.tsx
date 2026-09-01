"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getEstudianteLocal } from "@/lib/auth";
import FondoAnimado from "@/components/FondoAnimado";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio",   emoji: "🏠" },
  { href: "/niveles",   label: "Niveles",  emoji: "📖" },
  { href: "/historia",  label: "Historia", emoji: "🎭" },
  { href: "/progreso",  label: "Progreso", emoji: "📊" },
  { href: "/extras",    label: "Extras",   emoji: "⭐" },
];

interface FiguraFondo {
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  distancia: number;
  opLight: number;
  opDark: number;
  variante?: "alt";
}

const FIGURAS_FONDO: FiguraFondo[] = [
  { top: "6%",  left: "8%",  size: 90,  duration: 7.5,  delay: 0,    distancia: -20, opLight: 0.05, opDark: 0.06 },
  { top: "18%", left: "82%", size: 130, duration: 9,    delay: 1.2,  distancia: -26, opLight: 0.04, opDark: 0.07, variante: "alt" },
  { top: "38%", left: "22%", size: 60,  duration: 6,    delay: 2.4,  distancia: -16, opLight: 0.06, opDark: 0.08 },
  { top: "48%", left: "70%", size: 200, duration: 10.5, delay: 0.6,  distancia: -30, opLight: 0.03, opDark: 0.05, variante: "alt" },
  { top: "62%", left: "5%",  size: 110, duration: 8.2,  delay: 3.1,  distancia: -22, opLight: 0.05, opDark: 0.06 },
  { top: "72%", left: "45%", size: 45,  duration: 5.5,  delay: 1.8,  distancia: -14, opLight: 0.06, opDark: 0.08, variante: "alt" },
  { top: "84%", left: "88%", size: 150, duration: 9.8,  delay: 0,    distancia: -24, opLight: 0.04, opDark: 0.06 },
  { top: "10%", left: "48%", size: 70,  duration: 6.8,  delay: 2.9,  distancia: -18, opLight: 0.05, opDark: 0.07, variante: "alt" },
  { top: "90%", left: "18%", size: 95,  duration: 7.2,  delay: 1.4,  distancia: -20, opLight: 0.04, opDark: 0.06 },
  { top: "55%", left: "92%", size: 55,  duration: 5.9,  delay: 3.6,  distancia: -15, opLight: 0.06, opDark: 0.08, variante: "alt" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const estudiante = getEstudianteLocal();
    if (!estudiante) {
      router.replace("/login");
    }
    const temaGuardado = localStorage.getItem("dignalearn_tema");
    if (temaGuardado === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)] transition-colors">
      {/* Fondo animado — figuras temáticas SVG (venus/libro/estrella/balanza/lápiz) */}
      <FondoAnimado />

      {/* Fondo animado — círculos flotantes, no interfiere con clicks */}
      <div className="fondo-flotante" aria-hidden="true">
        {FIGURAS_FONDO.map((figura, idx) => (
          <span
            key={idx}
            className={`figura-flotante${figura.variante === "alt" ? " figura-flotante--alt" : ""}`}
            style={{
              top: figura.top,
              left: figura.left,
              width: figura.size,
              height: figura.size,
              animationDuration: `${figura.duration}s`,
              animationDelay: `${figura.delay}s`,
              ["--flota-dist" as string]: `${figura.distancia}px`,
              ["--op-light" as string]: figura.opLight,
              ["--op-dark" as string]: figura.opDark,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Sidebar — solo desktop */}
      <aside className="relative z-10 hidden md:flex flex-col w-56 min-h-screen border-r border-[#F0A8B6]/20 bg-[#160B24] px-4 py-6 shrink-0">
        <p className="text-lg font-bold mb-8 px-2 text-white">
          Digna<span style={{ color: "#A4CDD5" }}>Learn</span>
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const activo = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activo
                    ? "bg-[#F0A8B6]/20 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-base" aria-hidden>{item.emoji}</span>
                {item.label}
                {activo && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F0A8B6]" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="relative z-10 flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — solo mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden border-t border-[#F0A8B6]/20 bg-[#160B24]">
        {NAV_ITEMS.map((item) => {
          const activo = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            >
              <span className="text-xl" aria-hidden>{item.emoji}</span>
              <span
                className="text-[10px] font-medium"
                style={{ color: activo ? "#F0A8B6" : "rgba(255,255,255,0.4)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
