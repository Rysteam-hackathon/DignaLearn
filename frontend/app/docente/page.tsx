"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseDocente as supabase } from "@/lib/supabase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

// ---------- Íconos sol / luna del toggle (mismo mecanismo que Extras) ----------

function IconoSol() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconoLuna() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

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
  pinGenerado: string;
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
  const [pinForm, setPinForm] = useState<PinForm>({ estudianteId: "", valor: "", cargando: false, mensaje: "", pinGenerado: "" });
  const [pinUsado, setPinUsado] = useState("");
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombre: "", grado_id: "", pin: "" });
  const [creandoEstudiante, setCreandoEstudiante] = useState(false);
  const [codigoCreado, setCodigoCreado] = useState("");
  const [errorCrear, setErrorCrear] = useState("");

  const [modoOscuro, setModoOscuro] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const guardado = localStorage.getItem("dignalearn_tema");
    setModoOscuro(guardado === "dark");
    if (guardado === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    function alHacerClickAfuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", alHacerClickAfuera);
    return () => document.removeEventListener("mousedown", alHacerClickAfuera);
  }, []);

  function toggleTema() {
    const nuevo = !modoOscuro;
    setModoOscuro(nuevo);
    if (nuevo) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dignalearn_tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dignalearn_tema", "light");
    }
  }

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
      const data = await res.json();
      setPinForm((prev) => ({ ...prev, cargando: false, mensaje: "", pinGenerado: data.nuevo_pin }));
    } catch (error) {
      console.error("Error al resetear PIN:", error);
      setPinForm((prev) => ({ ...prev, cargando: false, mensaje: "No se pudo actualizar el PIN. Intentá de nuevo." }));
    }
  }

  function cerrarExitoPin() {
    setPinForm({ estudianteId: "", valor: "", cargando: false, mensaje: "", pinGenerado: "" });
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

  const colorTexto = modoOscuro ? "#ffffff" : "#160B24";
  const colorTexto80 = modoOscuro ? "rgba(255,255,255,0.8)" : "rgba(22,11,36,0.8)";
  const colorTexto70 = modoOscuro ? "rgba(255,255,255,0.7)" : "rgba(22,11,36,0.7)";
  const colorTexto60 = modoOscuro ? "rgba(255,255,255,0.6)" : "rgba(22,11,36,0.6)";
  const colorTexto50 = modoOscuro ? "rgba(255,255,255,0.5)" : "rgba(22,11,36,0.5)";
  const colorTexto40 = modoOscuro ? "rgba(255,255,255,0.4)" : "rgba(22,11,36,0.4)";
  const bgPagina = modoOscuro ? "#160B24" : "#ffffff";
  const bgHeader = modoOscuro ? "rgba(22,11,36,0.9)" : "rgba(255,255,255,0.9)";
  const bordeSutil = modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.1)";
  const bordeSutil20 = modoOscuro ? "rgba(255,255,255,0.2)" : "rgba(22,11,36,0.2)";
  const cardBg = modoOscuro ? "rgba(255,255,255,0.04)" : "rgba(22,11,36,0.03)";
  const cardBgSuave = modoOscuro ? "rgba(255,255,255,0.03)" : "rgba(22,11,36,0.02)";
  const skeletonBg = modoOscuro ? "rgba(255,255,255,0.05)" : "rgba(22,11,36,0.05)";
  const inputBg = modoOscuro ? "rgba(255,255,255,0.05)" : "rgba(22,11,36,0.04)";
  const avatarInactivoBg = modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.08)";
  const avatarInactivoTexto = modoOscuro ? "rgba(255,255,255,0.4)" : "rgba(22,11,36,0.4)";
  const barraFondo = modoOscuro ? "rgba(255,255,255,0.1)" : "rgba(22,11,36,0.1)";
  const overlayModal = modoOscuro ? "rgba(0,0,0,0.6)" : "rgba(22,11,36,0.35)";

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: bgPagina }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b"
        style={{ backgroundColor: bgHeader, borderColor: bordeSutil, backdropFilter: "blur(12px)" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Image src="/logo-isotipo.svg" width={36} height={36} style={{ width: 36, height: 36 }} priority alt="DignaLearn" />
            <span style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-bold">
              <span style={{ color: colorTexto }}>Digna</span>
              <span style={{ color: "#F0A8B6" }}>Learn</span>
            </span>
          </div>
          {institucion && <p className="text-sm mt-1" style={{ color: colorTexto50 }}>{institucion.nombre}</p>}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: colorTexto70 }}
          >
            {docente?.nombre ?? "Docente"}
            <motion.span
              animate={{ rotate: menuAbierto ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: colorTexto40 }}
              className="text-xs"
            >
              ▼
            </motion.span>
          </button>

          <AnimatePresence>
            {menuAbierto && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl border p-4 z-50"
                style={{ backgroundColor: bgPagina, borderColor: bordeSutil, boxShadow: "0 16px 36px rgba(0,0,0,0.4)" }}
              >
                <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b" style={{ borderColor: bordeSutil }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(240,168,182,0.18)", color: "#F0A8B6" }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={modoOscuro ? "moon" : "sun"}
                          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                          transition={{ duration: 0.35 }}
                          className="w-5 h-5"
                        >
                          {modoOscuro ? <IconoLuna /> : <IconoSol />}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="text-sm" style={{ color: colorTexto80 }}>Modo oscuro</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTema}
                    className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none shrink-0"
                    style={{ backgroundColor: modoOscuro ? "#F0A8B6" : "#D1D5DB" }}
                    aria-label={modoOscuro ? "Desactivar modo oscuro" : "Activar modo oscuro"}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                      style={{ transform: modoOscuro ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
                  className="w-full border px-3 py-2 rounded-lg text-sm transition-colors text-left"
                  style={{ borderColor: bordeSutil20, color: colorTexto60 }}
                >
                  Salir
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: colorTexto }}>
          Mi panel docente
        </h1>
        <p className="text-sm mt-1" style={{ color: colorTexto50 }}>Seleccioná un grupo para ver su progreso</p>

        {/* Tabs de grupos */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {grupos.map((grupo) => (
            <motion.button
              key={grupo.id}
              type="button"
              onClick={() => setGrupoActivo(grupo.id)}
              className="relative px-5 py-2 rounded-full text-sm font-semibold"
              style={{ color: grupoActivo === grupo.id ? "#160B24" : colorTexto50 }}
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
            className="border rounded-2xl p-5"
            style={{ borderColor: bordeSutil, backgroundColor: cardBg }}
          >
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.valor}</p>
            <p className="text-xs mt-1" style={{ color: colorTexto50 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Lista de estudiantes */}
      <div className="flex justify-between items-center px-6 mt-8 mb-4">
        <p className="font-semibold" style={{ color: colorTexto }}>
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
            <div key={i} className="rounded-2xl animate-pulse h-20" style={{ backgroundColor: skeletonBg }} />
          ))}
        </div>
      ) : estudiantes.length === 0 ? (
        <div className="text-center py-16 px-6">
          <p className="text-sm" style={{ color: colorTexto50 }}>Aún no hay estudiantes en este grupo.</p>
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
                className="border rounded-2xl overflow-hidden"
                style={{ borderColor: bordeSutil, backgroundColor: cardBgSuave }}
              >
                <div
                  onClick={() => setEstudianteExpandido(expandido ? null : est.id)}
                  className="flex items-center justify-between p-4 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={activo ? { backgroundColor: "#F0A8B633", color: "#F0A8B6" } : { backgroundColor: avatarInactivoBg, color: avatarInactivoTexto }}
                    >
                      {iniciales(est.nombre)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-sm" style={{ color: colorTexto }}>{est.nombre ?? "Sin nombre"}</p>
                      <p className="text-xs mt-0.5" style={{ color: colorTexto40 }}>
                        {est.codigo_acceso} · {grupoActivoObj?.grado_nombre ?? ""}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: barraFondo }}>
                      <motion.div
                        className="h-full rounded-full bg-[#F0A8B6]"
                        initial={{ width: 0 }}
                        animate={{ width: `${est.porcentaje || 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.08 }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-center" style={{ color: colorTexto50 }}>{est.porcentaje || 0}%</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-sm" style={{ color: colorTexto70 }}>{est.temas_completados} temas</p>
                      <p className="text-xs" style={{ color: colorTexto40 }}>{formatearFecha(est.ultima_actividad)}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: expandido ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs"
                      style={{ color: colorTexto40 }}
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
                      className="border-t overflow-hidden"
                      style={{ borderColor: bordeSutil }}
                    >
                      <div className="p-4 space-y-3">
                        <p className="text-sm" style={{ color: colorTexto60 }}>
                          Código: <span className="text-[#A4CDD5] font-mono">{est.codigo_acceso}</span>
                        </p>
                        <p className="text-sm" style={{ color: colorTexto60 }}>Total logros: {est.total_logros}</p>

                        {pinForm.estudianteId !== est.id ? (
                          <button
                            type="button"
                            onClick={() => setPinForm({ estudianteId: est.id, valor: "", cargando: false, mensaje: "", pinGenerado: "" })}
                            className="border border-[#A4CDD5]/50 text-[#A4CDD5] rounded-lg px-3 py-1.5 text-sm hover:bg-[#A4CDD5]/10 transition-colors"
                          >
                            Resetear PIN
                          </button>
                        ) : pinForm.pinGenerado ? (
                          <div className="bg-[#A4CDD5]/10 border border-[#A4CDD5]/30 rounded-xl p-4 text-center">
                            <p className="text-xs mb-2" style={{ color: colorTexto50 }}>
                              Nuevo PIN de {est.nombre ?? "este estudiante"}
                            </p>
                            <p className="text-[#A4CDD5] font-mono text-2xl font-bold tracking-widest mb-3">
                              {pinForm.pinGenerado}
                            </p>
                            <p className="text-xs mb-3" style={{ color: colorTexto40 }}>
                              Compartí este PIN con el estudiante
                            </p>
                            <button
                              type="button"
                              onClick={cerrarExitoPin}
                              className="bg-[#A4CDD5] text-[#160B24] font-semibold text-sm px-4 py-1.5 rounded-lg"
                            >
                              Listo
                            </button>
                          </div>
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
                                className="w-24 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#A4CDD5]/50 border"
                                style={{ backgroundColor: inputBg, borderColor: bordeSutil, color: colorTexto }}
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
                                onClick={() => setPinForm({ estudianteId: "", valor: "", cargando: false, mensaje: "", pinGenerado: "" })}
                                className="text-sm transition-colors"
                                style={{ color: colorTexto40 }}
                              >
                                Cancelar
                              </button>
                            </div>
                            {pinForm.mensaje && (
                              <p className="text-red-400 text-sm">
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
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: overlayModal }}
            onClick={() => { if (!codigoCreado) setModalAgregar(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="border rounded-2xl p-8 w-full max-w-sm mx-4"
              style={{ backgroundColor: bgPagina, borderColor: bordeSutil }}
            >
              {!codigoCreado ? (
                <>
                  <h2 className="font-bold text-xl mb-6" style={{ fontFamily: "var(--font-heading)", color: colorTexto }}>
                    Agregar estudiante
                  </h2>

                  <input
                    type="text"
                    value={nuevoEstudiante.nombre}
                    onChange={(e) => setNuevoEstudiante((prev) => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre del estudiante"
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F0A8B6]/50 mb-4 border"
                    style={{ backgroundColor: inputBg, borderColor: bordeSutil, color: colorTexto }}
                  />

                  <select
                    value={nuevoEstudiante.grado_id || grupoActivoObj?.numero_grado?.toString() || ""}
                    onChange={(e) => setNuevoEstudiante((prev) => ({ ...prev, grado_id: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F0A8B6]/50 mb-4 border"
                    style={{ backgroundColor: inputBg, borderColor: bordeSutil, color: colorTexto }}
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
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F0A8B6]/50 mb-6 border"
                    style={{ backgroundColor: inputBg, borderColor: bordeSutil, color: colorTexto }}
                  />

                  {errorCrear && <p className="text-red-400 text-sm mb-4">{errorCrear}</p>}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setModalAgregar(false)}
                      className="border px-4 py-2 rounded-xl text-sm"
                      style={{ borderColor: bordeSutil20, color: colorTexto60 }}
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
                  <p className="font-bold text-xl text-center" style={{ fontFamily: "var(--font-heading)", color: colorTexto }}>
                    ¡Estudiante creado!
                  </p>

                  <div className="bg-[#F0A8B6]/10 border border-[#F0A8B6]/30 rounded-xl p-4 mt-4 text-center">
                    <p className="text-xs mb-3" style={{ color: colorTexto50 }}>
                      Compartí estos datos con el estudiante
                    </p>
                    <div className="mb-3">
                      <p className="text-xs" style={{ color: colorTexto50 }}>Código de acceso</p>
                      <p className="text-[#F0A8B6] font-mono text-2xl font-bold tracking-widest mt-1">{codigoCreado}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colorTexto50 }}>PIN inicial</p>
                      <p className="text-[#A4CDD5] font-mono text-2xl font-bold tracking-widest mt-1">{pinUsado}</p>
                    </div>
                    <p className="text-xs mt-4" style={{ color: colorTexto40 }}>
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
