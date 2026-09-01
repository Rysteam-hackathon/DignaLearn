from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Header, HTTPException
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
