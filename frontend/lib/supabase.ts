import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente CON sesión persistente — SOLO para el flujo de Docente
// (Supabase Auth real: login, panel docente, logout).
// NUNCA importar este cliente desde páginas de estudiante.
export const supabaseDocente = createClient(supabaseUrl, supabaseAnonKey);

// Cliente SIN sesión persistente — para lecturas de catálogo público
// (grados, unidades, temas) desde páginas de Estudiante. El estudiante
// nunca usa Supabase Auth (JWT propio vía backend), así que este
// cliente jamás debe acumular ni heredar una sesión de auth.signIn.
export const supabaseEstudiante = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, storageKey: "sb-estudiante-sin-uso" },
});
