import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function UnidadPage({
  params,
}: {
  params: { unitId: string };
}) {
  const { data: temas } = await supabase
    .from("temas")
    .select("id, titulo, orden")
    .eq("unidad_id", params.unitId)
    .order("orden", { ascending: true });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/niveles" className="text-sm text-gray-500 hover:underline">
        ← Volver a Unidades
      </Link>
      <h1 className="text-2xl font-bold mb-6 mt-2">Temas</h1>
      <div className="grid gap-4">
        {temas?.map((tema) => (
          <Link
            key={tema.id}
            href={`/niveles/${params.unitId}/${tema.id}`}
            className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <p className="text-sm text-gray-500">Tema {tema.orden}</p>
            <h2 className="text-lg font-semibold">{tema.titulo}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
