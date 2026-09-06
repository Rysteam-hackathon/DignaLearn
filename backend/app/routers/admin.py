from pydantic import BaseModel
from fastapi import APIRouter, Header, HTTPException

from app.services.auth_service import verificar_docente_autenticado, _obtener_perfil_admin
from app.supabase_client import get_supabase_client
from app.routers.grupos import _calcular_stats_grupo

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _grupo_ids_de_institucion(supabase, institucion_id: str) -> list[str]:
    r = supabase.table("grupos").select("id").eq("institucion_id", institucion_id).execute()
    return [g["id"] for g in r.data or []]


def _grados_por_id(supabase, grado_ids: list[int]) -> dict[int, dict]:
    if not grado_ids:
        return {}
    r = supabase.table("grados").select("id, numero_grado, nombre_display").in_("id", grado_ids).execute()
    return {g["id"]: g for g in r.data or []}


# ---------------------------------------------------------------------------
# GET /api/admin/mi-institucion
# ---------------------------------------------------------------------------

class InstitucionInfo(BaseModel):
    id: str
    nombre: str
    ciudad: str | None
    codigo_institucion: str


class MiInstitucionResponse(BaseModel):
    institucion: InstitucionInfo
    total_grupos: int
    total_docentes: int
    total_estudiantes: int


@router.get("/mi-institucion", response_model=MiInstitucionResponse)
def mi_institucion(authorization: str | None = Header(default=None)) -> MiInstitucionResponse:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_admin(supabase, usuario_id)
    institucion_id = perfil["institucion_id"]

    institucion = (
        supabase.table("instituciones")
        .select("id, nombre, ciudad, codigo_institucion")
        .eq("id", institucion_id)
        .single()
        .execute()
    )

    grupo_ids = _grupo_ids_de_institucion(supabase, institucion_id)

    total_estudiantes = 0
    if grupo_ids:
        est = (
            supabase.table("perfiles_estudiante")
            .select("id", count="exact")
            .in_("grupo_id", grupo_ids)
            .execute()
        )
        total_estudiantes = est.count or 0

    docentes = (
        supabase.table("perfiles_docente")
        .select("id", count="exact")
        .eq("institucion_id", institucion_id)
        .execute()
    )

    return MiInstitucionResponse(
        institucion=InstitucionInfo(**institucion.data),
        total_grupos=len(grupo_ids),
        total_docentes=docentes.count or 0,
        total_estudiantes=total_estudiantes,
    )


# ---------------------------------------------------------------------------
# GET /api/admin/grupos, POST /api/admin/grupos
# ---------------------------------------------------------------------------

class GrupoAdminResumen(BaseModel):
    id: str
    nombre: str
    grado_id: int
    numero_grado: int | None
    grado_nombre: str | None
    anio_lectivo: int | None
    total_estudiantes: int
    total_docentes: int


class CrearGrupoRequest(BaseModel):
    nombre: str
    numero_grado: int


def _listar_grupos_institucion(supabase, institucion_id: str) -> list[GrupoAdminResumen]:
    grupos = (
        supabase.table("grupos")
        .select("id, nombre, grado_id, anio_lectivo")
        .eq("institucion_id", institucion_id)
        .execute()
    ).data or []

    if not grupos:
        return []

    grupo_ids = [g["id"] for g in grupos]
    grados_map = _grados_por_id(supabase, list({g["grado_id"] for g in grupos}))

    estudiantes_batch = (
        supabase.table("perfiles_estudiante").select("grupo_id").in_("grupo_id", grupo_ids).execute()
    ).data or []
    estudiantes_por_grupo: dict[str, int] = {}
    for row in estudiantes_batch:
        gid = row["grupo_id"]
        estudiantes_por_grupo[gid] = estudiantes_por_grupo.get(gid, 0) + 1

    docentes_batch = (
        supabase.table("docente_grupos").select("grupo_id").in_("grupo_id", grupo_ids).execute()
    ).data or []
    docentes_por_grupo: dict[str, int] = {}
    for row in docentes_batch:
        gid = row["grupo_id"]
        docentes_por_grupo[gid] = docentes_por_grupo.get(gid, 0) + 1

    resultado = []
    for g in grupos:
        grado = grados_map.get(g["grado_id"])
        resultado.append(GrupoAdminResumen(
            id=g["id"],
            nombre=g["nombre"],
            grado_id=g["grado_id"],
            numero_grado=grado["numero_grado"] if grado else None,
            grado_nombre=grado["nombre_display"] if grado else None,
            anio_lectivo=g["anio_lectivo"],
            total_estudiantes=estudiantes_por_grupo.get(g["id"], 0),
            total_docentes=docentes_por_grupo.get(g["id"], 0),
        ))
    return resultado


