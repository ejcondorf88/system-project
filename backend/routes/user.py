from typing import List
import json

from fastapi import APIRouter,Depends, status
from database.database import get_db
from sqlalchemy.orm import Session
from database import models
from passlib.context import CryptContext

from core.security import get_current_user
from repository import user as user_repository
from fastapi import HTTPException,status
from database.models import User
from schemas.user import UserCreate, UserUpdate, Role, RoleCreate, Membership, MembershipCreate, Routine, RoutineCreate, Point, PointCreate, Achievement, AchievementCreate

router = APIRouter(
    tags= ["Users"]
)

@router.get("/",status_code=status.HTTP_200_OK)
def get_users(db:Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    data = db.query(models.User).all()
    print(data)
    return data

@router.post('/create',status_code=status.HTTP_202_ACCEPTED)
def create_user(usuario:UserCreate, db:Session = Depends(get_db)):
    user.crear_usuario(usuario,db)
    return{"respuesta":"Usuario creado"}

@router.get("/me", status_code=status.HTTP_200_OK)
def get_me(current_user: User = Depends(get_current_user)):
    # Convertir achievements de string a lista
    achievements = []
    try:
        achievements = json.loads(current_user.achievements) if current_user.achievements else []
    except:
        achievements = []
    
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "phone": current_user.phone,
        "level": current_user.level,
        "points": current_user.points,
        "benefits": current_user.benefits,
        "achievements": achievements,
        "creacion": current_user.creacion,
        "estado": current_user.estado,
        "is_superuser": getattr(current_user, 'is_superuser', False)
    }

@router.put("/me", status_code=status.HTTP_200_OK)
def update_me(user_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_user = user.actualizar_usuario(current_user.id, user_data, db)
    
    # Convertir achievements de string a lista
    achievements = []
    try:
        achievements = json.loads(updated_user.achievements) if updated_user.achievements else []
    except:
        achievements = []
    
    return {
        "id": updated_user.id,
        "username": updated_user.username,
        "email": updated_user.email,
        "phone": updated_user.phone,
        "level": updated_user.level,
        "points": updated_user.points,
        "benefits": updated_user.benefits,
        "achievements": achievements,
        "creacion": updated_user.creacion,
        "estado": updated_user.estado
    }

# --- Roles ---
@router.post("/roles", response_model=Role)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    return user_repository.crear_rol(db, name=role.name)

# --- Membresías ---
@router.post("/memberships", response_model=Membership)
def create_membership(membership: MembershipCreate, db: Session = Depends(get_db)):
    return user_repository.crear_membresia(db, name=membership.name, description=membership.description, price=membership.price, duration_days=membership.duration_days)

# --- Rutinas ---
@router.post("/routines", response_model=Routine)
def create_routine(routine: RoutineCreate, db: Session = Depends(get_db)):
    return user_repository.crear_rutina(db, name=routine.name, focus=routine.focus, level=routine.level, description=routine.description)

# --- Puntos ---
@router.post("/points", response_model=Point)
def create_point(point: PointCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede asignar puntos.")
    return user_repository.crear_punto(db, user_id=point.user_id, amount=point.amount, reason=point.reason)

# --- Logros ---
@router.post("/achievements", response_model=Achievement)
def create_achievement(achievement: AchievementCreate, db: Session = Depends(get_db)):
    return user_repository.crear_logro(db, name=achievement.name, description=achievement.description)