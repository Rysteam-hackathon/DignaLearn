from datetime import date, timedelta

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.services.auth_service import verificar_docente_autenticado
from app.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/grupos", tags=["grupos"])


def _obtener_perfil_docente(supabase, usuario_id: str) -> dict:
    resultado = (
        supabase.table("perfiles_docente")
        .select("id, institucion_id, instituciones(nombre, ciudad)")
        .eq("usuario_id", usuario_id)
        .maybe_single()
        .execute()
    )
    if not resultado or not resultado.data:
        raise HTTPException(status_code=404, detail="Perfil de docente no encontrado.")
    return resultado.data


def _verificar_acceso_grupo(supabase, docente_id: str, grupo_id: str) -> None:
    acceso = (
        supabase.table("docente_grupos")
        .select("grupo_id")
        .eq("docente_id", docente_id)
        .eq("grupo_id", grupo_id)
        .maybe_single()
        .execute()
    )
    if not acceso or not acceso.data:
        raise HTTPException(status_code=403, detail="No tenés acceso a ese grupo.")


def _contar_temas_del_grado(supabase, grado_id: int | None) -> int:
    if grado_id is None:
        return 0
    unidades = (
        supabase.table("unidades")
        .select("id")
        .eq("grado_id", grado_id)
        .eq("activa", True)
        .execute()
    )
    unidad_ids = [u["id"] for u in unidades.data or []]
    if not unidad_ids:
        return 0
    temas = supabase.table("temas").select("id").in_("unidad_id", unidad_ids).execute()
    return len(temas.data or [])


def _obtener_grado_id_del_grupo(supabase, grupo_id: str) -> int | None:
    grupo = (
        supabase.table("grupos")
        .select("grado_id")
        .eq("id", grupo_id)
        .maybe_single()
        .execute()
    )
    return grupo.data["grado_id"] if grupo and grupo.data else None


class Institucion(BaseModel):
    nombre: str | None
    ciudad: str | None


class GrupoResumen(BaseModel):
    id: str
    nombre: str
    grado_id: int
    grado_nombre: str | None
    numero_grado: int | None


class MisGruposResponse(BaseModel):
    docente_id: str
    institucion: Institucion | None
    grupos: list[GrupoResumen]


@router.get("/mis-grupos", response_model=MisGruposResponse)
def mis_grupos(authorization: str | None = Header(default=None)) -> MisGruposResponse:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_docente(supabase, usuario_id)

    instituciones_data = perfil.get("instituciones")
    institucion = (
        Institucion(nombre=instituciones_data.get("nombre"), ciudad=instituciones_data.get("ciudad"))
        if instituciones_data
        else None
    )

    vinculos = (
        supabase.table("docente_grupos")
        .select("grupo_id, grupos(id, nombre, grado_id)")
        .eq("docente_id", perfil["id"])
        .execute()
    )
    vinculos_data = vinculos.data or []

    grado_ids = list({v["grupos"]["grado_id"] for v in vinculos_data if v.get("grupos")})
    grados_map: dict[int, dict] = {}
    if grado_ids:
        grados_result = (
            supabase.table("grados")
            .select("id, numero_grado, nombre_display")
            .in_("id", grado_ids)
            .execute()
        )
        grados_map = {g["id"]: g for g in grados_result.data or []}

    grupos_resultado: list[GrupoResumen] = []
    for v in vinculos_data:
        g = v.get("grupos")
        if not g:
            continue
        grado = grados_map.get(g["grado_id"])
        grupos_resultado.append(GrupoResumen(
            id=g["id"],
            nombre=g["nombre"],
            grado_id=g["grado_id"],
            grado_nombre=grado["nombre_display"] if grado else None,
            numero_grado=grado["numero_grado"] if grado else None,
        ))

    return MisGruposResponse(docente_id=perfil["id"], institucion=institucion, grupos=grupos_resultado)


class EstudianteConProgreso(BaseModel):
    id: str
    nombre: str | None
    codigo_acceso: str
    temas_completados: int
    ultima_actividad: str | None
    total_logros: int
    porcentaje: int