@router.get("/grupos", response_model=list[GrupoAdminResumen])
def listar_grupos(authorization: str | None = Header(default=None)) -> list[GrupoAdminResumen]:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_admin(supabase, usuario_id)
    return _listar_grupos_institucion(supabase, perfil["institucion_id"])


@router.post("/grupos", status_code=201, response_model=GrupoAdminResumen)
def crear_grupo(
    body: CrearGrupoRequest,
    authorization: str | None = Header(default=None),
) -> GrupoAdminResumen:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_admin(supabase, usuario_id)

    grado = (
        supabase.table("grados")
        .select("id, numero_grado, nombre_display")
        .eq("numero_grado", body.numero_grado)
        .eq("nivel", "secundaria")
        .maybe_single()
        .execute()
    )
    if not grado or not grado.data:
        raise HTTPException(status_code=400, detail="El grado indicado no existe.")

    nuevo = (
        supabase.table("grupos")
        .insert({
            "nombre": body.nombre,
            "grado_id": grado.data["id"],
            "institucion_id": perfil["institucion_id"],
        })
        .execute()
    )
    creado = nuevo.data[0]

    return GrupoAdminResumen(
        id=creado["id"],
        nombre=creado["nombre"],
        grado_id=creado["grado_id"],
        numero_grado=grado.data["numero_grado"],
        grado_nombre=grado.data["nombre_display"],
        anio_lectivo=creado["anio_lectivo"],
        total_estudiantes=0,
        total_docentes=0,
    )


# ---------------------------------------------------------------------------
# GET /api/admin/docentes, POST /api/admin/docentes
# ---------------------------------------------------------------------------

class GrupoAsignado(BaseModel):
    id: str
    nombre: str
    grado_nombre: str | None


class DocenteResumen(BaseModel):
    id: str
    usuario_id: str
    nombre_display: str | None
    email: str | None
    grupos: list[GrupoAsignado]


class CrearDocenteRequest(BaseModel):
    nombre_display: str
    email: str
    password: str
    grupo_ids: list[str]


class CrearDocenteResponse(BaseModel):
    docente_id: str
    usuario_id: str
    email: str
    grupos_asignados: list[str]


@router.get("/docentes", response_model=list[DocenteResumen])
def listar_docentes(authorization: str | None = Header(default=None)) -> list[DocenteResumen]:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_admin(supabase, usuario_id)

    docentes = (
        supabase.table("perfiles_docente")
        .select("id, usuario_id")
        .eq("institucion_id", perfil["institucion_id"])
        .execute()
    ).data or []

    if not docentes:
        return []

    docente_ids = [d["id"] for d in docentes]
    usuario_ids = [d["usuario_id"] for d in docentes]

    usuarios_batch = (
        supabase.table("usuarios").select("id, nombre_display, email").in_("id", usuario_ids).execute()
    ).data or []
    usuarios_map = {u["id"]: u for u in usuarios_batch}

    vinculos = (
        supabase.table("docente_grupos").select("docente_id, grupo_id").in_("docente_id", docente_ids).execute()
    ).data or []

    grupo_ids = list({v["grupo_id"] for v in vinculos})
    grupos_map: dict[str, dict] = {}
    if grupo_ids:
        grupos_data = (
            supabase.table("grupos").select("id, nombre, grado_id").in_("id", grupo_ids).execute()
        ).data or []
        grados_map = _grados_por_id(supabase, list({g["grado_id"] for g in grupos_data}))
        for g in grupos_data:
            grado = grados_map.get(g["grado_id"])
            grupos_map[g["id"]] = {
                "id": g["id"],
                "nombre": g["nombre"],
                "grado_nombre": grado["nombre_display"] if grado else None,
            }

    grupos_por_docente: dict[str, list[dict]] = {}
    for v in vinculos:
        grupos_por_docente.setdefault(v["docente_id"], []).append(grupos_map[v["grupo_id"]])

    resultado = []
    for d in docentes:
        usuario = usuarios_map.get(d["usuario_id"], {})
        resultado.append(DocenteResumen(
            id=d["id"],
            usuario_id=d["usuario_id"],
            nombre_display=usuario.get("nombre_display"),
            email=usuario.get("email"),
            grupos=[GrupoAsignado(**g) for g in grupos_por_docente.get(d["id"], [])],
        ))
    return resultado


