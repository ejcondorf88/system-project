from sqlalchemy.orm import Session
from database import models
from schemas.audit import AuditLogCreate
from typing import Optional, Any
import json
from datetime import datetime

class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        table_name: str,
        record_id: int,
        action: str,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        field_name: Optional[str] = None,
        old_value: Optional[Any] = None,
        new_value: Optional[Any] = None,
        additional_data: Optional[dict] = None
    ):
        """
        Registra una acción en el log de auditoría
        """
        try:
            # Convertir valores a string para almacenamiento
            old_value_str = json.dumps(old_value) if old_value is not None else None
            new_value_str = json.dumps(new_value) if new_value is not None else None
            
            audit_log = models.AuditLog(
                table_name=table_name,
                record_id=record_id,
                action=action,
                field_name=field_name,
                old_value=old_value_str,
                new_value=new_value_str,
                user_id=user_id,
                ip_address=ip_address,
                user_agent=user_agent
            )
            
            db.add(audit_log)
            db.commit()
            db.refresh(audit_log)
            
            return audit_log
        except Exception as e:
            print(f"Error al registrar auditoría: {e}")
            db.rollback()
            return None

    @staticmethod
    def log_create(
        db: Session,
        table_name: str,
        record_id: int,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ):
        """
        Registra la creación de un registro
        """
        return AuditService.log_action(
            db=db,
            table_name=table_name,
            record_id=record_id,
            action="CREATE",
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent
        )

    @staticmethod
    def log_update(
        db: Session,
        table_name: str,
        record_id: int,
        field_name: str,
        old_value: Any,
        new_value: Any,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ):
        """
        Registra la actualización de un campo
        """
        return AuditService.log_action(
            db=db,
            table_name=table_name,
            record_id=record_id,
            action="UPDATE",
            field_name=field_name,
            old_value=old_value,
            new_value=new_value,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent
        )

    @staticmethod
    def log_delete(
        db: Session,
        table_name: str,
        record_id: int,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ):
        """
        Registra la eliminación de un registro
        """
        return AuditService.log_action(
            db=db,
            table_name=table_name,
            record_id=record_id,
            action="DELETE",
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent
        )

    @staticmethod
    def get_audit_logs(
        db: Session,
        table_name: Optional[str] = None,
        action: Optional[str] = None,
        user_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0
    ):
        """
        Obtiene logs de auditoría con filtros
        """
        query = db.query(models.AuditLog)
        
        if table_name:
            query = query.filter(models.AuditLog.table_name == table_name)
        
        if action:
            query = query.filter(models.AuditLog.action == action)
        
        if user_id:
            query = query.filter(models.AuditLog.user_id == user_id)
        
        if start_date:
            query = query.filter(models.AuditLog.created_at >= start_date)
        
        if end_date:
            query = query.filter(models.AuditLog.created_at <= end_date)
        
        return query.order_by(models.AuditLog.created_at.desc()).offset(offset).limit(limit).all()

    @staticmethod
    def get_audit_summary(db: Session):
        """
        Obtiene un resumen de la actividad de auditoría
        """
        total_records = db.query(models.AuditLog).count()
        create_count = db.query(models.AuditLog).filter(models.AuditLog.action == "CREATE").count()
        update_count = db.query(models.AuditLog).filter(models.AuditLog.action == "UPDATE").count()
        delete_count = db.query(models.AuditLog).filter(models.AuditLog.action == "DELETE").count()
        
        # Usuario más activo
        most_active_user = db.query(
            models.User.username,
            db.func.count(models.AuditLog.id).label('action_count')
        ).join(models.AuditLog, models.User.id == models.AuditLog.user_id)\
         .group_by(models.User.id, models.User.username)\
         .order_by(db.func.count(models.AuditLog.id).desc())\
         .first()
        
        # Tabla más modificada
        most_modified_table = db.query(
            models.AuditLog.table_name,
            db.func.count(models.AuditLog.id).label('action_count')
        ).group_by(models.AuditLog.table_name)\
         .order_by(db.func.count(models.AuditLog.id).desc())\
         .first()
        
        # Actividad reciente
        recent_activity = db.query(models.AuditLog)\
            .order_by(models.AuditLog.created_at.desc())\
            .limit(10)\
            .all()
        
        return {
            "total_records": total_records,
            "create_count": create_count,
            "update_count": update_count,
            "delete_count": delete_count,
            "most_active_user": most_active_user[0] if most_active_user else None,
            "most_modified_table": most_modified_table[0] if most_modified_table else None,
            "recent_activity": recent_activity
        } 