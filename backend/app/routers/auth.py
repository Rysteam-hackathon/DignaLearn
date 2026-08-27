from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.auth_service import crear_token_estudiante, verificar_pin
from app.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginEstudianteRequest(BaseModel):
    access_code: str
    pin: str


class LoginEstudianteResponse(BaseModel):
    token: str
    estudiante_id: str
    nombre: str | None
    grado_id: int
    access_code: str


@router.post("/login-estudiante", response_model=LoginEstudianteResponse)
def login_estudiante(body: LoginEstudianteRequest) -> LoginEstudianteResponse:
    supabase = get_supabase_client()

    perfil = (
        supabase.table("perfiles_estudiante")
        .select("id, grado_id, codigo_acceso, pin_hash, usuarios(nombre_display)")
        .eq("codigo_acceso", body.access_code.strip().upper())
        .maybe_single()
        .execute()
    )
    if not perfil or not perfil.data:
        raise HTTPException(status_code=401, detail="Código no encontrado")

    datos = perfil.data
    if not verificar_pin(body.pin, datos["pin_hash"]):
        raise HTTPException(status_code=401, detail="PIN incorrecto")

    usuario = datos.get("usuarios") or {}
    nombre = usuario.get("nombre_display")

    token = crear_token_estudiante(
        estudiante_id=datos["id"],
        grado_id=datos["grado_id"],
        access_code=datos["codigo_acceso"],
        nombre=nombre,
    )

    return LoginEstudianteResponse(
        token=token,
        estudiante_id=datos["id"],
        nombre=nombre,
        grado_id=datos["grado_id"],
        access_code=datos["codigo_acceso"],
    )
