"use client";
import Link from "next/link";

export default function HistoriaPage() {
  return (
    <div className="p-5 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-6xl mb-6" aria-hidden>📖</p>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "#160B24" }}>
        Modo Historia
      </h1>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        El modo historia estará disponible muy pronto. Seguí completando temas mientras tanto.
      </p>
      <Link
        href="/niveles"
        className="rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
      >
        Ir a Unidades →
      </Link>
    </div>
  );
}
