from fastapi import APIRouter, Header
from pydantic import BaseModel

from app.services.auth_service import verificar_estudiante_autenticado
from app.services.gamification import LogroDesbloqueado, evaluar_logros

router = APIRouter(prefix="/api/gamification", tags=["gamification"])


class EvaluarLogrosRequest(BaseModel):
    tema_id: str


@router.post("/evaluar/{estudiante_id}", response_model=list[LogroDesbloqueado])
def evaluar(
    estudiante_id: str,
    body: EvaluarLogrosRequest,
    authorization: str | None = Header(default=None),
) -> list[LogroDesbloqueado]:
    estudiante_id_verificado = verificar_estudiante_autenticado(authorization, estudiante_id)
    return evaluar_logros(estudiante_id_verificado, body.tema_id)
