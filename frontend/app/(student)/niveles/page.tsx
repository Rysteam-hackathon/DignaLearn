import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function NivelesPage() {
  const { data: grado } = await supabase
    .from("grados")
    .select("id")
    .eq("numero_grado", 7)
    .eq("nivel", "secundaria")
    .single();

  const { data: unidades } = await supabase
    .from("unidades")
    .select("id, titulo, numero_unidad")
    .eq("grado_id", grado?.id)
    .order("numero_unidad", { ascending: true });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Unidades</h1>
      <div className="grid gap-4">
        {unidades?.map((unidad) => (
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
