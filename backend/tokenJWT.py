from jwt import InvalidTokenError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
from jose import jwt
from typing import Optional

from schemas.user import TokenData

SECRET_KEY = "tu_clave_secreta_aqui"  # En producción, usar una clave segura
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#verificamos el token
def verify_token(token,credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) #decodifica el token
        username = payload.get("sub") #obtenemos el username con la llave "sub"
        if username is None: #si es non la llave no existe y el usuario no esta autenticado
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
