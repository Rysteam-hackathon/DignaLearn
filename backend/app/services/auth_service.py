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
