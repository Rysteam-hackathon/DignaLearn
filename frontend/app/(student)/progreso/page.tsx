"use client";

import Link from "next/link";

export default function ProgresoPage() {
  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#160B24" }}>
        Progreso
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Tu historial de actividad y logros.
      </p>
      <Link
        href="/logros"
        className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 hover:bg-gray-50 transition-colors"
      >
        <span className="text-2xl" aria-hidden>🏆</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">Ver mis logros</p>
          <p className="text-xs text-gray-400">Todos tus logros desbloqueados</p>
        </div>
      </Link>
    </div>
  );
}
