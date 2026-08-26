"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getEstudianteLocal } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio",   emoji: "🏠" },
  { href: "/niveles",   label: "Niveles",  emoji: "📖" },
  { href: "/historia",  label: "Historia", emoji: "🎭" },
  { href: "/progreso",  label: "Progreso", emoji: "📊" },
  { href: "/extras",    label: "Extras",   emoji: "⭐" },
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
      {/* Sidebar — solo desktop */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-[#F0A8B6]/20 bg-[#160B24] px-4 py-6 shrink-0">
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
      <main className="flex-1 pb-20 md:pb-0 bg-[var(--background)] transition-colors">
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
