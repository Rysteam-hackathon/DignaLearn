"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal } from "@/lib/auth";

interface Unidad {
  id: string;
  titulo: string;
  numero_unidad: number;
}

export default function NivelesPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [gradoNombre, setGradoNombre] = useState<string>("");

  useEffect(() => {
    async function cargarUnidades() {
      const estudiante = getEstudianteLocal();
      if (!estudiante) {
        setCargando(false);
        return;
      }

      const { data: grado } = await supabase
        .from("grados")
        .select("numero_grado, nivel")
        .eq("id", estudiante.grado_id)
        .single();

      if (grado) {
        setGradoNombre(`${grado.numero_grado}mo grado — ${grado.nivel}`);
      }

      const { data } = await supabase
        .from("unidades")
        .select("id, titulo, numero_unidad")
        .eq("grado_id", estudiante.grado_id)
        .order("numero_unidad", { ascending: true });

      setUnidades(data ?? []);
      setCargando(false);
    }

    cargarUnidades();
  }, []);

  if (cargando) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-sm text-gray-500">Cargando unidades...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Unidades</h1>
      {gradoNombre && (
        <p className="text-sm text-gray-500 mb-6">{gradoNombre}</p>
      )}
      <div className="grid gap-4">
        {unidades.map((unidad) => (
          <Link
            key={unidad.id}
            href={`/niveles/${unidad.id}`}
            className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm text-gray-500">Unidad {unidad.numero_unidad}</p>
            <h2 className="text-lg font-semibold">{unidad.titulo}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
