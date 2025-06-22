from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Esquema base para usuario
class UserBase(BaseModel):
    username: str
    email: EmailStr

# Esquema para crear usuario
class UserCreate(UserBase):
    password: str
    confirmPassword: str  # Agrega confirmPassword

# Esquema para usuario completo
class User(UserBase):
    id: int
    creacion: datetime
    estado: bool

    class Config:
        from_attributes = True

# Resto de los esquemas sin cambios
class UserId(BaseModel):
    id: int

class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserResponse(BaseModel):
    access_token: str
    token_type: str
    user: User