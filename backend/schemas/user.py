from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# Esquema base para usuario
class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone: Optional[str] = None

# Esquema para crear usuario
class UserCreate(UserBase):
    password: str
    confirmPassword: str  # Agrega confirmPassword

# Esquema para usuario completo
class User(UserBase):
    id: int
    level: str = "Bronce"
    points: int = 0
    benefits: int = 0
    achievements: str = "[]"  # JSON string de logros
    creacion: datetime
    estado: bool

    class Config:
        from_attributes = True

# Esquema para actualizar perfil
class UserUpdate(BaseModel):
    phone: Optional[str] = None
    level: Optional[str] = None
    points: Optional[int] = None
    benefits: Optional[int] = None
    achievements: Optional[str] = None

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