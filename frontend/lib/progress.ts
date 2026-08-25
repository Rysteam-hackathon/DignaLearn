import { supabase } from "@/lib/supabase";

export type ElementoProgreso = "lectura" | "actividad" | "reflexion";

export const PROGRESO_ACTUALIZADO_EVENT = "progreso-actualizado";

export interface ProgresoTema {
  lectura_completada: boolean;
  actividad_completada: boolean;
  reflexion_respondida: boolean;
  completado_en: string | null;
}

const PROGRESO_VACIO: ProgresoTema = {
  lectura_completada: false,
  actividad_completada: false,
  reflexion_respondida: false,
  completado_en: null,
};

export async function obtenerProgresoPorTema(
  estudianteId: string,
  temaId: string
): Promise<ProgresoTema> {
  const { data } = await supabase
    .from("progreso_estudiante")
    .select("lectura_completada, actividad_completada, reflexion_respondida, completado_en")
    .eq("estudiante_id", estudianteId)
    .eq("tema_id", temaId)
    .maybeSingle();

  if (!data) {
    return PROGRESO_VACIO;
  }

  return data;
}

export async function marcarElementoCompletado(
  estudianteId: string,
  temaId: string,
  elemento: ElementoProgreso
): Promise<ProgresoTema> {
  const actual = await obtenerProgresoPorTema(estudianteId, temaId);

  const nuevoEstado: ProgresoTema = { ...actual };
  if (elemento === "lectura") nuevoEstado.lectura_completada = true;
  if (elemento === "actividad") nuevoEstado.actividad_completada = true;
  if (elemento === "reflexion") nuevoEstado.reflexion_respondida = true;

  const completado =
    nuevoEstado.lectura_completada &&
    nuevoEstado.actividad_completada &&
    nuevoEstado.reflexion_respondida;

  nuevoEstado.completado_en = completado
    ? actual.completado_en ?? new Date().toISOString()
    : null;

  const { data, error } = await supabase
    .from("progreso_estudiante")
    .upsert(
      {
        estudiante_id: estudianteId,
        tema_id: temaId,
        lectura_completada: nuevoEstado.lectura_completada,
        actividad_completada: nuevoEstado.actividad_completada,
        reflexion_respondida: nuevoEstado.reflexion_respondida,
        completado_en: nuevoEstado.completado_en,
      },
      { onConflict: "estudiante_id,tema_id" }
    )
    .select("lectura_completada, actividad_completada, reflexion_respondida, completado_en")
    .single();

  if (error || !data) {
    throw new Error("No se pudo actualizar el progreso.");
  }

  return data;
}

export async function registrarActividadDiaria(estudianteId: string): Promise<void> {
  const hoy = new Date().toISOString().split("T")[0];

  const { data: existente } = await supabase
    .from("actividad_diaria")
    .select("id, elementos_completados")
    .eq("estudiante_id", estudianteId)
    .eq("fecha_actividad", hoy)
    .maybeSingle();

  if (existente) {
    await supabase
      .from("actividad_diaria")
      .update({ elementos_completados: existente.elementos_completados + 1 })
      .eq("id", existente.id);
  } else {
    await supabase
      .from("actividad_diaria")
      .insert({
        estudiante_id: estudianteId,
        fecha_actividad: hoy,
        elementos_completados: 1,
      });
  }
}
