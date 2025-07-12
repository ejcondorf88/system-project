from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from database import models
from core.security import get_current_user
from database.models import User
from datetime import datetime, timedelta

router = APIRouter(
    tags=["Dashboard"]
)

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener estadísticas del dashboard"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede ver estadísticas.")
    
    try:
        # Estadísticas de usuarios
        total_users = db.query(models.User).count()
        active_users = db.query(models.User).filter(models.User.estado == True).count()
        
        # Estadísticas de membresías
        total_memberships = db.query(models.UserMembership).count()
        active_memberships = db.query(models.UserMembership).filter(
            models.UserMembership.end_date > datetime.now()
        ).count()
        
        # Estadísticas de rutinas
        total_routines = db.query(models.Routine).count()
        completed_routines = db.query(models.UserRoutine).filter(
            models.UserRoutine.completed_at.isnot(None)
        ).count()
        
        # Estadísticas de puntos
        total_points = db.query(func.sum(models.User.points)).scalar() or 0
        average_points = total_points / total_users if total_users > 0 else 0
        
        # Distribución de niveles
        level_distribution = db.query(
            models.User.level,
            func.count(models.User.id)
        ).group_by(models.User.level).all()
        
        bronce_count = next((count for level, count in level_distribution if level == "Bronce"), 0)
        plata_count = next((count for level, count in level_distribution if level == "Plata"), 0)
        oro_count = next((count for level, count in level_distribution if level == "Oro"), 0)
        
        # Actividad reciente (últimos puntos asignados)
        recent_points = db.query(models.Point).order_by(
            models.Point.created_at.desc()
        ).limit(5).all()
        
        recent_activity = []
        for point in recent_points:
            user = db.query(models.User).filter(models.User.id == point.user_id).first()
            if user:
                recent_activity.append({
                    "id": point.id,
                    "type": "points",
                    "description": f"{user.username} recibió {point.amount} puntos por {point.reason}",
                    "timestamp": point.created_at.isoformat()
                })
        
        return {
            "totalUsers": total_users,
            "activeUsers": active_users,
            "totalMemberships": total_memberships,
            "activeMemberships": active_memberships,
            "totalRoutines": total_routines,
            "completedRoutines": completed_routines,
            "totalPoints": total_points,
            "averagePointsPerUser": round(average_points, 1),
            "levelDistribution": {
                "bronce": bronce_count,
                "plata": plata_count,
                "oro": oro_count
            },
            "recentActivity": recent_activity
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener estadísticas: {str(e)}"
        )

@router.get("/memberships")
def get_memberships(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener todas las membresías"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede ver membresías.")
    
    memberships = db.query(models.Membership).all()
    return memberships

@router.get("/user-memberships")
def get_user_memberships(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener membresías de usuarios con información relacionada"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede ver membresías de usuarios.")
    
    user_memberships = db.query(models.UserMembership).all()
    
    # Enriquecer con información de usuario y membresía
    result = []
    for um in user_memberships:
        user = db.query(models.User).filter(models.User.id == um.user_id).first()
        membership = db.query(models.Membership).filter(models.Membership.id == um.membership_id).first()
        
        if user and membership:
            result.append({
                "id": um.id,
                "user_id": um.user_id,
                "membership_id": um.membership_id,
                "start_date": um.start_date.isoformat() if um.start_date else None,
                "end_date": um.end_date.isoformat() if um.end_date else None,
                "user": {
                    "username": user.username,
                    "email": user.email
                },
                "membership": {
                    "name": membership.name,
                    "price": float(membership.price) if membership.price else 0
                }
            })
    
    return result

@router.get("/routines")
def get_routines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener todas las rutinas"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede ver rutinas.")
    
    routines = db.query(models.Routine).all()
    return routines

@router.get("/user-routines")
def get_user_routines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener rutinas de usuarios con información relacionada"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo el superusuario puede ver rutinas de usuarios.")
    
    user_routines = db.query(models.UserRoutine).all()
    
    # Enriquecer con información de usuario y rutina
    result = []
    for ur in user_routines:
        user = db.query(models.User).filter(models.User.id == ur.user_id).first()
        routine = db.query(models.Routine).filter(models.Routine.id == ur.routine_id).first()
        
        if user and routine:
            result.append({
                "id": ur.id,
                "user_id": ur.user_id,
                "routine_id": ur.routine_id,
                "assigned_at": ur.assigned_at.isoformat() if ur.assigned_at else None,
                "completed_at": ur.completed_at.isoformat() if ur.completed_at else None,
                "user": {
                    "username": user.username,
                    "email": user.email
                },
                "routine": {
                    "name": routine.name,
                    "focus": routine.focus,
                    "level": routine.level
                }
            })
    
    return result 