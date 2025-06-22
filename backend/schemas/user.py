from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# Esquema para crear usuario
class UserBase(BaseModel):
    username: str
    email: str
    nombre: str
    apellido: str
    direccion: Optional[str] = None
    telefono: int

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    creacion: datetime
    estado: bool

    class Config:
        from_attributes = True

class UserId(BaseModel):
    id:int

class Login(BaseModel):
    username: str
    password:str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserResponse(BaseModel):
    access_token: str
    token_type: str
    user: User
