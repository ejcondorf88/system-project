from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.audit import AuditLogResponse, AuditLogFilter, AuditSummary
from services.audit_service import AuditService
from core.security import get_current_user
from database.models import User
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    table_name: Optional[str] = Query(None, description="Filtrar por tabla"),
    action: Optional[str] = Query(None, description="Filtrar por acción (CREATE, UPDATE, DELETE)"),
    user_id: Optional[int] = Query(None, description="Filtrar por usuario"),
    start_date: Optional[datetime] = Query(None, description="Fecha de inicio"),
    end_date: Optional[datetime] = Query(None, description="Fecha de fin"),
    limit: int = Query(100, description="Límite de registros"),
    offset: int = Query(0, description="Offset para paginación"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene logs de auditoría con filtros opcionales
    """
    # Verificar permisos (solo superusuarios y administradores)
    if not current_user.is_superuser and current_user.role_id != 1:  # Asumiendo que 1 es admin
        raise HTTPException(status_code=403, detail="No tienes permisos para ver logs de auditoría")
    
    logs = AuditService.get_audit_logs(
        db=db,
        table_name=table_name,
        action=action,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        offset=offset
    )
    
    return logs

@router.get("/summary", response_model=AuditSummary)
async def get_audit_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene un resumen de la actividad de auditoría
    """
    # Verificar permisos
    if not current_user.is_superuser and current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para ver resumen de auditoría")
    
    summary = AuditService.get_audit_summary(db=db)
    return summary

@router.get("/logs/user/{user_id}", response_model=List[AuditLogResponse])
async def get_user_audit_logs(
    user_id: int,
    limit: int = Query(100, description="Límite de registros"),
    offset: int = Query(0, description="Offset para paginación"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene logs de auditoría de un usuario específico
    """
    # Verificar permisos
    if not current_user.is_superuser and current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para ver logs de auditoría")
    
    logs = AuditService.get_audit_logs(
        db=db,
        user_id=user_id,
        limit=limit,
        offset=offset
    )
    
    return logs

@router.get("/logs/table/{table_name}", response_model=List[AuditLogResponse])
async def get_table_audit_logs(
    table_name: str,
    limit: int = Query(100, description="Límite de registros"),
    offset: int = Query(0, description="Offset para paginación"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene logs de auditoría de una tabla específica
    """
    # Verificar permisos
    if not current_user.is_superuser and current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="No tienes permisos para ver logs de auditoría")
    
    logs = AuditService.get_audit_logs(
        db=db,
        table_name=table_name,
        limit=limit,
        offset=offset
    )
    
    return logs 