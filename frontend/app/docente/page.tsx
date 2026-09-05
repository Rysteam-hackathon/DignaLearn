"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

interface Docente {
  nombre: string;
  email: string;
  usuarioId: string;
}

interface Institucion {
  nombre: string;
  ciudad: string;
}

interface Grupo {
  id: string;
  nombre: string;
  grado_id: number;
  grado_nombre: string;
  numero_grado: number;
}

interface EstudianteGrupo {
  id: string;
  nombre: string | null;
  codigo_acceso: string;
  temas_completados: number;
  ultima_actividad: string | null;
  total_logros: number;
  porcentaje: number;
}

interface GrupoStats {
  total: number;
  promedio: number;
  activos_semana: number;
  sin_actividad: number;
}

interface PinForm {
  estudianteId: string;
  valor: string;
  cargando: boolean;
  mensaje: string;
}

function estaActivoEstaSemana(fecha: string | null): boolean {
  if (!fecha) return false;
  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);
  return new Date(fecha) >= hace7dias;
}

function formatearFecha(fecha: string | null): string {
  if (!fecha) return "Sin actividad";
  return new Date(fecha).toLocaleDateString("es-NI", { day: "numeric", month: "short" });
}

function iniciales(nombre: string | null): string {
  if (!nombre) return "?";
  return nombre.trim().slice(0, 2).toUpperCase();
}

