import { supabase } from "@/lib/supabase";

export default async function TemaPage({
  params,
}: {
  params: { unitId: string; topicId: string };
}) {
  const { data: tema } = await supabase
    .from("temas")
    .select("titulo, contenido_lectura")
    .eq("id", params.topicId)
    .single();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{tema?.titulo}</h1>
      <p className="text-base leading-relaxed whitespace-pre-line">
        {tema?.contenido_lectura}
      </p>
    </main>
  );
}