@router.post("/docentes", status_code=201, response_model=CrearDocenteResponse)
def crear_docente(
    body: CrearDocenteRequest,
    authorization: str | None = Header(default=None),
) -> CrearDocenteResponse:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_admin(supabase, usuario_id)

    if not body.grupo_ids:
        raise HTTPException(status_code=400, detail="Tenés que asignar al menos un grupo.")

    grupos_validos = (
        supabase.table("grupos")
        .select("id")
        .eq("institucion_id", perfil["institucion_id"])
        .in_("id", body.grupo_ids)
        .execute()
    ).data or []
    if len(grupos_validos) != len(set(body.grupo_ids)):
        raise HTTPException(status_code=400, detail="Uno o más grupos no pertenecen a tu institución.")

    rol = supabase.table("roles").select("id").eq("nombre", "teacher").single().execute()
    rol_teacher_id = rol.data["id"]

    auth_user_id: str | None = None
    usuario_creado = False
    perfil_docente_id: str | None = None

    try:
        auth_respuesta = supabase.auth.admin.create_user({
            "email": body.email,
            "password": body.password,
            "email_confirm": True,
        })
        auth_user_id = auth_respuesta.user.id

        supabase.table("usuarios").insert({
            "id": auth_user_id,
            "email": body.email,
            "nombre_display": body.nombre_display,
            "rol_id": rol_teacher_id,
        }).execute()
        usuario_creado = True

        perfil_resultado = supabase.table("perfiles_docente").insert({
            "usuario_id": auth_user_id,
            "institucion_id": perfil["institucion_id"],
        }).execute()
        perfil_docente_id = perfil_resultado.data[0]["id"]

        supabase.table("docente_grupos").insert([
            {"docente_id": perfil_docente_id, "grupo_id": gid} for gid in body.grupo_ids
        ]).execute()

    except Exception as error:
        if perfil_docente_id:
            try:
                supabase.table("perfiles_docente").delete().eq("id", perfil_docente_id).execute()
            except Exception as cleanup_error:
                print(f"[admin] error limpiando perfiles_docente tras fallo: {cleanup_error}")
        if usuario_creado:
            try:
                supabase.table("usuarios").delete().eq("id", auth_user_id).execute()
            except Exception as cleanup_error:
                print(f"[admin] error limpiando usuarios tras fallo: {cleanup_error}")
        if auth_user_id:
            try:
                supabase.auth.admin.delete_user(auth_user_id)
            except Exception as cleanup_error:
                print(f"[admin] error limpiando usuario de Auth tras fallo: {cleanup_error}")
        raise HTTPException(status_code=400, detail=f"No se pudo crear el docente: {error}")

    return CrearDocenteResponse(
        docente_id=perfil_docente_id,
        usuario_id=auth_user_id,
        email=body.email,
        grupos_asignados=body.grupo_ids,
    )


# ---------------------------------------------------------------------------
# GET /api/admin/reportes
# ---------------------------------------------------------------------------

class ReporteGrupo(BaseModel):
    grupo_id: str
    grupo_nombre: str
    grado_nombre: str | None
    total_estudiantes: int
    promedio: int
    activos_semana: int
    sin_actividad: int


@router.get("/reportes", response_model=list[ReporteGrupo])
def reportes(authorization: str | None = Header(default=None)) -> list[ReporteGrupo]:
    usuario_id = verificar_docente_autenticado(authorization)
    supabase = get_supabase_client()
    perfil = _obtener_perfil_admin(supabase, usuario_id)

    grupos = (
        supabase.table("grupos")
        .select("id, nombre, grado_id")
        .eq("institucion_id", perfil["institucion_id"])
        .execute()
    ).data or []

    if not grupos:
        return []

    grados_map = _grados_por_id(supabase, list({g["grado_id"] for g in grupos}))

    resultado = []
    for g in grupos:
        stats = _calcular_stats_grupo(supabase, g["id"], g["grado_id"])
        grado = grados_map.get(g["grado_id"])
        resultado.append(ReporteGrupo(
            grupo_id=g["id"],
            grupo_nombre=g["nombre"],
            grado_nombre=grado["nombre_display"] if grado else None,
            total_estudiantes=stats.total,
            promedio=stats.promedio,
            activos_semana=stats.activos_semana,
            sin_actividad=stats.sin_actividad,
        ))
    return resultado
