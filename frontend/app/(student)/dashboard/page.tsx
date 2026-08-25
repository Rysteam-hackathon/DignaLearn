"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getEstudianteLocal, type EstudianteProfile } from "@/lib/auth";

interface DashboardData {
  racha: number;
  continuarTema: { titulo: string; unidadTitulo: string; temaId: string; unidadId: string } | null;
  ultimoLogro: { titulo: string; desbloqueado_en: string } | null;
  unidadesCompletadas: number;
}

function calcularRacha(fechas: string[]): number {
  if (!fechas.length) return 0;
  const dias = Array.from(new Set(fechas))
    .map((f) => new Date(f).toISOString().split("T")[0])
    .sort()
    .reverse();
  let racha = 1;
  for (let i = 0; i < dias.length - 1; i++) {
    const diff = (new Date(dias[i]).getTime() - new Date(dias[i + 1]).getTime()) / 86400000;
    if (diff === 1) racha++;
    else break;
  }
  return racha;
}

function saludo(nombre: string | null): string {
  const hora = new Date().getHours();
  const momento = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  return nombre ? `${momento}, ${nombre}` : momento;
}

export default function DashboardPage() {
  const [estudiante, setEstudiante] = useState<EstudianteProfile | null>(null);
  const [datos, setDatos] = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const est = getEstudianteLocal();
    if (!est) return;
    setEstudiante(est);

    async function cargar() {
      if (!est) return;
      try {
        // 1. Racha diaria
        const { data: actividad } = await supabase
          .from("actividad_diaria")
          .select("fecha_actividad")
          .eq("estudiante_id", est.id)
          .order("fecha_actividad", { ascending: false })
          .limit(60);

        const racha = calcularRacha(actividad?.map((a) => a.fecha_actividad) ?? []);

        // 2. Último logro desbloqueado
        const { data: logrosData } = await supabase
          .from("estudiante_logros")
          .select("desbloqueado_en, logros(titulo)")
          .eq("estudiante_id", est.id)
          .order("desbloqueado_en", { ascending: false })
          .limit(1)
          .maybeSingle();

        const ultimoLogro = logrosData
          ? {
              titulo: (logrosData.logros as unknown as { titulo: string } | null)?.titulo ?? "",
              desbloqueado_en: logrosData.desbloqueado_en,
            }
          : null;

        // 3. Unidades completadas (logros de nivel unidad)
        const { data: logrosUnidad } = await supabase
          .from("estudiante_logros")
          .select("logros(tipo_condicion)")
          .eq("estudiante_id", est.id);

        const unidadesCompletadas = (logrosUnidad ?? []).filter(
          (l) => (l.logros as unknown as { tipo_condicion: string } | null)?.tipo_condicion === "unidad_completada"
        ).length;

        // 4. Próximo tema a continuar — primera unidad con temas
        const { data: unidades } = await supabase
          .from("unidades")
          .select("id, titulo, numero_unidad")
          .eq("grado_id", est.grado_id)
          .order("numero_unidad", { ascending: true });

        let continuarTema: DashboardData["continuarTema"] = null;

        for (const unidad of unidades ?? []) {
          const { data: temas } = await supabase
            .from("temas")
            .select("id, titulo, orden")
            .eq("unidad_id", unidad.id)
            .order("orden", { ascending: true });

          if (!temas?.length) continue;

          const temaIds = temas.map((t) => t.id);

          const { data: progresos } = await supabase
            .from("progreso_estudiante")
            .select("tema_id, lectura_completada, actividad_completada, reflexion_respondida")
            .eq("estudiante_id", est.id)
            .in("tema_id", temaIds);

          const completados = new Set(
            (progresos ?? [])
              .filter((p) => p.lectura_completada && p.actividad_completada && p.reflexion_respondida)
              .map((p) => p.tema_id)
          );

          const pendiente = temas.find((t) => !completados.has(t.id));
          if (pendiente) {
            continuarTema = {
              titulo: pendiente.titulo,
              unidadTitulo: unidad.titulo,
              temaId: pendiente.id,
              unidadId: unidad.id,
            };
            break;
          }
        }

        setDatos({ racha, continuarTema, ultimoLogro, unidadesCompletadas });
      } catch {
        // Si falla algo, mostramos el dashboard sin datos opcionales
        setDatos({ racha: 0, continuarTema: null, ultimoLogro: null, unidadesCompletadas: 0 });
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, []);

  if (cargando) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      {/* Saludo */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#160B24" }}>
          {saludo(estudiante?.nombre_display ?? null)}
        </h1>
        {datos && datos.racha > 0 && (
          <p className="text-sm mt-1" style={{ color: "#F0A8B6" }}>
            🔥 Llevas {datos.racha} {datos.racha === 1 ? "día" : "días"} seguidos — ¡seguí así!
          </p>
        )}
      </div>

      {/* Layout responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Tarjeta principal — Continuar */}
        <div
          className="md:col-span-2 rounded-2xl p-6"
          style={{ backgroundColor: "#160B24" }}
        >
          {datos?.continuarTema ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#A4CDD5" }}>
                Continuar donde quedaste
              </p>
              <p className="text-white text-lg font-semibold mb-1">
                {datos.continuarTema.titulo}
              </p>
              <p className="text-sm mb-5" style={{ color: "#A4CDD5" }}>
                {datos.continuarTema.unidadTitulo}
              </p>
              <Link
                href={`/niveles/${datos.continuarTema.unidadId}/${datos.continuarTema.temaId}`}
                className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
              >
                Continuar →
              </Link>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#A4CDD5" }}>
                ¡Bienvenido a DignaLearn!
              </p>
              <p className="text-white text-lg font-semibold mb-1">
                Comenzá tu primer tema
              </p>
              <p className="text-sm mb-5" style={{ color: "#A4CDD5" }}>
                Dignidad y Respeto para Vivir en Armonía
              </p>
              <Link
                href="/niveles"
                className="inline-block rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F0A8B6", color: "#160B24" }}
              >
                Comenzar →
              </Link>
            </>
          )}
        </div>

        {/* Último logro */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Último logro
          </p>
          {datos?.ultimoLogro ? (
            <>
              <p className="text-2xl mb-2" aria-hidden>🏆</p>
              <p className="font-semibold text-gray-900 text-sm">{datos.ultimoLogro.titulo}</p>
            </>
          ) : (
            <>
              <p className="text-2xl mb-2 opacity-30" aria-hidden>🏆</p>
              <p className="text-sm text-gray-400">Aún no desbloqueaste logros</p>
            </>
          )}
        </div>

        {/* Progreso de unidades */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Unidades completadas
          </p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold" style={{ color: "#160B24" }}>
              {datos?.unidadesCompletadas ?? 0}
            </span>
            <span className="text-gray-400 text-sm mb-1">de 4</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="flex-1 h-2 rounded-full"
                style={{
                  backgroundColor:
                    n <= (datos?.unidadesCompletadas ?? 0) ? "#F0A8B6" : "#F3F4F6",
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