export default function DocentePage() {
  const router = useRouter();

  const [cargando, setCargando] = useState(true);
  const [docente, setDocente] = useState<Docente | null>(null);
  const [institucion, setInstitucion] = useState<Institucion | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [grupoActivo, setGrupoActivo] = useState<string>("");
  const [estudiantes, setEstudiantes] = useState<EstudianteGrupo[]>([]);
  const [stats, setStats] = useState<GrupoStats>({ total: 0, promedio: 0, activos_semana: 0, sin_actividad: 0 });
  const [modalAgregar, setModalAgregar] = useState(false);
  const [estudianteExpandido, setEstudianteExpandido] = useState<string | null>(null);
  const [pinForm, setPinForm] = useState<PinForm>({ estudianteId: "", valor: "", cargando: false, mensaje: "" });
  const [pinUsado, setPinUsado] = useState("");
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombre: "", grado_id: "", pin: "" });
  const [creandoEstudiante, setCreandoEstudiante] = useState(false);
  const [codigoCreado, setCodigoCreado] = useState("");
  const [errorCrear, setErrorCrear] = useState("");

  const cargarGrupo = useCallback(async (grupoId: string, token: string) => {
    if (!grupoId) return;
    try {
      const [resEstudiantes, resStats] = await Promise.all([
        fetch(`${BACKEND_URL}/api/grupos/${grupoId}/estudiantes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BACKEND_URL}/api/grupos/${grupoId}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (resEstudiantes.ok) setEstudiantes(await resEstudiantes.json());
      if (resStats.ok) setStats(await resStats.json());
    } catch (error) {
      console.error("Error al cargar grupo:", error);
    }
  }, []);

  useEffect(() => {
    async function iniciar() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.push("/login");
        return;
      }

      const token = session.access_token;

      const { data: perfil } = await supabase
        .from("perfiles_docente")
        .select("usuarios(nombre_display)")
        .eq("usuario_id", session.user.id)
        .maybeSingle();

      setDocente({
        nombre: (perfil?.usuarios as unknown as { nombre_display: string } | null)?.nombre_display ?? "Docente",
        email: session.user.email ?? "",
        usuarioId: session.user.id,
      });

      try {
        const res = await fetch(`${BACKEND_URL}/api/grupos/mis-grupos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setInstitucion(data.institucion ?? null);
          setGrupos(data.grupos ?? []);
          if (data.grupos && data.grupos.length > 0) {
            setGrupoActivo(data.grupos[0].id);
            await cargarGrupo(data.grupos[0].id, token);
          }
        }
      } catch (error) {
        console.error("Error al cargar grupos:", error);
      } finally {
        setCargando(false);
      }
    }
    iniciar();
  }, [router, cargarGrupo]);

  useEffect(() => {
    if (!grupoActivo || !docente) return;
    async function recargar() {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      await cargarGrupo(grupoActivo, token);
    }
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupoActivo]);

  async function obtenerToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function handleCrearEstudiante() {
    setErrorCrear("");
    if (!nuevoEstudiante.nombre.trim()) { setErrorCrear("El nombre es requerido."); return; }
    if (!nuevoEstudiante.grado_id) { setErrorCrear("Seleccioná un grado."); return; }
    if (!/^\d{4}$/.test(nuevoEstudiante.pin)) { setErrorCrear("El PIN debe ser exactamente 4 dígitos."); return; }
    if (!docente) return;

    setCreandoEstudiante(true);
    setPinUsado(nuevoEstudiante.pin);
    try {
      const token = await obtenerToken();
      const res = await fetch(`${BACKEND_URL}/api/docente/estudiantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          docente_usuario_id: docente.usuarioId,
          nombre_display: nuevoEstudiante.nombre.trim(),
          grado_id: Number(nuevoEstudiante.grado_id),
          pin: nuevoEstudiante.pin,
          grupo_id: grupoActivo,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCodigoCreado(data.codigo_acceso);
    } catch (error) {
      console.error("Error al crear estudiante:", error);
      setErrorCrear("No se pudo crear el estudiante. Intentá de nuevo.");
    } finally {
      setCreandoEstudiante(false);
    }
  }

  async function handleResetearPin() {
    if (!/^\d{4}$/.test(pinForm.valor)) {
      setPinForm((prev) => ({ ...prev, mensaje: "El PIN debe ser exactamente 4 dígitos." }));
      return;
    }
    if (!docente) return;

    setPinForm((prev) => ({ ...prev, cargando: true }));
    try {
      const token = await obtenerToken();
      const res = await fetch(`${BACKEND_URL}/api/docente/resetear-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          docente_usuario_id: docente.usuarioId,
          estudiante_id: pinForm.estudianteId,
          nuevo_pin: pinForm.valor,
        }),
      });
      if (!res.ok) throw new Error();
      setPinForm((prev) => ({ ...prev, cargando: false, mensaje: "PIN actualizado correctamente." }));
    } catch (error) {
      console.error("Error al resetear PIN:", error);
      setPinForm((prev) => ({ ...prev, cargando: false, mensaje: "No se pudo actualizar el PIN. Intentá de nuevo." }));
    }
  }

  function cerrarModalExito() {
    setCodigoCreado("");
    setNuevoEstudiante({ nombre: "", grado_id: "", pin: "" });
    setModalAgregar(false);
    obtenerToken().then((token) => {
      if (token) cargarGrupo(grupoActivo, token);
    });
  }

  const grupoActivoObj = grupos.find((g) => g.id === grupoActivo) ?? null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#160B24" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/10"
        style={{ backgroundColor: "rgba(22,11,36,0.9)", backdropFilter: "blur(12px)" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo-isotipo.svg" width={36} height={36} style={{ width: 36, height: 36 }} priority alt="DignaLearn" />
            <span style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-bold">
              <span style={{ color: "#FFFFFF" }}>Digna</span>
              <span style={{ color: "#F0A8B6" }}>Learn</span>
            </span>
          </div>
          {institucion && <p className="text-white/50 text-sm mt-1">{institucion.nombre}</p>}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-white/70 text-sm">{docente?.nombre ?? "Docente"}</p>
          <button
            type="button"
            onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
            className="border border-white/20 text-white/60 hover:text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Mi panel docente
        </h1>
        <p className="text-white/50 text-sm mt-1">Seleccioná un grupo para ver su progreso</p>

        {/* Tabs de grupos */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {grupos.map((grupo) => (
            <motion.button
              key={grupo.id}
              type="button"
              onClick={() => setGrupoActivo(grupo.id)}
              className="relative px-5 py-2 rounded-full text-sm font-semibold"
              style={{ color: grupoActivo === grupo.id ? "#160B24" : "rgba(255,255,255,0.5)" }}
            >
              {grupoActivo === grupo.id && (
                <motion.div
                  layoutId="pill-activo"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "#F0A8B6" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {grupo.nombre} · {grupo.grado_nombre}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats del grupo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 px-6">
        {[
          { valor: stats.total, label: "estudiantes", color: "#F0A8B6" },
          { valor: `${stats.promedio}%`, label: "promedio grupal", color: "#A4CDD5" },
          { valor: stats.activos_semana, label: "activos esta semana", color: "#F0A8B6" },
          { valor: stats.sin_actividad, label: "sin actividad reciente", color: "#A4CDD5" },
        ].map((stat, idx) => (
          <motion.div
            key={grupoActivo + idx}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
            className="border border-white/10 rounded-2xl p-5 bg-white/[0.04]"
          >
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.valor}</p>
            <p className="text-white/50 text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Lista de estudiantes */}
      <div className="flex justify-between items-center px-6 mt-8 mb-4">
        <p className="text-white font-semibold">
          Estudiantes — {grupoActivoObj?.nombre ?? ""}
        </p>
        <motion.button
          type="button"
          onClick={() => setModalAgregar(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#F0A8B6] text-[#160B24] font-semibold px-4 py-2 rounded-full text-sm"
        >
          + Agregar estudiante
        </motion.button>
      </div>

      {cargando ? (
        <div className="px-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl animate-pulse h-20" />
          ))}
        </div>
      ) : estudiantes.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="text-white/50 text-sm">Aún no hay estudiantes en este grupo.</p>
        </div>
      ) : (
        <div className="px-6 space-y-3 pb-10">
          {estudiantes.map((est, idx) => {
            const activo = estaActivoEstaSemana(est.ultima_actividad);
            const expandido = estudianteExpandido === est.id;
            return (
              <motion.div
                key={est.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.35, ease: "easeOut" }}
                className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.03]"
              >
                <div
                  onClick={() => setEstudianteExpandido(expandido ? null : est.id)}
                  className="flex items-center justify-between p-4 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={activo ? { backgroundColor: "#F0A8B633", color: "#F0A8B6" } : { backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
                    >
                      {iniciales(est.nombre)}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium text-sm">{est.nombre ?? "Sin nombre"}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {est.codigo_acceso} · {grupoActivoObj?.grado_nombre ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#F0A8B6]"
                        initial={{ width: 0 }}
                        animate={{ width: `${est.porcentaje || 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.08 }}
                      />
                    </div>
                    <p className="text-white/50 text-xs mt-1 text-center">{est.porcentaje || 0}%</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-white/70 text-sm">{est.temas_completados} temas</p>
                      <p className="text-white/40 text-xs">{formatearFecha(est.ultima_actividad)}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: expandido ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/40 text-xs"
                    >
                      ▼
                    </motion.span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandido && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="border-t border-white/10 overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <p className="text-white/60 text-sm">
                          Código: <span className="text-[#A4CDD5] font-mono">{est.codigo_acceso}</span>
                        </p>
                        <p className="text-white/60 text-sm">Total logros: {est.total_logros}</p>

                        {pinForm.estudianteId !== est.id ? (
                          <button
                            type="button"
                            onClick={() => setPinForm({ estudianteId: est.id, valor: "", cargando: false, mensaje: "" })}
                            className="border border-[#A4CDD5]/50 text-[#A4CDD5] rounded-lg px-3 py-1.5 text-sm hover:bg-[#A4CDD5]/10 transition-colors"
                          >
                            Resetear PIN
                          </button>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={pinForm.valor}
                                onChange={(e) => setPinForm((prev) => ({ ...prev, valor: e.target.value.replace(/\D/g, "") }))}
                                placeholder="0000"
                                className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#A4CDD5]/50"
                              />
                              <button
                                type="button"
                                onClick={handleResetearPin}
                                disabled={pinForm.cargando}
                                className="rounded-lg border border-[#A4CDD5] text-[#A4CDD5] text-sm px-3 py-1 hover:bg-[#A4CDD5]/10 transition-colors disabled:opacity-50"
                              >
                                {pinForm.cargando ? "Guardando..." : "Confirmar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPinForm({ estudianteId: "", valor: "", cargando: false, mensaje: "" })}
                                className="text-white/40 hover:text-white text-sm"
                              >
                                Cancelar
                              </button>
                            </div>
                            {pinForm.mensaje && (
                              <p className={pinForm.mensaje.includes("correctamente") ? "text-[#A4CDD5] text-sm" : "text-red-400 text-sm"}>
                                {pinForm.mensaje}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal agregar estudiante */}
      <AnimatePresence>
        {modalAgregar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => { if (!codigoCreado) setModalAgregar(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4"
              style={{ backgroundColor: "#160B24" }}
            >
              {!codigoCreado ? (
                <>
                  <h2 className="font-bold text-xl text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                    Agregar estudiante
                  </h2>

                  <input
                    type="text"
                    value={nuevoEstudiante.nombre}
                    onChange={(e) => setNuevoEstudiante((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre del estudiante"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#F0A8B6]/50 mb-4"
                  />

                  <select
                    value={nuevoEstudiante.grado_id || grupoActivoObj?.numero_grado?.toString() || ""}
                    onChange={(e) => setNuevoEstudiante((prev) => ({ ...prev, grado_id: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F0A8B6]/50 mb-4"
                  >
                    {Array.from(new Map(grupos.map((g) => [g.numero_grado, g.grado_nombre])).entries()).map(
                      ([numeroGrado, nombreGrado]) => (
                        <option key={numeroGrado} value={numeroGrado} style={{ color: "#160B24" }}>
                          {nombreGrado}
                        </option>
                      )
                    )}
                  </select>

                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]*"
                    value={nuevoEstudiante.pin}
                    onChange={(e) => setNuevoEstudiante((prev) => ({ ...prev, pin: e.target.value.replace(/\D/g, "") }))}
                    placeholder="PIN inicial (4 dígitos)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#F0A8B6]/50 mb-6"
                  />

                  {errorCrear && <p className="text-red-400 text-sm mb-4">{errorCrear}</p>}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setModalAgregar(false)}
                      className="border border-white/20 text-white/60 px-4 py-2 rounded-xl text-sm"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      type="button"
                      onClick={handleCrearEstudiante}
                      disabled={creandoEstudiante}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-[#F0A8B6] text-[#160B24] font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                      {creandoEstudiante ? "Creando..." : "Crear estudiante"}
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#F0A8B6" }}
                  >
                    <span style={{ color: "#160B24" }} className="text-2xl font-bold">✓</span>
                  </motion.div>
                  <p className="text-white font-bold text-xl text-center" style={{ fontFamily: "var(--font-heading)" }}>
                    ¡Estudiante creado!
                  </p>

                  <div className="bg-[#F0A8B6]/10 border border-[#F0A8B6]/30 rounded-xl p-4 mt-4 text-center">
                    <p className="text-white/60 text-xs mb-3">
                      Compartí estos datos con el estudiante
                    </p>
                    <div className="mb-3">
                      <p className="text-white/50 text-xs">Código de acceso</p>
                      <p className="text-[#F0A8B6] font-mono text-2xl font-bold tracking-widest mt-1">{codigoCreado}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">PIN inicial</p>
                      <p className="text-[#A4CDD5] font-mono text-2xl font-bold tracking-widest mt-1">{pinUsado}</p>
                    </div>
                    <p className="text-white/40 text-xs mt-4">
                      El estudiante puede cambiar su PIN desde Extras → Perfil
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={cerrarModalExito}
                    className="bg-[#F0A8B6] text-[#160B24] font-bold w-full py-3 rounded-xl mt-4"
                  >
                    Listo
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
