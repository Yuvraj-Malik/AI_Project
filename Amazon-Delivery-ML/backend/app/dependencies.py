from fastapi import Header, HTTPException
import jwt

from .security import decode_token


def get_current_user(authorization: str = Header(default="")) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid bearer token")
    token = authorization.replace("Bearer ", "", 1)
    try:
        payload = decode_token(token)
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token subject")
    return username
