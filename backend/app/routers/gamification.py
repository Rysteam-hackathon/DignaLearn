from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gamification import LogroDesbloqueado, evaluar_logros

router = APIRouter(prefix="/api/gamification", tags=["gamification"])


class EvaluarLogrosRequest(BaseModel):
    tema_id: str


@router.post("/evaluar/{estudiante_id}", response_model=list[LogroDesbloqueado])
def evaluar(estudiante_id: str, body: EvaluarLogrosRequest) -> list[LogroDesbloqueado]:
    return evaluar_logros(estudiante_id, body.tema_id)
