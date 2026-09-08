"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseDocente as supabase } from "@/lib/supabase";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

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

interface Institucion {
  nombre: string;
  ciudad: string | null;
  codigo_institucion: string;
}

interface MiInstitucionResponse {
  institucion: Institucion;
  total_grupos: number;
  total_docentes: number;
  total_estudiantes: number;
}

interface GrupoAdmin {
  id: string;
  nombre: string;
  grado_id: number;
  numero_grado: number | null;
  grado_nombre: string | null;
  anio_lectivo: number | null;
  total_estudiantes: number;
  total_docentes: number;
}

interface GrupoAsignado {
  id: string;
  nombre: string;
  grado_nombre: string | null;
}

interface DocenteAdmin {
  id: string;
  usuario_id: string;
  nombre_display: string | null;
  email: string | null;
  grupos: GrupoAsignado[];
}

interface ReporteGrupo {
  grupo_id: string;
  grupo_nombre: string;
  grado_nombre: string | null;
  total_estudiantes: number;
  promedio: number;
  activos_semana: number;
  sin_actividad: number;
}

type Tab = "grupos" | "docentes" | "reportes";

export default function AdminPage() {
  const router = useRouter();

  const [cargando, setCargando] = useState(true);
  const [nombreAdmin, setNombreAdmin] = useState("Admin");
  const [resumen, setResumen] = useState<MiInstitucionResponse | null>(null);
  const [grupos, setGrupos] = useState<GrupoAdmin[]>([]);
  const [docentes, setDocentes] = useState<DocenteAdmin[]>([]);
  const [reportes, setReportes] = useState<ReporteGrupo[]>([]);
  const [tab, setTab] = useState<Tab>("grupos");

  const [modoOscuro, setModoOscuro] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [modalGrupo, setModalGrupo] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({ nombre: "", numero_grado: "7" });
  const [creandoGrupo, setCreandoGrupo] = useState(false);
  const [errorGrupo, setErrorGrupo] = useState("");

  const [modalDocente, setModalDocente] = useState(false);
  const [nuevoDocente, setNuevoDocente] = useState({ nombre_display: "", email: "", password: "", grupo_ids: [] as string[] });
  const [creandoDocente, setCreandoDocente] = useState(false);
  const [errorDocente, setErrorDocente] = useState("");
  const [docenteCreado, setDocenteCreado] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    const guardado = localStorage.getItem("dignalearn_tema");
    setModoOscuro(guardado === "dark");
    document.documentElement.classList.toggle("dark", guardado === "dark");
  }, []);

  useEffect(() => {
    function alHacerClickAfuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAbierto(false);
    }
    document.addEventListener("mousedown", alHacerClickAfuera);
    return () => document.removeEventListener("mousedown", alHacerClickAfuera);
  }, []);

  function toggleTema() {
    const nuevo = !modoOscuro;
    setModoOscuro(nuevo);
    document.documentElement.classList.toggle("dark", nuevo);
    localStorage.setItem("dignalearn_tema", nuevo ? "dark" : "light");
  }

  async function obtenerToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  const cargarTodo = useCallback(async () => {
    const token = await obtenerToken();
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    const [resResumen, resGrupos, resDocentes, resReportes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/admin/mi-institucion`, { headers }),
      fetch(`${BACKEND_URL}/api/admin/grupos`, { headers }),
      fetch(`${BACKEND_URL}/api/admin/docentes`, { headers }),
      fetch(`${BACKEND_URL}/api/admin/reportes`, { headers }),
    ]);

    if (resResumen.ok) setResumen(await resResumen.json());
    if (resGrupos.ok) setGrupos(await resGrupos.json());
    if (resDocentes.ok) setDocentes(await resDocentes.json());
    if (resReportes.ok) setReportes(await resReportes.json());
  }, []);

  useEffect(() => {
    async function iniciar() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
        return;
      }
      setNombreAdmin(data.session.user.email ?? "Admin");
      try {
        await cargarTodo();
      } catch (error) {
        console.error("Error al cargar panel de admin:", error);
      } finally {
        setCargando(false);
      }
    }
    iniciar();
  }, [router, cargarTodo]);

  async function handleCrearGrupo() {
    setErrorGrupo("");
    if (!nuevoGrupo.nombre.trim()) { setErrorGrupo("El nombre es requerido."); return; }

    setCreandoGrupo(true);
    try {
      const token = await obtenerToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/grupos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: nuevoGrupo.nombre.trim(), numero_grado: Number(nuevoGrupo.numero_grado) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail ?? "No se pudo crear el grupo.");
      }
      setModalGrupo(false);
      setNuevoGrupo({ nombre: "", numero_grado: "7" });
      await cargarTodo();
    } catch (error) {
      console.error("Error al crear grupo:", error);
      setErrorGrupo(error instanceof Error ? error.message : "No se pudo crear el grupo.");
    } finally {
      setCreandoGrupo(false);
    }
  }

  function toggleGrupoSeleccionado(id: string) {
    setNuevoDocente((prev) => ({
      ...prev,
      grupo_ids: prev.grupo_ids.includes(id)
        ? prev.grupo_ids.filter((g) => g !== id)
        : [...prev.grupo_ids, id],
    }));
  }

  async function handleCrearDocente() {
    setErrorDocente("");
    if (!nuevoDocente.nombre_display.trim()) { setErrorDocente("El nombre es requerido."); return; }
    if (!nuevoDocente.email.trim()) { setErrorDocente("El email es requerido."); return; }
    if (nuevoDocente.password.length < 6) { setErrorDocente("La contraseña debe tener al menos 6 caracteres."); return; }
    if (nuevoDocente.grupo_ids.length === 0) { setErrorDocente("Seleccioná al menos un grupo."); return; }

    setCreandoDocente(true);
    try {
      const token = await obtenerToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/docentes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(nuevoDocente),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail ?? "No se pudo crear el docente.");
      }
      setDocenteCreado({ email: nuevoDocente.email, password: nuevoDocente.password });
      await cargarTodo();
    } catch (error) {
      console.error("Error al crear docente:", error);
      setErrorDocente(error instanceof Error ? error.message : "No se pudo crear el docente.");
    } finally {
      setCreandoDocente(false);
    }
  }

  function cerrarModalDocente() {
    setModalDocente(false);
    setNuevoDocente({ nombre_display: "", email: "", password: "", grupo_ids: [] });
    setDocenteCreado(null);
    setErrorDocente("");
  }

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
  const inputBg = modoOscuro ? "rgba(255,255,255,0.05)" : "rgba(22,11,36,0.04)";
  const overlayModal = modoOscuro ? "rgba(0,0,0,0.6)" : "rgba(22,11,36,0.35)";

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F0A8B6]/50 mb-4 border";
  const inputStyle = { backgroundColor: inputBg, borderColor: bordeSutil, color: colorTexto };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgPagina }}>
        <p className="text-sm" style={{ color: colorTexto50 }}>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: bgPagina }}>
      <header
        className="sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center border-b"
        style={{ backgroundColor: bgHeader, borderColor: bordeSutil, backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2">
          <Image src="/logo-isotipo.svg" width={36} height={36} style={{ width: 36, height: 36 }} priority alt="DignaLearn" />
          <span style={{ fontFamily: "var(--font-heading)" }} className="text-lg font-bold hidden sm:inline">
            <span style={{ color: colorTexto }}>Digna</span>
            <span style={{ color: "#F0A8B6" }}>Learn</span>
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full ml-1"
            style={{ backgroundColor: "rgba(178,141,255,0.15)", color: "#B28DFF" }}
          >
            ADMIN
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            className="flex items-center gap-2 text-sm transition-colors max-w-[160px] sm:max-w-none truncate"
            style={{ color: colorTexto70 }}
          >
            <span className="truncate">{nombreAdmin}</span>
            <motion.span animate={{ rotate: menuAbierto ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ color: colorTexto40 }} className="text-xs shrink-0">
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
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(240,168,182,0.18)", color: "#F0A8B6" }}>
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
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200" style={{ transform: modoOscuro ? "translateX(20px)" : "translateX(0)" }} />
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

      <div className="px-4 sm:px-6 pt-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: colorTexto }}>
          Panel de Administración
        </h1>
        <p className="text-sm mb-6" style={{ color: colorTexto50 }}>
          {resumen?.institucion.nombre} {resumen?.institucion.ciudad ? `· ${resumen.institucion.ciudad}` : ""} · {resumen?.institucion.codigo_institucion}
        </p>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { valor: resumen?.total_grupos ?? 0, label: "grupos", color: "#F0A8B6" },
            { valor: resumen?.total_docentes ?? 0, label: "docentes", color: "#A4CDD5" },
            { valor: resumen?.total_estudiantes ?? 0, label: "estudiantes", color: "#B28DFF" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35, ease: "easeOut" }}
              className="border rounded-2xl p-4 sm:p-5"
              style={{ borderColor: bordeSutil, backgroundColor: cardBg }}
            >
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>{stat.valor}</p>
              <p className="text-xs mt-1" style={{ color: colorTexto50 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { id: "grupos" as const, label: "Grupos" },
            { id: "docentes" as const, label: "Docentes" },
            { id: "reportes" as const, label: "Reportes" },
          ]).map((t) => (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="relative px-5 py-2 rounded-full text-sm font-semibold"
              style={{ color: tab === t.id ? "#160B24" : colorTexto50 }}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="admin-pill-activo"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "#F0A8B6" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab: Grupos */}
        {tab === "grupos" && (
          <div className="pb-10">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold" style={{ color: colorTexto }}>Grupos ({grupos.length})</p>
              <motion.button
                type="button"
                onClick={() => setModalGrupo(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#F0A8B6] text-[#160B24] font-semibold px-4 py-2 rounded-full text-sm"
              >
                + Nuevo grupo
              </motion.button>
            </div>

            {grupos.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: colorTexto50 }}>Todavía no hay grupos en tu institución.</p>
            ) : (
              <div className="space-y-3">
                {grupos.map((g, idx) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="border rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2"
                    style={{ borderColor: bordeSutil, backgroundColor: cardBgSuave }}
                  >
                    <div>
                      <p className="font-medium text-sm" style={{ color: colorTexto }}>{g.nombre}</p>
                      <p className="text-xs mt-0.5" style={{ color: colorTexto40 }}>{g.grado_nombre} · Año {g.anio_lectivo}</p>
                    </div>
                    <div className="flex gap-4 text-xs" style={{ color: colorTexto60 }}>
                      <span>{g.total_estudiantes} estudiantes</span>
                      <span>{g.total_docentes} docentes</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Docentes */}
        {tab === "docentes" && (
          <div className="pb-10">
            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold" style={{ color: colorTexto }}>Docentes ({docentes.length})</p>
              <motion.button
                type="button"
                onClick={() => setModalDocente(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#F0A8B6] text-[#160B24] font-semibold px-4 py-2 rounded-full text-sm"
              >
                + Nuevo docente
              </motion.button>
            </div>

            {docentes.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: colorTexto50 }}>Todavía no hay docentes en tu institución.</p>
            ) : (
              <div className="space-y-3">
                {docentes.map((d, idx) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="border rounded-2xl p-4"
                    style={{ borderColor: bordeSutil, backgroundColor: cardBgSuave }}
                  >
                    <p className="font-medium text-sm" style={{ color: colorTexto }}>{d.nombre_display ?? "Sin nombre"}</p>
                    <p className="text-xs mt-0.5" style={{ color: colorTexto40 }}>{d.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {d.grupos.length === 0 ? (
                        <span className="text-xs" style={{ color: colorTexto40 }}>Sin grupos asignados</span>
                      ) : (
                        d.grupos.map((g) => (
                          <span
                            key={g.id}
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "rgba(164,205,213,0.2)", color: "#A4CDD5" }}
                          >
                            {g.nombre}
                          </span>
                        ))
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Reportes */}
        {tab === "reportes" && (
          <div className="pb-10">
            <p className="font-semibold mb-4" style={{ color: colorTexto }}>Reportes por grupo</p>
            {reportes.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: colorTexto50 }}>Todavía no hay grupos para reportar.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: bordeSutil }}>
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr style={{ backgroundColor: cardBg }}>
                      {["Grupo", "Grado", "Estudiantes", "Promedio", "Activos (7d)", "Sin actividad"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: colorTexto60 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportes.map((r) => (
                      <tr key={r.grupo_id} className="border-t" style={{ borderColor: bordeSutil }}>
                        <td className="px-4 py-3" style={{ color: colorTexto }}>{r.grupo_nombre}</td>
                        <td className="px-4 py-3" style={{ color: colorTexto60 }}>{r.grado_nombre}</td>
                        <td className="px-4 py-3" style={{ color: colorTexto60 }}>{r.total_estudiantes}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#A4CDD5" }}>{r.promedio}%</td>
                        <td className="px-4 py-3" style={{ color: colorTexto60 }}>{r.activos_semana}</td>
                        <td className="px-4 py-3" style={{ color: colorTexto60 }}>{r.sin_actividad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal crear grupo */}
      <AnimatePresence>
        {modalGrupo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
            style={{ backgroundColor: overlayModal }}
            onClick={() => setModalGrupo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="border rounded-2xl p-8 w-full max-w-sm"
              style={{ backgroundColor: bgPagina, borderColor: bordeSutil }}
            >
              <h2 className="font-bold text-xl mb-6" style={{ fontFamily: "var(--font-heading)", color: colorTexto }}>
                Nuevo grupo
              </h2>

              <input
                type="text"
                value={nuevoGrupo.nombre}
                onChange={(e) => setNuevoGrupo((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del grupo (ej: 7mo B)"
                className={inputClass}
                style={inputStyle}
              />

              <select
                value={nuevoGrupo.numero_grado}
                onChange={(e) => setNuevoGrupo((prev) => ({ ...prev, numero_grado: e.target.value }))}
                className={inputClass}
                style={inputStyle}
              >
                <option value="7" style={{ color: "#160B24" }}>7mo grado</option>
                <option value="9" style={{ color: "#160B24" }}>9no grado</option>
              </select>

              {errorGrupo && <p className="text-red-400 text-sm mb-4">{errorGrupo}</p>}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalGrupo(false)}
                  className="border px-4 py-2 rounded-xl text-sm"
                  style={{ borderColor: bordeSutil20, color: colorTexto60 }}
                >
                  Cancelar
                </button>
                <motion.button
                  type="button"
                  onClick={handleCrearGrupo}
                  disabled={creandoGrupo}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#F0A8B6] text-[#160B24] font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                >
                  {creandoGrupo ? "Creando..." : "Crear grupo"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal crear docente */}
      <AnimatePresence>
        {modalDocente && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
            style={{ backgroundColor: overlayModal }}
            onClick={() => { if (!docenteCreado) cerrarModalDocente(); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="border rounded-2xl p-8 w-full max-w-sm max-h-[85vh] overflow-y-auto"
              style={{ backgroundColor: bgPagina, borderColor: bordeSutil }}
            >
              {!docenteCreado ? (
                <>
                  <h2 className="font-bold text-xl mb-6" style={{ fontFamily: "var(--font-heading)", color: colorTexto }}>
                    Nuevo docente
                  </h2>

                  <input
                    type="text"
                    value={nuevoDocente.nombre_display}
                    onChange={(e) => setNuevoDocente((prev) => ({ ...prev, nombre_display: e.target.value }))}
                    placeholder="Nombre completo"
                    className={inputClass}
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    value={nuevoDocente.email}
                    onChange={(e) => setNuevoDocente((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className={inputClass}
                    style={inputStyle}
                  />
                  <input
                    type="password"
                    value={nuevoDocente.password}
                    onChange={(e) => setNuevoDocente((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Contraseña inicial"
                    className={inputClass}
                    style={inputStyle}
                  />

                  <p className="text-xs font-semibold mb-2" style={{ color: colorTexto60 }}>Grupos a asignar</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {grupos.map((g) => {
                      const seleccionado = nuevoDocente.grupo_ids.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => toggleGrupoSeleccionado(g.id)}
                          className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
                          style={
                            seleccionado
                              ? { backgroundColor: "#F0A8B6", borderColor: "transparent", color: "#160B24" }
                              : { backgroundColor: "transparent", borderColor: bordeSutil20, color: colorTexto60 }
                          }
                        >
                          {g.nombre}
                        </button>
                      );
                    })}
                  </div>

                  {errorDocente && <p className="text-red-400 text-sm mb-4">{errorDocente}</p>}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={cerrarModalDocente}
                      className="border px-4 py-2 rounded-xl text-sm"
                      style={{ borderColor: bordeSutil20, color: colorTexto60 }}
                    >
                      Cancelar
                    </button>
                    <motion.button
                      type="button"
                      onClick={handleCrearDocente}
                      disabled={creandoDocente}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-[#F0A8B6] text-[#160B24] font-bold px-4 py-2 rounded-xl disabled:opacity-50"
                    >
                      {creandoDocente ? "Creando..." : "Crear docente"}
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
                  <p className="font-bold text-xl text-center mb-4" style={{ fontFamily: "var(--font-heading)", color: colorTexto }}>
                    ¡Docente creado!
                  </p>

                  <div className="bg-[#F0A8B6]/10 border border-[#F0A8B6]/30 rounded-xl p-4 text-center">
                    <p className="text-xs mb-3" style={{ color: colorTexto50 }}>
                      Compartí estas credenciales con el docente
                    </p>
                    <div className="mb-3">
                      <p className="text-xs" style={{ color: colorTexto50 }}>Email</p>
                      <p className="text-[#F0A8B6] font-mono text-sm font-bold mt-1 break-all">{docenteCreado.email}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colorTexto50 }}>Contraseña inicial</p>
                      <p className="text-[#A4CDD5] font-mono text-lg font-bold tracking-wide mt-1">{docenteCreado.password}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={cerrarModalDocente}
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
