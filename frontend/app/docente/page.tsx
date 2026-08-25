"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

interface EstudianteResumen {
  id: string;
  nombre_display: string | null;
  codigo_acceso: string;
  grado_id: number;
  temas_completados: number;
  ultima_actividad: string | null;
}

interface DocenteSession {
  usuario_id: string;
  nombre_display: string | null;
  nombre_escuela: string | null;
}

export default function DocentePage() {
  const router = useRouter();
  const [docente, setDocente] = useState<DocenteSession | null>(null);
  const [estudiantes, setEstudiantes] = useState<EstudianteResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [creando, setCreando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoGrado, setNuevoGrado] = useState<number>(7);
  const [nuevoPin, setNuevoPin] = useState("");
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

  useEffect(() => {
    async function verificarSesion() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }
      const { data: perfil } = await supabase
        .from("perfiles_docente")
        .select("nombre_escuela, usuarios(nombre_display)")
        .eq("usuario_id", data.user.id)
        .single();

      setDocente({
        usuario_id: data.user.id,
        nombre_display:
          (perfil?.usuarios as unknown as { nombre_display: string } | null)
            ?.nombre_display ?? null,
        nombre_escuela: perfil?.nombre_escuela ?? null,
      });
    }
    verificarSesion();
  }, [router]);

  const cargarEstudiantes = useCallback(async () => {
    if (!docente) return;
    setCargando(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/docente/estudiantes/${docente.usuario_id}`
      );
      if (!res.ok) throw new Error();
      const data: EstudianteResumen[] = await res.json();
      setEstudiantes(data);
    } catch {
      setEstudiantes([]);
    } finally {
      setCargando(false);
    }
  }, [docente]);

  useEffect(() => {
    if (docente) cargarEstudiantes();
  }, [docente, cargarEstudiantes]);

  async function handleCrearEstudiante() {
    setErrorFormulario(null);
    if (!nuevoNombre.trim()) {
      setErrorFormulario("El nombre es requerido.");
      return;
    }
    if (!/^\d{4}$/.test(nuevoPin)) {
      setErrorFormulario("El PIN debe ser exactamente 4 dígitos.");
      return;
    }
    if (!docente) return;
    setCreando(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/docente/estudiantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docente_usuario_id: docente.usuario_id,
          nombre_display: nuevoNombre.trim(),
          grado_id: nuevoGrado,
          pin: nuevoPin,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCodigoGenerado(data.codigo_acceso);
      setNuevoNombre("");
      setNuevoPin("");
      await cargarEstudiantes();
    } catch {
      setErrorFormulario("No se pudo crear el estudiante. Intentá de nuevo.");
    } finally {
      setCreando(false);
    }
  }

  function formatearFecha(fecha: string | null): string {
    if (!fecha) return "Sin actividad";
    return new Date(fecha).toLocaleDateString("es-NI", {
      day: "numeric",
      month: "short",
    });
  }

  if (!docente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold" style={{ color: "#160B24" }}>
            DignaLearn
          </p>
          {docente.nombre_escuela && (
            <p className="text-xs text-gray-400">{docente.nombre_escuela}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            {docente.nombre_display ?? "Docente"}
          </p>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mi grupo</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {estudiantes.length}{" "}
              {estudiantes.length === 1 ? "estudiante" : "estudiantes"} registrados
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              setCodigoGenerado(null);
              setErrorFormulario(null);
            }}
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
          >
            + Agregar estudiante
          </button>
        </div>

        {mostrarFormulario && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Nuevo estudiante
            </h2>
            {codigoGenerado ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">
                  Estudiante creado. Compartí este código con el estudiante:
                </p>
                <p
                  className="text-3xl font-bold tracking-widest mb-4"
                  style={{ color: "#160B24" }}
                >
                  {codigoGenerado}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCodigoGenerado(null);
                    setMostrarFormulario(false);
                  }}
                  className="text-sm text-gray-400 hover:text-gray-700"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del estudiante
                  </label>
                  <input
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    placeholder="Ej: María López"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado
                  </label>
                  <select
                    value={nuevoGrado}
                    onChange={(e) => setNuevoGrado(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value={7}>7mo grado</option>
                    <option value={9}>9no grado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN inicial (4 dígitos)
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={nuevoPin}
                    onChange={(e) =>
                      setNuevoPin(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="0000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                {errorFormulario && (
                  <p className="text-sm text-red-600">{errorFormulario}</p>
                )}
                <button
                  type="button"
                  onClick={handleCrearEstudiante}
                  disabled={creando}
                  className="rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#160B24", color: "#ffffff" }}
                >
                  {creando ? "Creando..." : "Crear estudiante"}
                </button>
              </div>
            )}
          </div>
        )}

        {cargando ? (
          <p className="text-sm text-gray-400">Cargando estudiantes...</p>
        ) : estudiantes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4" aria-hidden>👩‍🎓</p>
            <p className="text-gray-500 text-sm">
              Aún no tenés estudiantes registrados.
            </p>
            <p className="text-gray-400 text-sm">
              Usá el botón de arriba para agregar el primero.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {estudiantes.map((est) => (
              <div
                key={est.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: "#F0A8B620", color: "#160B24" }}
                  >
                    {(est.nombre_display ?? "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {est.nombre_display ?? "Sin nombre"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {est.codigo_acceso} ·{" "}
                      {est.grado_id === 1 ? "7mo" : est.grado_id === 2 ? "9no" : `Grado ${est.grado_id}`} grado
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right shrink-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {est.temas_completados}
                    </p>
                    <p className="text-xs text-gray-400">temas</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatearFecha(est.ultima_actividad)}
                    </p>
                    <p className="text-xs text-gray-400">última actividad</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