@router.get("/{grupo_id}/estudiantes", response_model=list[EstudianteConProgreso])
def estudiantes_de_grupo(
    grupo_id: str,
    authorization: str | None = Header(default=None),
) -> list[EstudianteConProgreso]:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_docente(supabase, usuario_id)
    _verificar_acceso_grupo(supabase, perfil["id"], grupo_id)

    estudiantes_result = (
        supabase.table("perfiles_estudiante")
        .select("id, usuario_id, codigo_acceso, grado_id")
        .eq("grupo_id", grupo_id)
        .execute()
    )
    estudiantes_data = estudiantes_result.data or []
    if not estudiantes_data:
        return []

    ids = [est["id"] for est in estudiantes_data]
    usuario_ids = [est["usuario_id"] for est in estudiantes_data]

    progreso_batch = (
        supabase.table("progreso_estudiante")
        .select("estudiante_id")
        .in_("estudiante_id", ids)
        .eq("lectura_completada", True)
        .eq("actividad_completada", True)
        .eq("reflexion_respondida", True)
        .execute()
    )
    temas_por_estudiante: dict[str, int] = {}
    for row in progreso_batch.data or []:
        eid = row["estudiante_id"]
        temas_por_estudiante[eid] = temas_por_estudiante.get(eid, 0) + 1

    actividad_batch = (
        supabase.table("actividad_diaria")
        .select("estudiante_id, fecha_actividad")
        .in_("estudiante_id", ids)
        .order("fecha_actividad", desc=True)
        .execute()
    )
    ultima_actividad_por_estudiante: dict[str, str] = {}
    for row in actividad_batch.data or []:
        eid = row["estudiante_id"]
        if eid not in ultima_actividad_por_estudiante:
            ultima_actividad_por_estudiante[eid] = row["fecha_actividad"]

    logros_batch = (
        supabase.table("estudiante_logros")
        .select("estudiante_id")
        .in_("estudiante_id", ids)
        .execute()
    )
    logros_por_estudiante: dict[str, int] = {}
    for row in logros_batch.data or []:
        eid = row["estudiante_id"]
        logros_por_estudiante[eid] = logros_por_estudiante.get(eid, 0) + 1

    usuarios_batch = (
        supabase.table("usuarios")
        .select("id, nombre_display")
        .in_("id", usuario_ids)
        .execute()
    )
    nombre_por_usuario = {row["id"]: row["nombre_display"] for row in usuarios_batch.data or []}

    grado_id = _obtener_grado_id_del_grupo(supabase, grupo_id)
    temas_posibles = _contar_temas_del_grado(supabase, grado_id)

    resultado: list[EstudianteConProgreso] = []
    for est in estudiantes_data:
        eid = est["id"]
        temas = temas_por_estudiante.get(eid, 0)
        resultado.append(EstudianteConProgreso(
            id=eid,
            nombre=nombre_por_usuario.get(est["usuario_id"]) or est["codigo_acceso"],
            codigo_acceso=est["codigo_acceso"],
            temas_completados=temas,
            ultima_actividad=ultima_actividad_por_estudiante.get(eid),
            total_logros=logros_por_estudiante.get(eid, 0),
            porcentaje=min(100, int(temas * 100 / temas_posibles)) if temas_posibles else 0,
        ))

    return resultado


class GrupoStats(BaseModel):
    total: int
    promedio: int
    activos_semana: int
    sin_actividad: int


@router.get("/{grupo_id}/stats", response_model=GrupoStats)
def stats_de_grupo(
    grupo_id: str,
    authorization: str | None = Header(default=None),
) -> GrupoStats:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_docente(supabase, usuario_id)
    _verificar_acceso_grupo(supabase, perfil["id"], grupo_id)

    estudiantes_result = (
        supabase.table("perfiles_estudiante")
        .select("id")
        .eq("grupo_id", grupo_id)
        .execute()
    )
    ids = [est["id"] for est in estudiantes_result.data or []]
    total = len(ids)
    if total == 0:
        return GrupoStats(total=0, promedio=0, activos_semana=0, sin_actividad=0)

    grado_id = _obtener_grado_id_del_grupo(supabase, grupo_id)
    temas_posibles = _contar_temas_del_grado(supabase, grado_id)

    progreso_batch = (
        supabase.table("progreso_estudiante")
        .select("estudiante_id")
        .in_("estudiante_id", ids)
        .eq("lectura_completada", True)
        .eq("actividad_completada", True)
        .eq("reflexion_respondida", True)
        .execute()
    )
    temas_por_estudiante: dict[str, int] = {}
    for row in progreso_batch.data or []:
        eid = row["estudiante_id"]
        temas_por_estudiante[eid] = temas_por_estudiante.get(eid, 0) + 1

    hace_7_dias = (date.today() - timedelta(days=7)).isoformat()
    actividad_batch = (
        supabase.table("actividad_diaria")
        .select("estudiante_id, fecha_actividad")
        .in_("estudiante_id", ids)
        .gte("fecha_actividad", hace_7_dias)
        .execute()
    )
    activos_ids = {row["estudiante_id"] for row in actividad_batch.data or []}
    activos_semana = len(activos_ids)
    sin_actividad = total - activos_semana

    if temas_posibles:
        promedio = round(
            sum(min(100, int(temas_por_estudiante.get(eid, 0) * 100 / temas_posibles)) for eid in ids)
            / total
        )
    else:
        promedio = 0

    return GrupoStats(total=total, promedio=promedio, activos_semana=activos_semana, sin_actividad=sin_actividad)
