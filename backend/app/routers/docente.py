from uuid import uuid4
import secrets
import string

import bcrypt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/docente", tags=["docente"])

CODIGO_CHARS = string.ascii_uppercase + string.digits


def _generar_codigo() -> str:
    sufijo = "".join(secrets.choice(CODIGO_CHARS) for _ in range(4))
    return f"DL-{sufijo}"


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
def listar_estudiantes(docente_usuario_id: str) -> list[EstudianteResumen]:
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

    resultado: list[EstudianteResumen] = []
    for perfil in perfiles.data or []:
        usuario = (
            supabase.table("usuarios")
            .select("nombre_display")
            .eq("id", perfil["usuario_id"])
            .maybe_single()
            .execute()
        )
        nombre = usuario.data["nombre_display"] if usuario and usuario.data else None

        progreso = (
            supabase.table("progreso_estudiante")
            .select("id")
            .eq("estudiante_id", perfil["id"])
            .eq("lectura_completada", True)
            .eq("actividad_completada", True)
            .eq("reflexion_respondida", True)
            .execute()
        )
        temas_completados = len(progreso.data or [])

        ultima = (
            supabase.table("actividad_diaria")
            .select("fecha_actividad")
            .eq("estudiante_id", perfil["id"])
            .order("fecha_actividad", desc=True)
            .limit(1)
            .maybe_single()
            .execute()
        )
        ultima_actividad = ultima.data["fecha_actividad"] if ultima and ultima.data else None

        resultado.append(EstudianteResumen(
            id=perfil["id"],
            nombre_display=nombre,
            codigo_acceso=perfil["codigo_acceso"],
            grado_id=perfil["grado_id"],
            temas_completados=temas_completados,
            ultima_actividad=ultima_actividad,
        ))

    return resultado


@router.post("/estudiantes", status_code=201)
def crear_estudiante(body: CrearEstudianteRequest) -> dict:
    supabase = get_supabase_client()
    perfil_docente = _obtener_perfil_docente(supabase, body.docente_usuario_id)
    rol_estudiante_id = _obtener_rol_id(supabase, "student")

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

    # Resolver numero_grado → id real en tabla grados
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

    return {"estudiante_id": estudiante_id, "codigo_acceso": codigo}


@router.post("/resetear-pin")
def resetear_pin(body: ResetearPinRequest) -> dict:
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
