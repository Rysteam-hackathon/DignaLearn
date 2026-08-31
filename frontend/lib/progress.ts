import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api";
import type { Logro } from "@/components/LogroCelebracion";

export type ElementoProgreso = "lectura" | "actividad" | "reflexion";

export const PROGRESO_ACTUALIZADO_EVENT = "progreso-actualizado";

export interface LogroDesbloqueadoApi {
  id: string;
  titulo: string;
  descripcion: string | null;
  icono_url: string | null;
  tipo_condicion: string;
  nivel_nombre: string | null;
}

export interface ProgresoTema {
  lectura_completada: boolean;
  actividad_completada: boolean;
  reflexion_respondida: boolean;
  completado_en: string | null;
  logros_desbloqueados: LogroDesbloqueadoApi[];
}

const PROGRESO_VACIO: ProgresoTema = {
  lectura_completada: false,
  actividad_completada: false,
  reflexion_respondida: false,
  completado_en: null,
  logros_desbloqueados: [],
};

// Mapea la forma que devuelve el backend (LogroDesbloqueado) a la que espera
// el componente LogroCelebracion. Centralizado acá para no repetirlo en cada
// componente que llama a marcarElementoCompletado.
export function mapLogrosDesbloqueados(items: LogroDesbloqueadoApi[]): Logro[] {
  return items.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    descripcion: item.descripcion,
    icono_url: item.icono_url,
    tipo_condicion: item.tipo_condicion,
    nivel: item.nivel_nombre ?? "tema",
  }));
}

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

  return { ...data, logros_desbloqueados: [] };
}

export async function marcarElementoCompletado(
  estudianteId: string,
  temaId: string,
  elemento: ElementoProgreso
): Promise<ProgresoTema> {
  const res = await apiFetch("/api/progress/completar-elemento", {
    method: "POST",
    body: JSON.stringify({
      estudiante_id: estudianteId,
      tema_id: temaId,
      elemento,
    }),
  });

  if (!res.ok) {
    throw new Error("No se pudo actualizar el progreso.");
  }

  return res.json();
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
