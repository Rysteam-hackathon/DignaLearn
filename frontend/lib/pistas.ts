const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

// Contenido de ayuda público (sin JWT) — igual criterio que el contenido
// de unidades/temas: no es información sensible del estudiante.
export async function obtenerPistaPorTipo(tipoActividad: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/pistas/${tipoActividad}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.texto_pista ?? null;
  } catch (error) {
    console.error("Error al obtener pista:", error);
    return null;
  }
}
