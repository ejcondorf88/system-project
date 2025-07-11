
from fastapi.openapi.utils import status_code_ranges
from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from core.security import hash_password
from database import models


def crear_usuario(user,db:Session):
    usuario = user.dict()
    try:

        new_user = models.User(
            username=usuario["username"],
            password=hash_password(usuario["password"]),
            email=usuario["email"],
            phone=usuario.get("phone"),  # Campo celular opcional
            level="Bronce",  # Nivel inicial
            points=0,  # Puntos iniciales
            benefits=0,  # Beneficios iniciales
            achievements="[]"  # Logros iniciales vacíos
        )
        # agragamos
        db.add(new_user)
        # commit y refresh
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Error creando usuario{e}"
        )

def obtener_usuario_por_id(user_id: int, db: Session):
    return db.query(models.User).filter(models.User.id == user_id).first()

def actualizar_usuario(user_id: int, user_data, db: Session):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Actualizar campos si están presentes
    if user_data.phone is not None:
        user.phone = user_data.phone
    if user_data.level is not None:
        user.level = user_data.level
    if user_data.points is not None:
        user.points = user_data.points
    if user_data.benefits is not None:
        user.benefits = user_data.benefits
    if user_data.achievements is not None:
        user.achievements = user_data.achievements
    
    db.commit()
    db.refresh(user)
    return user

def crear_rol(db: Session, name: str):
    role = models.Role(name=name)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

def crear_membresia(db: Session, name: str, description: str = None, price: float = None, duration_days: int = None):
    membership = models.Membership(name=name, description=description, price=price, duration_days=duration_days)
    db.add(membership)
    db.commit()
    db.refresh(membership)
    return membership

def crear_rutina(db: Session, name: str, focus: str = None, level: str = None, description: str = None):
    routine = models.Routine(name=name, focus=focus, level=level, description=description)
    db.add(routine)
    db.commit()
    db.refresh(routine)
    return routine

def crear_punto(db: Session, user_id: int, amount: int, reason: str = None):
    point = models.Point(user_id=user_id, amount=amount, reason=reason)
    db.add(point)
    db.commit()
    db.refresh(point)
    return point

def crear_logro(db: Session, name: str, description: str = None):
    achievement = models.Achievement(name=name, description=description)
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement
