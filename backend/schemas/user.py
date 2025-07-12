from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# --- Roles ---
class RoleBase(BaseModel):
    name: str
    status: int = 1  # 0 = inactivo, 1 = activo

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# --- Membresías ---
class MembershipBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    duration_days: Optional[int] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class MembershipCreate(MembershipBase):
    pass

class Membership(MembershipBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class UserMembershipBase(BaseModel):
    user_id: int
    membership_id: int
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class UserMembershipCreate(UserMembershipBase):
    pass

class UserMembership(UserMembershipBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# --- Rutinas ---
class RoutineBase(BaseModel):
    name: str
    focus: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class RoutineCreate(RoutineBase):
    pass

class Routine(RoutineBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class UserRoutineBase(BaseModel):
    user_id: int
    routine_id: int
    assigned_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class UserRoutineCreate(UserRoutineBase):
    pass

class UserRoutine(UserRoutineBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# --- Puntos ---
class PointBase(BaseModel):
    user_id: int
    amount: int
    reason: Optional[str] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class PointCreate(PointBase):
    pass

class Point(PointBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# --- Logros ---
class AchievementBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class AchievementCreate(AchievementBase):
    pass

class Achievement(AchievementBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class UserAchievementBase(BaseModel):
    user_id: int
    achievement_id: int
    obtained_at: Optional[datetime] = None
    status: int = 1  # 0 = inactivo, 1 = activo

class UserAchievementCreate(UserAchievementBase):
    pass

class UserAchievement(UserAchievementBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Esquema base para usuario
class UserBase(BaseModel):
    username: str
    email: EmailStr
    phone: Optional[str] = None
    is_superuser: bool = False  # Indica si el usuario es superusuario (CRM)
    is_trainer: bool = False  # Indica si el usuario es entrenador

# Esquema para crear usuario
class UserCreate(UserBase):
    password: str
    confirmPassword: str
    # is_superuser se puede pasar en el registro si se desea crear un superusuario

# Esquema para usuario completo
class User(UserBase):
    id: int
    level: str = "Bronce"
    points: int = 0
    benefits: int = 0
    achievements: str = "[]"  # JSON string de logros
    creacion: datetime
    estado: bool
    is_superuser: bool = False
    is_trainer: bool = False
    status: int = 1  # 0 = inactivo, 1 = activo
    created_at: datetime
    updated_at: datetime

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