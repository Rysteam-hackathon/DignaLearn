from uuid import uuid4
import secrets
import string

import bcrypt
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/docente", tags=["docente"])

CODIGO_CHARS = string.ascii_uppercase + string.digits


def _generar_codigo() -> str:
    sufijo = "".join(secrets.choice(CODIGO_CHARS) for _ in range(4))
    return f"DL-{sufijo}"


def _verificar_docente_autenticado(authorization: str | None, docente_usuario_id: str) -> None:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Falta el token de autenticación.")

    token = authorization.removeprefix("Bearer ").strip()
    supabase = get_supabase_client()

    try:
        respuesta = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado.")

    usuario = respuesta.user if respuesta else None
    if not usuario or usuario.id != docente_usuario_id:
        raise HTTPException(status_code=401, detail="El token no corresponde a este docente.")


def _obtener_perfil_docente(supabase, usuario_id: str) -> dict:
    resultado = (
        supabase.table("perfiles_docente")
        .select("id")
        .eq("usuario_id", usuario_id)
        .maybe_single()
        .execute()
    )
    if not resultado or not resultado.data:
        raise HTTPException(status_code=404, detail="Perfil de docente no encontrado.")
    return resultado.data


def _obtener_rol_id(supabase, nombre: str) -> int:
    resultado = (
        supabase.table("roles")
        .select("id")
        .eq("nombre", nombre)
        .maybe_single()
        .execute()
    )
    if not resultado or not resultado.data:
        raise HTTPException(status_code=500, detail=f"Rol '{nombre}' no encontrado.")
    return resultado.data["id"]


class CrearEstudianteRequest(BaseModel):
    docente_usuario_id: str
    nombre_display: str
    grado_id: int
    pin: str


class ResetearPinRequest(BaseModel):
    docente_usuario_id: str
    estudiante_id: str
    nuevo_pin: str


class EstudianteResumen(BaseModel):
    id: str
    nombre_display: str | None
    codigo_acceso: str
    grado_id: int
    temas_completados: int
    ultima_actividad: str | None


@router.get("/estudiantes/{docente_usuario_id}", response_model=list[EstudianteResumen])
def listar_estudiantes(
    docente_usuario_id: str,
    authorization: str | None = Header(default=None),
) -> list[EstudianteResumen]:
    _verificar_docente_autenticado(authorization, docente_usuario_id)

    supabase = get_supabase_client()
    perfil_docente = _obtener_perfil_docente(supabase, docente_usuario_id)

    vinculos = (
        supabase.table("docente_estudiantes")
        .select("estudiante_id")
        .eq("docente_id", perfil_docente["id"])
        .execute()
    )
    if not vinculos.data:
        return []

    estudiante_ids = [v["estudiante_id"] for v in vinculos.data]

    perfiles = (
        supabase.table("perfiles_estudiante")
        .select("id, codigo_acceso, grado_id, usuario_id")
        .in_("id", estudiante_ids)
        .execute()
    )

    perfiles_data = perfiles.data or []
    if not perfiles_data:
        return []

    ids = [perfil["id"] for perfil in perfiles_data]
    usuario_ids = [perfil["usuario_id"] for perfil in perfiles_data]

    usuarios_batch = (
        supabase.table("usuarios")
        .select("id, nombre_display")
        .in_("id", usuario_ids)
        .execute()
    )
    nombre_por_usuario = {row["id"]: row["nombre_display"] for row in usuarios_batch.data or []}

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

    resultado: list[EstudianteResumen] = []
    for perfil in perfiles_data:
        eid = perfil["id"]
        resultado.append(EstudianteResumen(
            id=eid,
            nombre_display=nombre_por_usuario.get(perfil["usuario_id"]),
            codigo_acceso=perfil["codigo_acceso"],
            grado_id=perfil["grado_id"],
            temas_completados=temas_por_estudiante.get(eid, 0),
            ultima_actividad=ultima_actividad_por_estudiante.get(eid),
        ))

    return resultado


@router.post("/estudiantes", status_code=201)
def crear_estudiante(
    body: CrearEstudianteRequest,
    authorization: str | None = Header(default=None),
) -> dict:
    _verificar_docente_autenticado(authorization, body.docente_usuario_id)

    supabase = get_supabase_client()
    perfil_docente = _obtener_perfil_docente(supabase, body.docente_usuario_id)
    rol_estudiante_id = _obtener_rol_id(supabase, "student")

    # Resolver numero_grado → id real en tabla grados (antes de crear nada)
    grado_resultado = (
        supabase.table("grados")
        .select("id")
        .eq("numero_grado", body.grado_id)
        .eq("nivel", "secundaria")
        .maybe_single()
        .execute()
    )
    if not grado_resultado or not grado_resultado.data:
        raise HTTPException(status_code=400, detail="Grado no válido.")
    grado_id_real = grado_resultado.data["id"]

    for _ in range(10):
        codigo = _generar_codigo()
        existe = (
            supabase.table("perfiles_estudiante")
            .select("id")
            .eq("codigo_acceso", codigo)
            .maybe_single()
            .execute()
        )
        if not existe or not existe.data:
            break
    else:
        raise HTTPException(status_code=500, detail="No se pudo generar código único.")

    pin_hash = bcrypt.hashpw(body.pin.encode(), bcrypt.gensalt()).decode()

    usuario_id = str(uuid4())

    supabase.table("usuarios").insert({
        "id": usuario_id,
        "nombre_display": body.nombre_display,
        "rol_id": rol_estudiante_id,
    }).execute()

    try:
        perfil_resultado = (
            supabase.table("perfiles_estudiante")
            .insert({
                "usuario_id": usuario_id,
                "grado_id": grado_id_real,
                "codigo_acceso": codigo,
                "pin_hash": pin_hash,
            })
            .execute()
        )
        estudiante_id = perfil_resultado.data[0]["id"]

        supabase.table("docente_estudiantes").insert({
            "docente_id": perfil_docente["id"],
            "estudiante_id": estudiante_id,
        }).execute()
    except Exception:
        supabase.table("usuarios").delete().eq("id", usuario_id).execute()
        raise

    return {"estudiante_id": estudiante_id, "codigo_acceso": codigo}


@router.post("/resetear-pin")
def resetear_pin(
    body: ResetearPinRequest,
    authorization: str | None = Header(default=None),
) -> dict:
    _verificar_docente_autenticado(authorization, body.docente_usuario_id)

    supabase = get_supabase_client()
    perfil_docente = _obtener_perfil_docente(supabase, body.docente_usuario_id)

    vinculo = (
        supabase.table("docente_estudiantes")
        .select("id")
        .eq("docente_id", perfil_docente["id"])
        .eq("estudiante_id", body.estudiante_id)
        .maybe_single()
        .execute()
    )
    if not vinculo or not vinculo.data:
        raise HTTPException(status_code=403, detail="Este estudiante no pertenece a tu grupo.")

    pin_hash = bcrypt.hashpw(body.nuevo_pin.encode(), bcrypt.gensalt()).decode()
    supabase.table("perfiles_estudiante").update(
        {"pin_hash": pin_hash}
    ).eq("id", body.estudiante_id).execute()

    return {"ok": True}
