import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

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

export function getEstudianteLocal(): EstudianteProfile | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("dignalearn_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as EstudianteProfile;
  } catch {
    return null;
  }
}

export async function loginEstudiante(
  codigo: string,
  pin: string
): Promise<EstudianteProfile> {
  const codigoNormalizado = codigo.trim().toUpperCase();

  const { data: perfil, error } = await supabase
    .from("perfiles_estudiante")
    .select("id, usuario_id, grado_id, codigo_acceso, pin_hash, usuarios(nombre_display)")
    .eq("codigo_acceso", codigoNormalizado)
    .single();

  if (error || !perfil) {
    throw new Error("Código de acceso no encontrado.");
  }

  const pinValido = await bcrypt.compare(pin, perfil.pin_hash);
  if (!pinValido) {
    throw new Error("PIN incorrecto.");
  }

  const perfilEstudiante: EstudianteProfile = {
    id: perfil.id,
    usuario_id: perfil.usuario_id,
    grado_id: perfil.grado_id,
    codigo_acceso: perfil.codigo_acceso,
    nombre_display: perfil.usuarios?.nombre_display ?? null,
  };

  localStorage.setItem("dignalearn_user", JSON.stringify(perfilEstudiante));

  return perfilEstudiante;
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
    .single();

  return {
    id: perfil?.id ?? data.user.id,
    usuario_id: data.user.id,
    email: data.user.email ?? null,
    nombre_display: perfil?.usuarios?.nombre_display ?? null,
    nombre_escuela: perfil?.nombre_escuela ?? null,
  };
}
