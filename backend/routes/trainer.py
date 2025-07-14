from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from database import models
from core.security import get_current_user
from database.models import User
from datetime import datetime
from typing import List
from schemas.user import RoutineCreate, UserRoutineCreate
from schemas.chat import ChatMessageResponse
from services.audit_service import AuditService

router = APIRouter(
    tags=["Trainer"]
)

def check_trainer_permissions(current_user: User):
    """Verificar que el usuario es entrenador o superusuario"""
    if not current_user.is_superuser and not current_user.is_trainer:
        raise HTTPException(
            status_code=403, 
            detail="Solo los entrenadores pueden acceder a esta funcionalidad"
        )

@router.get("/routines")
def get_trainer_routines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener todas las rutinas (para entrenadores)"""
    check_trainer_permissions(current_user)
    
    routines = db.query(models.Routine).filter(models.Routine.status == 1).all()
    
    # Convertir a formato de respuesta
    routine_list = []
    for routine in routines:
        routine_list.append({
            "id": routine.id,
            "name": routine.name,
            "focus": routine.focus,
            "level": routine.level,
            "description": routine.description,
            "status": routine.status,
            "created_at": routine.created_at.isoformat() if routine.created_at else None,
            "updated_at": routine.updated_at.isoformat() if routine.updated_at else None
        })
    
    return routine_list

@router.post("/routines")
def create_routine(
    routine: RoutineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nueva rutina (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    from repository import user as user_repository
    
    new_routine = user_repository.crear_rutina(
        db, 
        name=routine.name, 
        focus=routine.focus, 
        level=routine.level, 
        description=routine.description
    )
    
    # Auditoría
    AuditService.log_create(
        db=db,
        table_name="routines",
        record_id=new_routine.id,
        user_id=current_user.id,
        ip_address=None,
        user_agent=None
    )
    
    return {
        "id": new_routine.id,
        "name": new_routine.name,
        "focus": new_routine.focus,
        "level": new_routine.level,
        "description": new_routine.description,
        "status": new_routine.status,
        "created_at": new_routine.created_at.isoformat() if new_routine.created_at else None,
        "updated_at": new_routine.updated_at.isoformat() if new_routine.updated_at else None
    }

@router.put("/routines/{routine_id}")
def update_routine(
    routine_id: int,
    routine_update: RoutineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Actualizar rutina existente (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    routine = db.query(models.Routine).filter(models.Routine.id == routine_id).first()
    if not routine:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    
    # Auditoría: guardar valores antiguos
    old_values = {
        "name": routine.name,
        "focus": routine.focus,
        "level": routine.level,
        "description": routine.description
    }
    
    routine.name = routine_update.name
    routine.focus = routine_update.focus
    routine.level = routine_update.level
    routine.description = routine_update.description
    
    db.commit()
    db.refresh(routine)
    
    # Auditoría: registrar cambios campo por campo
    for key, old_value in old_values.items():
        new_value = getattr(routine, key)
        if old_value != new_value:
            AuditService.log_update(
                db=db,
                table_name="routines",
                record_id=routine.id,
                field_name=key,
                old_value=old_value,
                new_value=new_value,
                user_id=current_user.id,
                ip_address=None,
                user_agent=None
            )
    
    return {
        "id": routine.id,
        "name": routine.name,
        "focus": routine.focus,
        "level": routine.level,
        "description": routine.description,
        "status": routine.status,
        "created_at": routine.created_at.isoformat() if routine.created_at else None,
        "updated_at": routine.updated_at.isoformat() if routine.updated_at else None
    }

@router.delete("/routines/{routine_id}")
def delete_routine(
    routine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Eliminar rutina (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    routine = db.query(models.Routine).filter(models.Routine.id == routine_id).first()
    if not routine:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    
    # Soft delete - cambiar status a 0
    routine.status = 0
    db.commit()
    
    # Auditoría
    AuditService.log_delete(
        db=db,
        table_name="routines",
        record_id=routine_id,
        user_id=current_user.id,
        ip_address=None,
        user_agent=None
    )
    
    return {"message": "Rutina eliminada exitosamente"}

@router.get("/users")
def get_trainer_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener usuarios para asignar rutinas (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    # Obtener usuarios que no son entrenadores
    users = db.query(models.User).filter(
        models.User.estado == True,
        models.User.is_trainer == False
    ).all()
    
    # Convertir a formato de respuesta
    user_list = []
    for user in users:
        user_list.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "level": user.level,
            "points": user.points,
            "is_trainer": user.is_trainer,
            "is_superuser": user.is_superuser
        })
    
    return user_list

@router.post("/assign-routine")
def assign_routine_to_user(
    user_routine: UserRoutineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Asignar rutina a usuario (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    # Verificar que el usuario existe
    user = db.query(models.User).filter(models.User.id == user_routine.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar que la rutina existe
    routine = db.query(models.Routine).filter(models.Routine.id == user_routine.routine_id).first()
    if not routine:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    
    # Crear la asignación
    new_user_routine = models.UserRoutine(
        user_id=user_routine.user_id,
        routine_id=user_routine.routine_id,
        assigned_at=datetime.now()
    )
    
    db.add(new_user_routine)
    db.commit()
    db.refresh(new_user_routine)
    
    # Auditoría
    AuditService.log_create(
        db=db,
        table_name="user_routines",
        record_id=new_user_routine.id,
        user_id=current_user.id,
        ip_address=None,
        user_agent=None
    )
    
    return {
        "id": new_user_routine.id,
        "user_id": new_user_routine.user_id,
        "routine_id": new_user_routine.routine_id,
        "assigned_at": new_user_routine.assigned_at.isoformat() if new_user_routine.assigned_at else None,
        "completed_at": new_user_routine.completed_at.isoformat() if new_user_routine.completed_at else None,
        "status": new_user_routine.status,
        "created_at": new_user_routine.created_at.isoformat() if new_user_routine.created_at else None,
        "updated_at": new_user_routine.updated_at.isoformat() if new_user_routine.updated_at else None,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "level": user.level,
            "points": user.points,
            "is_trainer": user.is_trainer,
            "is_superuser": user.is_superuser
        },
        "routine": {
            "id": routine.id,
            "name": routine.name,
            "focus": routine.focus,
            "level": routine.level,
            "description": routine.description,
            "status": routine.status,
            "created_at": routine.created_at.isoformat() if routine.created_at else None,
            "updated_at": routine.updated_at.isoformat() if routine.updated_at else None
        }
    }

@router.get("/user-routines")
def get_trainer_user_routines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener rutinas asignadas por el entrenador"""
    check_trainer_permissions(current_user)
    
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
                "status": ur.status,
                "created_at": ur.created_at.isoformat() if ur.created_at else None,
                "updated_at": ur.updated_at.isoformat() if ur.updated_at else None,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "level": user.level,
                    "points": user.points,
                    "is_trainer": user.is_trainer,
                    "is_superuser": user.is_superuser
                },
                "routine": {
                    "id": routine.id,
                    "name": routine.name,
                    "focus": routine.focus,
                    "level": routine.level,
                    "description": routine.description,
                    "status": routine.status,
                    "created_at": routine.created_at.isoformat() if routine.created_at else None,
                    "updated_at": routine.updated_at.isoformat() if routine.updated_at else None
                }
            })
    
    return result

