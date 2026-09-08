from fastapi import APIRouter, HTTPException

from app.supabase_client import get_supabase_client

router = APIRouter(prefix="/api/pistas", tags=["pistas"])


@router.get("/{tipo_actividad}")
def obtener_pista(tipo_actividad: str) -> dict:
    supabase = get_supabase_client()

    tipo = (
        supabase.table("tipos_actividad")
        .select("id")
        .eq("nombre", tipo_actividad)
        .maybe_single()
        .execute()
    )
    if not tipo or not tipo.data:
        raise HTTPException(status_code=404, detail="Tipo de actividad no encontrado.")

    pista = (
        supabase.table("pistas_por_tipo_actividad")
        .select("texto_pista")
        .eq("tipo_actividad_id", tipo.data["id"])
        .maybe_single()
        .execute()
    )
    if not pista or not pista.data:
        raise HTTPException(status_code=404, detail="No hay pista configurada para este tipo de actividad.")

    return {"tipo_actividad": tipo_actividad, "texto_pista": pista.data["texto_pista"]}
