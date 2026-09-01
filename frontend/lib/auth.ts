import { supabase } from "@/lib/supabase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

export interface EstudianteProfile {
  id: string;
  usuario_id: string;
  grado_id: number;
  codigo_acceso: string;
  nombre_display: string | null;
}

export interface DocenteProfile {
  id: string;
  usuario_id: string;
  email: string | null;
  nombre_display: string | null;
  nombre_escuela: string | null;
}

interface TokenEstudiantePayload {
  sub: string;
  grado_id: number;
  access_code: string;
  nombre: string | null;
  iat: number;
  exp: number;
}

export function getEstudianteLocal(): EstudianteProfile | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("dignalearn_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as TokenEstudiantePayload;
    return {
      id: payload.sub,
      usuario_id: payload.sub,
      grado_id: payload.grado_id,
      codigo_acceso: payload.access_code,
      nombre_display: payload.nombre ?? null,
    };
  } catch {
    localStorage.removeItem("dignalearn_token");
    localStorage.removeItem("dignalearn_rol");
    return null;
  }
}

export async function loginEstudiante(
  codigo: string,
  pin: string
): Promise<EstudianteProfile> {
  const codigoNormalizado = codigo.trim().toUpperCase();

  const res = await fetch(`${BACKEND_URL}/api/auth/login-estudiante`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_code: codigoNormalizado, pin }),
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Código o PIN incorrecto.");
  }
  if (!res.ok) {
    throw new Error("No se pudo iniciar sesión.");
  }

  const data = await res.json();

  localStorage.setItem("dignalearn_token", data.token);
  localStorage.setItem("dignalearn_rol", "estudiante");
  localStorage.removeItem("dignalearn_user");

  return {
    id: data.estudiante_id,
    usuario_id: data.estudiante_id,
    grado_id: data.grado_id,
    codigo_acceso: data.access_code,
    nombre_display: data.nombre ?? null,
  };
}

export async function loginDocente(
  email: string,
  password: string
): Promise<DocenteProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "No se pudo iniciar sesión.");
  }

  const { data: perfil } = await supabase
    .from("perfiles_docente")
    .select("id, usuario_id, nombre_escuela, usuarios(nombre_display)")
    .eq("usuario_id", data.user.id)
    .maybeSingle();

  return {
    id: perfil?.id ?? data.user.id,
    usuario_id: data.user.id,
    email: data.user.email ?? null,
    nombre_display: (perfil?.usuarios as unknown as { nombre_display: string | null } | null)?.nombre_display ?? null,
    nombre_escuela: perfil?.nombre_escuela ?? null,
  };
}
