import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

ALGORITHM = "HS256"
EXPIRA_DIAS = 7

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY no está configurada. Agregala al archivo .env del backend "
        "(ej: JWT_SECRET_KEY=una-clave-larga-y-aleatoria)."
    )


def verificar_pin(pin_plano: str, pin_hash: str) -> bool:
    return bcrypt.checkpw(pin_plano.encode(), pin_hash.encode())


def crear_token_estudiante(
    estudiante_id: str, grado_id: int, access_code: str, nombre: str | None
) -> str:
    ahora = datetime.now(timezone.utc)
    payload = {
        "sub": estudiante_id,
        "grado_id": grado_id,
        "access_code": access_code,
        "nombre": nombre,
        "iat": ahora,
        "exp": ahora + timedelta(days=EXPIRA_DIAS),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=ALGORITHM)


def verificar_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido.")


def verificar_estudiante_autenticado(authorization: str | None, estudiante_id: str) -> str:
    """Verifica el JWT del estudiante y devuelve el estudiante_id real (campo "sub"
    del token). Lanza 401 si falta el token, es inválido/expiró, o no corresponde
    al estudiante_id recibido en el body/URL."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Falta el token de autenticación.")

    token = authorization.removeprefix("Bearer ").strip()
    payload = verificar_token(token)

    sub = payload.get("sub")
    if not sub or sub != estudiante_id:
        raise HTTPException(status_code=401, detail="El token no corresponde a este estudiante.")

    return sub
