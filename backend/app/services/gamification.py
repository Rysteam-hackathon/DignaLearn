from datetime import date, timedelta

from postgrest.exceptions import APIError
from pydantic import BaseModel
from supabase import Client

from app.supabase_client import get_supabase_client

RACHA_UMBRALES = [5, 7, 30]
UNIDADES_POR_GRADO = 4


class LogroDesbloqueado(BaseModel):
    id: str
    titulo: str
    descripcion: str | None = None
    icono_url: str | None = None
    nivel_logro_id: int


def evaluar_logros(estudiante_id: str, tema_id: str) -> list[LogroDesbloqueado]:
    supabase = get_supabase_client()
    desbloqueados: list[LogroDesbloqueado] = []

    progreso_tema = _obtener_progreso_tema(supabase, estudiante_id, tema_id)
    if not progreso_tema or not _esta_completo(progreso_tema):
        return desbloqueados

    # Nivel 1: tema completado — se otorga una vez por tema (usa tema_id en el UNIQUE)
    logro = _intentar_desbloquear(
        supabase, estudiante_id, "tema_completado", tema_id=tema_id
    )
    if logro:
        desbloqueados.append(logro)

    # Especial: El Primer Paso — solo la primera vez que se completa cualquier tema
    if _es_primer_tema_completado(supabase, estudiante_id):
        logro = _intentar_desbloquear(supabase, estudiante_id, "primer_tema")
        if logro:
            desbloqueados.append(logro)

    # Nivel 2: unidad completa (logro nombrado según orden de la unidad)
    unidad_id = _obtener_unidad_id(supabase, tema_id)
    if unidad_id and _unidad_completa(supabase, estudiante_id, unidad_id):
        orden_unidad = _obtener_orden_unidad(supabase, unidad_id)
        if orden_unidad:
            logro = _intentar_desbloquear(
                supabase, estudiante_id, "unidad_completada", valor_condicion=orden_unidad
            )
            if logro:
                desbloqueados.append(logro)

            # Especial: Ojo Alerta (solo al completar la Unidad II)
            if orden_unidad == 2:
                logro = _intentar_desbloquear(supabase, estudiante_id, "ojo_alerta")
                if logro:
                    desbloqueados.append(logro)

        # Especial: grado completo
        grado_id = _obtener_grado_id(supabase, unidad_id)
        if grado_id and _grado_completo(supabase, estudiante_id, grado_id):
            logro = _intentar_desbloquear(supabase, estudiante_id, "grado_completo")
            if logro:
                desbloqueados.append(logro)

            # Especial: Protagonismo de Nicaragua (solo 9no grado)
            if _es_noveno_grado(supabase, grado_id):
                logro = _intentar_desbloquear(
                    supabase, estudiante_id, "protagonismo_nicaragua"
                )
                if logro:
                    desbloqueados.append(logro)

    # Especiales de racha (evalúa los 3 umbrales)
    racha_actual = _racha_de_dias(supabase, estudiante_id)
    for umbral in RACHA_UMBRALES:
        if racha_actual >= umbral:
            logro = _intentar_desbloquear(
                supabase, estudiante_id, "racha_dias", valor_condicion=umbral
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


def _obtener_orden_unidad(supabase: Client, unidad_id: str) -> int | None:
    resultado = (
        supabase.table("unidades")
        .select("numero_unidad")
        .eq("id", unidad_id)
        .maybe_single()
        .execute()
    )
    return resultado.data["numero_unidad"] if resultado and resultado.data else None


def _obtener_grado_id(supabase: Client, unidad_id: str) -> int | None:
    resultado = (
        supabase.table("unidades")
        .select("grado_id")
        .eq("id", unidad_id)
        .maybe_single()
        .execute()
    )
    return resultado.data["grado_id"] if resultado and resultado.data else None


def _es_noveno_grado(supabase: Client, grado_id: int) -> bool:
    resultado = (
        supabase.table("grados")
        .select("numero_grado")
        .eq("id", grado_id)
        .maybe_single()
        .execute()
    )
    if resultado and resultado.data:
        return resultado.data.get("numero_grado") == 9
    return False


def _unidad_completa(supabase: Client, estudiante_id: str, unidad_id: str) -> bool:
    temas = (
        supabase.table("temas")
        .select("id")
        .eq("unidad_id", unidad_id)
        .execute()
    )
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
    tema_id: str | None = None,
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

    # Verificar si ya fue desbloqueado (filtrando por tema_id si aplica)
    check = (
        supabase.table("estudiante_logros")
        .select("id")
        .eq("estudiante_id", estudiante_id)
        .eq("logro_id", logro["id"])
    )
    if tema_id is not None:
        check = check.eq("tema_id", tema_id)
    else:
        check = check.is_("tema_id", "null")

    ya_desbloqueado = check.maybe_single().execute()
    if ya_desbloqueado and ya_desbloqueado.data:
        return None

    # Insertar el logro desbloqueado
    fila = {"estudiante_id": estudiante_id, "logro_id": logro["id"]}
    if tema_id is not None:
        fila["tema_id"] = tema_id

    try:
        supabase.table("estudiante_logros").insert(fila).execute()
    except APIError:
        return None

    return LogroDesbloqueado(**logro)
