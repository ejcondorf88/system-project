from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogBase(BaseModel):
    table_name: str
    record_id: int
    action: str  # CREATE, UPDATE, DELETE
    field_name: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    user_id: Optional[int] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuditLogFilter(BaseModel):
    table_name: Optional[str] = None
    action: Optional[str] = None
    user_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 100
    offset: int = 0

class AuditSummary(BaseModel):
    total_records: int
    create_count: int
    update_count: int
    delete_count: int
    most_active_user: Optional[str] = None
    most_modified_table: Optional[str] = None
    recent_activity: list[AuditLogResponse] 