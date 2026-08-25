from datetime import date, timedelta

from postgrest.exceptions import APIError
from pydantic import BaseModel
from supabase import Client

from app.supabase_client import get_supabase_client

RACHA_DIAS_REQUERIDA = 5
UNIDADES_POR_GRADO = 4


class LogroDesbloqueado(BaseModel):
    id: str
    titulo: str
    descripcion: str | None = None
    icono_url: str | None = None
    nivel_logro_id: int


def evaluar_logros(estudiante_id: str, tema_id: str) -> list[LogroDesbloqueado]:
    """Evalúa las condiciones de logros tras completar un tema y otorga
    los que correspondan. Retorna solo los logros recién desbloqueados
    en esta llamada (no los que el estudiante ya tenía)."""
    supabase = get_supabase_client()
    desbloqueados: list[LogroDesbloqueado] = []

    progreso_tema = _obtener_progreso_tema(supabase, estudiante_id, tema_id)
    if not progreso_tema or not _esta_completo(progreso_tema):
        return desbloqueados

    # Nivel 1: tema completado
    logro = _intentar_desbloquear(supabase, estudiante_id, "tema_completado")
    if logro:
        desbloqueados.append(logro)

    # Nivel 3 especial: "El Primer Paso"
    if _es_primer_tema_completado(supabase, estudiante_id):
        logro = _intentar_desbloquear(supabase, estudiante_id, "primer_tema")
        if logro:
            desbloqueados.append(logro)

    # Nivel 2: unidad completa (y "Seriamente" si además el grado está completo)
    unidad_id = _obtener_unidad_id(supabase, tema_id)
    if unidad_id and _unidad_completa(supabase, estudiante_id, unidad_id):
        logro = _intentar_desbloquear(supabase, estudiante_id, "unidad_completada")
        if logro:
            desbloqueados.append(logro)

        grado_id = _obtener_grado_id(supabase, unidad_id)
        if grado_id and _grado_completo(supabase, estudiante_id, grado_id):
            logro = _intentar_desbloquear(supabase, estudiante_id, "grado_completo")
            if logro:
                desbloqueados.append(logro)

    # "Constante": racha de días consecutivos en actividad_diaria
    if _racha_de_dias(supabase, estudiante_id) >= RACHA_DIAS_REQUERIDA:
        logro = _intentar_desbloquear(
            supabase, estudiante_id, "racha_dias", RACHA_DIAS_REQUERIDA
        )
        if logro:
            desbloqueados.append(logro)

    return desbloqueados


def _obtener_progreso_tema(
    supabase: Client, estudiante_id: str, tema_id: str
) -> dict | None:
    resultado = (
        supabase.table("progreso_estudiante")
        .select("lectura_completada, actividad_completada, reflexion_respondida")
        .eq("estudiante_id", estudiante_id)
        .eq("tema_id", tema_id)
        .maybe_single()
        .execute()
    )
    return resultado.data if resultado else None


def _esta_completo(progreso: dict) -> bool:
    return bool(
        progreso.get("lectura_completada")
        and progreso.get("actividad_completada")
        and progreso.get("reflexion_respondida")
    )


def _es_primer_tema_completado(supabase: Client, estudiante_id: str) -> bool:
    resultado = (
        supabase.table("progreso_estudiante")
        .select("id")
        .eq("estudiante_id", estudiante_id)
        .eq("lectura_completada", True)
        .eq("actividad_completada", True)
        .eq("reflexion_respondida", True)
        .execute()
    )
    return len(resultado.data or []) == 1


def _obtener_unidad_id(supabase: Client, tema_id: str) -> str | None:
    resultado = (
        supabase.table("temas")
        .select("unidad_id")
        .eq("id", tema_id)
        .maybe_single()
        .execute()
    )
    return resultado.data["unidad_id"] if resultado and resultado.data else None


def _obtener_grado_id(supabase: Client, unidad_id: str) -> int | None:
    resultado = (
        supabase.table("unidades")
        .select("grado_id")
        .eq("id", unidad_id)
        .maybe_single()
        .execute()
    )
    return resultado.data["grado_id"] if resultado and resultado.data else None


def _unidad_completa(supabase: Client, estudiante_id: str, unidad_id: str) -> bool:
    temas = supabase.table("temas").select("id").eq("unidad_id", unidad_id).execute()
    tema_ids = [fila["id"] for fila in temas.data or []]
    if not tema_ids:
        return False

    progreso = (
        supabase.table("progreso_estudiante")
        .select("tema_id")
        .eq("estudiante_id", estudiante_id)
        .in_("tema_id", tema_ids)
        .eq("lectura_completada", True)
        .eq("actividad_completada", True)
        .eq("reflexion_respondida", True)
        .execute()
    )
    return len(progreso.data or []) == len(tema_ids)


def _grado_completo(supabase: Client, estudiante_id: str, grado_id: int) -> bool:
    unidades = (
        supabase.table("unidades")
        .select("id")
        .eq("grado_id", grado_id)
        .eq("activa", True)
        .execute()
    )
    unidad_ids = [fila["id"] for fila in unidades.data or []]
    if len(unidad_ids) < UNIDADES_POR_GRADO:
        return False

    return all(
        _unidad_completa(supabase, estudiante_id, unidad_id)
        for unidad_id in unidad_ids
    )


def _racha_de_dias(supabase: Client, estudiante_id: str) -> int:
    resultado = (
        supabase.table("actividad_diaria")
        .select("fecha_actividad")
        .eq("estudiante_id", estudiante_id)
        .order("fecha_actividad", desc=True)
        .limit(60)
        .execute()
    )
    fechas = sorted(
        {date.fromisoformat(fila["fecha_actividad"]) for fila in resultado.data or []},
        reverse=True,
    )
    if not fechas:
        return 0

    racha = 1
    for actual, anterior in zip(fechas, fechas[1:]):
        if actual - anterior == timedelta(days=1):
            racha += 1
        else:
            break
    return racha


def _intentar_desbloquear(
    supabase: Client,
    estudiante_id: str,
    tipo_condicion: str,
    valor_condicion: int | None = None,
) -> LogroDesbloqueado | None:
    query = (
        supabase.table("logros")
        .select("id, titulo, descripcion, icono_url, nivel_logro_id")
        .eq("tipo_condicion", tipo_condicion)
    )
    if valor_condicion is not None:
        query = query.eq("valor_condicion", valor_condicion)

    logro_resultado = query.limit(1).execute()
    if not logro_resultado.data:
        return None

    logro = logro_resultado.data[0]

    ya_desbloqueado = (
        supabase.table("estudiante_logros")
        .select("id")
        .eq("estudiante_id", estudiante_id)
        .eq("logro_id", logro["id"])
        .maybe_single()
        .execute()
    )
    if ya_desbloqueado and ya_desbloqueado.data:
        return None

    try:
        supabase.table("estudiante_logros").insert(
            {"estudiante_id": estudiante_id, "logro_id": logro["id"]}
        ).execute()
    except APIError:
        # condición de carrera: otra llamada ya lo insertó (UNIQUE constraint)
        return None

    return LogroDesbloqueado(**logro)