@router.put("/user-routines/{user_routine_id}/complete")
def mark_routine_completed(
    user_routine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Marcar rutina como completada (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    user_routine = db.query(models.UserRoutine).filter(models.UserRoutine.id == user_routine_id).first()
    if not user_routine:
        raise HTTPException(status_code=404, detail="Asignación de rutina no encontrada")
    
    user_routine.completed_at = datetime.now()
    user_routine.status = 0  # Marcar como completada
    db.commit()
    db.refresh(user_routine)
    
    # Obtener información del usuario y rutina
    user = db.query(models.User).filter(models.User.id == user_routine.user_id).first()
    routine = db.query(models.Routine).filter(models.Routine.id == user_routine.routine_id).first()
    
    return {
        "id": user_routine.id,
        "user_id": user_routine.user_id,
        "routine_id": user_routine.routine_id,
        "assigned_at": user_routine.assigned_at.isoformat() if user_routine.assigned_at else None,
        "completed_at": user_routine.completed_at.isoformat() if user_routine.completed_at else None,
        "status": user_routine.status,
        "created_at": user_routine.created_at.isoformat() if user_routine.created_at else None,
        "updated_at": user_routine.updated_at.isoformat() if user_routine.updated_at else None,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "level": user.level,
            "points": user.points,
            "is_trainer": user.is_trainer,
            "is_superuser": user.is_superuser
        },
        "routine": {
            "id": routine.id,
            "name": routine.name,
            "focus": routine.focus,
            "level": routine.level,
            "description": routine.description,
            "status": routine.status,
            "created_at": routine.created_at.isoformat() if routine.created_at else None,
            "updated_at": routine.updated_at.isoformat() if routine.updated_at else None
        }
    }

@router.delete("/user-routines/{user_routine_id}")
def remove_user_routine(
    user_routine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remover rutina asignada a usuario (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    user_routine = db.query(models.UserRoutine).filter(models.UserRoutine.id == user_routine_id).first()
    if not user_routine:
        raise HTTPException(status_code=404, detail="Asignación de rutina no encontrada")
    
    db.delete(user_routine)
    db.commit()
    
    # Auditoría
    AuditService.log_delete(
        db=db,
        table_name="user_routines",
        record_id=user_routine_id,
        user_id=current_user.id,
        ip_address=None,
        user_agent=None
    )
    
    return {"message": "Rutina removida del usuario exitosamente"}

@router.get("/stats")
def get_trainer_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener estadísticas del entrenador"""
    check_trainer_permissions(current_user)
    
    total_routines = db.query(models.Routine).count()
    total_assignments = db.query(models.UserRoutine).count()
    completed_routines = db.query(models.UserRoutine).filter(
        models.UserRoutine.completed_at.isnot(None)
    ).count()
    pending_routines = total_assignments - completed_routines
    
    # Usuarios con rutinas asignadas
    users_with_routines = db.query(models.UserRoutine.user_id).distinct().count()
    
    # Estadísticas adicionales de chat
    total_users_with_chat = db.query(models.ChatMessage.user_id).distinct().count()
    total_chat_messages = db.query(models.ChatMessage).count()
    
    # Mensajes relacionados con rutinas
    routine_keywords = ['rutina', 'ejercicio', 'entrenamiento', 'fuerza', 'cardio', 'pesas', 'gimnasio']
    routine_related_messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.content.ilike('%' + '%'.join(routine_keywords) + '%')
    ).count()
    
    return {
        "total_routines": total_routines,
        "total_assignments": total_assignments,
        "completed_routines": completed_routines,
        "pending_routines": pending_routines,
        "users_with_routines": users_with_routines,
        "completion_rate": round((completed_routines / total_assignments * 100), 1) if total_assignments > 0 else 0,
        "total_users_with_chat": total_users_with_chat,
        "total_chat_messages": total_chat_messages,
        "routine_related_messages": routine_related_messages
    }

# Nuevos endpoints para historial de chat de usuarios
@router.get("/users/{user_id}/chat-history")
def get_user_chat_history(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 100
):
    """Obtener historial de chat de un usuario específico (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    # Verificar que el usuario existe
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener mensajes del usuario
    messages = db.query(models.ChatMessage)\
        .filter(models.ChatMessage.user_id == user_id)\
        .order_by(models.ChatMessage.timestamp.desc())\
        .limit(limit)\
        .all()
    
    # Convertir a formato de respuesta
    chat_messages = []
    for msg in messages:
        chat_messages.append(ChatMessageResponse(
            id=msg.id,
            user_id=msg.user_id,
            message_type=msg.message_type,
            content=msg.content,
            timestamp=msg.timestamp,
            session_id=msg.session_id,
            status=msg.status,
            created_at=msg.created_at,
            updated_at=msg.updated_at
        ))
    
    return chat_messages

@router.get("/users/{user_id}/chat-sessions")
def get_user_chat_sessions(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener sesiones de chat de un usuario específico (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    # Verificar que el usuario existe
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener sesiones únicas del usuario
    sessions = db.query(models.ChatMessage.session_id)\
        .filter(models.ChatMessage.user_id == user_id)\
        .distinct()\
        .all()
    
    session_list = []
    for session in sessions:
        session_id = session[0]
        if session_id:
            # Obtener mensajes de esta sesión
            session_messages = db.query(models.ChatMessage)\
                .filter(
                    models.ChatMessage.user_id == user_id,
                    models.ChatMessage.session_id == session_id
                )\
                .order_by(models.ChatMessage.timestamp.asc())\
                .all()
            
            if session_messages:
                # Filtrar mensajes relacionados con rutinas
                routine_keywords = ['rutina', 'ejercicio', 'entrenamiento', 'fuerza', 'cardio', 'pesas', 'gimnasio']
                has_routine_content = any(
                    any(keyword in msg.content.lower() for keyword in routine_keywords)
                    for msg in session_messages
                )
                
                session_list.append({
                    "session_id": session_id,
                    "message_count": len(session_messages),
                    "first_message": session_messages[0].content[:50] + "..." if len(session_messages[0].content) > 50 else session_messages[0].content,
                    "last_message_time": session_messages[-1].timestamp.isoformat(),
                    "created_at": session_messages[0].timestamp.isoformat(),
                    "has_routine_content": has_routine_content
                })
    
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "level": user.level
        },
        "sessions": session_list
    }

@router.get("/users/{user_id}/chat-sessions/{session_id}")
def get_user_chat_session_detail(
    user_id: int,
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener detalles de una sesión específica de chat (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    # Verificar que el usuario existe
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener mensajes de la sesión específica
    session_messages = db.query(models.ChatMessage)\
        .filter(
            models.ChatMessage.user_id == user_id,
            models.ChatMessage.session_id == session_id
        )\
        .order_by(models.ChatMessage.timestamp.asc())\
        .all()
    
    if not session_messages:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    
    # Convertir a formato de respuesta
    messages = []
    for msg in session_messages:
        messages.append(ChatMessageResponse(
            id=msg.id,
            user_id=msg.user_id,
            message_type=msg.message_type,
            content=msg.content,
            timestamp=msg.timestamp,
            session_id=msg.session_id,
            status=msg.status,
            created_at=msg.created_at,
            updated_at=msg.updated_at
        ))
    
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "level": user.level
        },
        "session_id": session_id,
        "messages": messages,
        "total_messages": len(messages),
        "session_start": session_messages[0].timestamp.isoformat(),
        "session_end": session_messages[-1].timestamp.isoformat()
    }

@router.get("/chat-analytics")
def get_chat_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtener análisis de chat de todos los usuarios (solo entrenadores)"""
    check_trainer_permissions(current_user)
    
    # Obtener todos los usuarios con mensajes de chat
    users_with_chat = db.query(models.ChatMessage.user_id).distinct().all()
    
    analytics = []
    for user_id_tuple in users_with_chat:
        user_id = user_id_tuple[0]
        user = db.query(models.User).filter(models.User.id == user_id).first()
        
        if user:
            # Contar mensajes del usuario
            total_messages = db.query(models.ChatMessage)\
                .filter(models.ChatMessage.user_id == user_id)\
                .count()
            
            # Contar sesiones del usuario
            total_sessions = db.query(models.ChatMessage.session_id)\
                .filter(models.ChatMessage.user_id == user_id)\
                .distinct()\
                .count()
            
            # Buscar mensajes relacionados con rutinas
            routine_keywords = ['rutina', 'ejercicio', 'entrenamiento', 'fuerza', 'cardio', 'pesas', 'gimnasio']
            routine_messages = db.query(models.ChatMessage)\
                .filter(models.ChatMessage.user_id == user_id)\
                .all()
            
            routine_count = sum(
                1 for msg in routine_messages
                if any(keyword in msg.content.lower() for keyword in routine_keywords)
            )
            
            analytics.append({
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "level": user.level
                },
                "total_messages": total_messages,
                "total_sessions": total_sessions,
                "routine_related_messages": routine_count,
                "last_activity": db.query(models.ChatMessage.timestamp)\
                    .filter(models.ChatMessage.user_id == user_id)\
                    .order_by(models.ChatMessage.timestamp.desc())\
                    .first()[0].isoformat() if total_messages > 0 else None
            })
    
    return {
        "total_users_with_chat": len(analytics),
        "analytics": analytics
    } 