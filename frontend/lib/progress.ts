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
  valor_condicion: number | null;
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
    valor_condicion: item.valor_condicion,
  }));
}

export interface ProgresoTemaResumen {
  tema_id: string;
  lectura_completada: boolean;
  actividad_completada: boolean;
  reflexion_respondida: boolean;
  completado_en: string | null;
}

export async function obtenerProgresoEstudiante(
  estudianteId: string,
  temaId?: string
): Promise<ProgresoTemaResumen[]> {
  const query = temaId ? `?tema_id=${encodeURIComponent(temaId)}` : "";
  const res = await apiFetch(`/api/progress/estudiante/${estudianteId}${query}`);
  if (!res.ok) return [];
  return res.json();
}

export async function obtenerProgresoPorTema(
  estudianteId: string,
  temaId: string
): Promise<ProgresoTema> {
  const filas = await obtenerProgresoEstudiante(estudianteId, temaId);
  const data = filas[0];

  if (!data) {
    return PROGRESO_VACIO;
  }

  return {
    lectura_completada: data.lectura_completada,
    actividad_completada: data.actividad_completada,
    reflexion_respondida: data.reflexion_respondida,
    completado_en: data.completado_en,
    logros_desbloqueados: [],
  };
}

export interface RachaFecha {
  fecha_actividad: string;
}

export async function obtenerRacha(estudianteId: string): Promise<string[]> {
  const res = await apiFetch(`/api/progress/racha/${estudianteId}`);
  if (!res.ok) return [];
  const data: RachaFecha[] = await res.json();
  return data.map((d) => d.fecha_actividad);
}

export interface LogroConDetalle {
  id: string;
  desbloqueado_en: string;
  logros: {
    titulo: string;
    descripcion: string | null;
    tipo_condicion: string;
    valor_condicion: number | null;
    niveles_logro: { nombre: string | null } | null;
  } | null;
}

export async function obtenerLogrosEstudiante(estudianteId: string): Promise<LogroConDetalle[]> {
  const res = await apiFetch(`/api/progress/logros/${estudianteId}`);
  if (!res.ok) return [];
  return res.json();
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
  const res = await apiFetch(`/api/progress/registrar-actividad/${estudianteId}`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("No se pudo registrar la actividad diaria.");
  }
}
