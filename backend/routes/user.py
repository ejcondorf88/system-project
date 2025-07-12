from typing import List
import json
from fastapi import APIRouter, Depends, status, Request
from database.database import get_db
from sqlalchemy.orm import Session
from database import models
from passlib.context import CryptContext
from core.security import get_current_user
from repository import user as user_repository
from fastapi import HTTPException, status
from database.models import User
from schemas.user import UserCreate, UserUpdate, Role, RoleCreate, Membership, MembershipCreate, Routine, RoutineCreate, Point, PointCreate, Achievement, AchievementCreate
from services.audit_service import AuditService
from middleware.audit_middleware import AuditMiddleware
from pydantic import BaseModel

router = APIRouter(
    tags= ["Users"]
)

@router.get("/",status_code=status.HTTP_200_OK)
def get_users(db:Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    data = db.query(models.User).all()
    print(data)
    return data

@router.post('/create',status_code=status.HTTP_202_ACCEPTED)
def create_user(
    usuario: UserCreate, 
    request: Request,
    db: Session = Depends(get_db)
):
    # Crear usuario
    new_user = user_repository.crear_usuario(usuario, db)
    
    # Registrar auditoría
    ip_address = AuditMiddleware.get_client_ip(request)
    user_agent = AuditMiddleware.get_user_agent(request)
    
    AuditService.log_create(
        db=db,
        table_name="users",
        record_id=new_user.id,
        user_id=new_user.id,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    return {"respuesta": "Usuario creado"}

@router.get("/me", status_code=status.HTTP_200_OK)
def get_me(current_user: User = Depends(get_current_user)):
    print(f"[DEBUG] achievements_json: {current_user.achievements_json} (type: {type(current_user.achievements_json)})")
    achievements = current_user.achievements_json
    if not isinstance(achievements, str):
        print(f"[DEBUG] achievements no es string, serializando con json.dumps")
        achievements = json.dumps(achievements if achievements else [])
    print(f"[DEBUG] achievements final: {achievements} (type: {type(achievements)})")
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
def update_me(
    user_data: UserUpdate, 
    request: Request,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Obtener usuario actual para comparar cambios
    old_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    
    # Actualizar usuario
    updated_user = user_repository.actualizar_usuario(current_user.id, user_data, db)
    
    # Registrar auditoría para cada campo modificado
    ip_address = AuditMiddleware.get_client_ip(request)
    user_agent = AuditMiddleware.get_user_agent(request)
    
    if old_user.phone != updated_user.phone:
        AuditService.log_update(
            db=db,
            table_name="users",
            record_id=updated_user.id,
            field_name="phone",
            old_value=old_user.phone,
            new_value=updated_user.phone,
            user_id=updated_user.id,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    if old_user.level != updated_user.level:
        AuditService.log_update(
            db=db,
            table_name="users",
            record_id=updated_user.id,
            field_name="level",
            old_value=old_user.level,
            new_value=updated_user.level,
            user_id=updated_user.id,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
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

class AssignPointsRequest(BaseModel):
    user_id: int
    amount: int
    reason: str

# Nuevo endpoint para asignar puntos y actualizar el total del usuario
@router.post("/assign-points")
def assign_points_to_user(
    data: AssignPointsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede asignar puntos.")
    
    # Verificar que el usuario existe
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Crear el registro de puntos
    point = user_repository.crear_punto(db, user_id=data.user_id, amount=data.amount, reason=data.reason)
    
    # Actualizar el total de puntos del usuario
    user.points += data.amount
    db.commit()
    db.refresh(user)
    
    return {
        "message": f"Se asignaron {data.amount} puntos a {user.username}",
        "user_id": data.user_id,
        "amount": data.amount,
        "reason": data.reason,
        "new_total": user.points
    }

class ChangeLevelRequest(BaseModel):
    level: str

# Endpoint para cambiar nivel de usuario
@router.put("/{user_id}/level")
def change_user_level(
    user_id: int,
    data: ChangeLevelRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede cambiar niveles.")
    
    valid_levels = ["Bronce", "Plata", "Oro"]
    if data.level not in valid_levels:
        raise HTTPException(status_code=400, detail=f"Nivel inválido. Debe ser uno de: {', '.join(valid_levels)}")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    old_level = user.level
    user.level = data.level
    db.commit()
    db.refresh(user)
    
    return {
        "message": f"Nivel de {user.username} cambiado de {old_level} a {data.level}",
        "user_id": user_id,
        "old_level": old_level,
        "new_level": data.level
    }

# Endpoint para obtener puntos de un usuario específico
@router.get("/{user_id}/points")
def get_user_points(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede ver puntos de otros usuarios.")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener historial de puntos
    points_history = db.query(models.Point).filter(models.Point.user_id == user_id).order_by(models.Point.created_at.desc()).all()
    
    return {
        "user_id": user_id,
        "username": user.username,
        "total_points": user.points,
        "points_history": [
            {
                "id": point.id,
                "amount": point.amount,
                "reason": point.reason,
                "created_at": point.created_at
            }
            for point in points_history
        ]
    }

# --- Logros ---
@router.post("/achievements", response_model=Achievement)
def create_achievement(achievement: AchievementCreate, db: Session = Depends(get_db)):
    return user_repository.crear_logro(db, name=achievement.name, description=achievement.description)