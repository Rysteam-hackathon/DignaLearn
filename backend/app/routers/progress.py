from datetime import date, datetime, timezone
from typing import Literal

from fastapi import APIRouter, Header, HTTPException, Query
from pydantic import BaseModel

from app.services.auth_service import verificar_estudiante_autenticado
from app.services.gamification import LogroDesbloqueado, evaluar_logros
from app.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/progress", tags=["progress"])

ElementoProgreso = Literal["lectura", "actividad", "reflexion"]

CAMPO_POR_ELEMENTO: dict[str, str] = {
    "lectura": "lectura_completada",
    "actividad": "actividad_completada",
    "reflexion": "reflexion_respondida",
}


class CompletarElementoRequest(BaseModel):
    estudiante_id: str
    tema_id: str
    elemento: ElementoProgreso


class ProgresoResponse(BaseModel):
    lectura_completada: bool
    actividad_completada: bool
    reflexion_respondida: bool
    completado_en: str | None
    logros_desbloqueados: list[LogroDesbloqueado] = []


@router.post("/completar-elemento", response_model=ProgresoResponse)
def completar_elemento(
    body: CompletarElementoRequest,
    authorization: str | None = Header(default=None),
) -> ProgresoResponse:
    estudiante_id = verificar_estudiante_autenticado(authorization, body.estudiante_id)
    supabase = get_supabase_client()

    actual = (
        supabase.table("progreso_estudiante")
        .select("lectura_completada, actividad_completada, reflexion_respondida, completado_en")
        .eq("estudiante_id", estudiante_id)
        .eq("tema_id", body.tema_id)
        .maybe_single()
        .execute()
    )
    datos = (
        actual.data
        if actual and actual.data
        else {
            "lectura_completada": False,
            "actividad_completada": False,
            "reflexion_respondida": False,
            "completado_en": None,
        }
    )

    datos[CAMPO_POR_ELEMENTO[body.elemento]] = True

    completado = (
        datos["lectura_completada"]
        and datos["actividad_completada"]
        and datos["reflexion_respondida"]
    )
    if completado:
        datos["completado_en"] = datos["completado_en"] or datetime.now(timezone.utc).isoformat()
    else:
        datos["completado_en"] = None

    resultado = (
        supabase.table("progreso_estudiante")
        .upsert(
            {
                "estudiante_id": estudiante_id,
                "tema_id": body.tema_id,
                "lectura_completada": datos["lectura_completada"],
                "actividad_completada": datos["actividad_completada"],
                "reflexion_respondida": datos["reflexion_respondida"],
                "completado_en": datos["completado_en"],
            },
            on_conflict="estudiante_id,tema_id",
        )
        .execute()
    )

    if not resultado.data:
        raise HTTPException(status_code=500, detail="No se pudo actualizar el progreso.")

    fila = resultado.data[0]

    logros_desbloqueados: list[LogroDesbloqueado] = []
    if completado:
        # El tema quedó completo con este elemento, sin importar el orden en que
        # se completaron lectura/actividad/reflexión: se evalúan los logros acá,
        # en el único lugar donde se escribe el progreso.
        logros_desbloqueados = evaluar_logros(estudiante_id, body.tema_id)

    return ProgresoResponse(**fila, logros_desbloqueados=logros_desbloqueados)


class ActividadFecha(BaseModel):
    fecha_actividad: str


@router.get("/racha/{estudiante_id}", response_model=list[ActividadFecha])
def obtener_racha(
    estudiante_id: str,
    authorization: str | None = Header(default=None),
) -> list[ActividadFecha]:
    estudiante_id = verificar_estudiante_autenticado(authorization, estudiante_id)
    supabase = get_supabase_client()

    resultado = (
        supabase.table("actividad_diaria")
        .select("fecha_actividad")
        .eq("estudiante_id", estudiante_id)
        .order("fecha_actividad", desc=True)
        .limit(60)
        .execute()
    )

    return [ActividadFecha(**fila) for fila in resultado.data or []]


class NivelLogroNombre(BaseModel):
    nombre: str | None = None


class LogroCatalogo(BaseModel):
    id: str
    titulo: str
    descripcion: str | None = None
    tipo_condicion: str
    valor_condicion: int | None = None
    niveles_logro: NivelLogroNombre | None = None


class EstudianteLogroItem(BaseModel):
    id: str
    desbloqueado_en: str
    logros: LogroCatalogo | None = None


@router.get("/logros/{estudiante_id}", response_model=list[EstudianteLogroItem])
def obtener_logros_estudiante(
    estudiante_id: str,
    authorization: str | None = Header(default=None),
) -> list[EstudianteLogroItem]:
    estudiante_id = verificar_estudiante_autenticado(authorization, estudiante_id)
    supabase = get_supabase_client()

    resultado = (
        supabase.table("estudiante_logros")
        .select(
            "id, desbloqueado_en,"
            " logros(id, titulo, descripcion, tipo_condicion, valor_condicion, niveles_logro(nombre))"
        )
        .eq("estudiante_id", estudiante_id)
        .order("desbloqueado_en", desc=True)
        .execute()
    )

    return [EstudianteLogroItem(**fila) for fila in resultado.data or []]


class ProgresoTemaItem(BaseModel):
    tema_id: str
    lectura_completada: bool
    actividad_completada: bool
    reflexion_respondida: bool
    completado_en: str | None = None


@router.get("/estudiante/{estudiante_id}", response_model=list[ProgresoTemaItem])
def obtener_progreso_estudiante(
    estudiante_id: str,
    tema_id: str | None = Query(default=None),
    authorization: str | None = Header(default=None),
) -> list[ProgresoTemaItem]:
    estudiante_id = verificar_estudiante_autenticado(authorization, estudiante_id)
    supabase = get_supabase_client()

    query = (
        supabase.table("progreso_estudiante")
        .select("tema_id, lectura_completada, actividad_completada, reflexion_respondida, completado_en")
        .eq("estudiante_id", estudiante_id)
    )
    if tema_id is not None:
        query = query.eq("tema_id", tema_id)

    resultado = query.execute()

    return [ProgresoTemaItem(**fila) for fila in resultado.data or []]


@router.post("/registrar-actividad/{estudiante_id}")
def registrar_actividad(
    estudiante_id: str,
    authorization: str | None = Header(default=None),
) -> dict:
    estudiante_id = verificar_estudiante_autenticado(authorization, estudiante_id)
    supabase = get_supabase_client()

    hoy = date.today().isoformat()

    existente = (
        supabase.table("actividad_diaria")
        .select("id, elementos_completados")
        .eq("estudiante_id", estudiante_id)
        .eq("fecha_actividad", hoy)
        .maybe_single()
        .execute()
    )

    if existente and existente.data:
        supabase.table("actividad_diaria").update(
            {"elementos_completados": existente.data["elementos_completados"] + 1}
        ).eq("id", existente.data["id"]).execute()
    else:
        supabase.table("actividad_diaria").insert(
            {
                "estudiante_id": estudiante_id,
                "fecha_actividad": hoy,
                "elementos_completados": 1,
            }
        ).execute()

    return {"ok": True}
