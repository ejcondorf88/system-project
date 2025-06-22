from fastapi import APIRouter,Depends
from fastapi import HTTPException,status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from  tokenJWT import verify_token


#ponemos el enlace de donde recibimos el token en este caso login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return verify_token(token,credentials_exception) #pasamos el token q resivimos

