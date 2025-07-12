from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    table_name = Column(String(100), nullable=False)  # Nombre de la tabla
    record_id = Column(Integer, nullable=False)  # ID del registro afectado
    action = Column(String(20), nullable=False)  # CREATE, UPDATE, DELETE
    field_name = Column(String(100), nullable=True)  # Campo modificado (para UPDATE)
    old_value = Column(Text, nullable=True)  # Valor anterior
    new_value = Column(Text, nullable=True)  # Valor nuevo
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Usuario que realizó la acción
    ip_address = Column(String(45), nullable=True)  # IP del usuario
    user_agent = Column(String(500), nullable=True)  # User agent del navegador
    created_at = Column(DateTime, server_default=func.now())
    
    # Relación con el usuario
    user = relationship("User", back_populates="audit_logs")

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    users = relationship("User", back_populates="role")

class Membership(Base):
    __tablename__ = "memberships"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    price = Column(Numeric)
    duration_days = Column(Integer)
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user_memberships = relationship("UserMembership", back_populates="membership")

class UserMembership(Base):
    __tablename__ = "user_memberships"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    membership_id = Column(Integer, ForeignKey("memberships.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="memberships")
    membership = relationship("Membership", back_populates="user_memberships")

class Routine(Base):
    __tablename__ = "routines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    focus = Column(String(100))
    level = Column(String(20))
    description = Column(Text)
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user_routines = relationship("UserRoutine", back_populates="routine")

class UserRoutine(Base):
    __tablename__ = "user_routines"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    routine_id = Column(Integer, ForeignKey("routines.id"))
    assigned_at = Column(DateTime)
    completed_at = Column(DateTime)
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="routines")
    routine = relationship("Routine", back_populates="user_routines")

class Point(Base):
    __tablename__ = "points"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Integer)
    reason = Column(String(255))
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="points_rel")

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    obtained_at = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message_type = Column(String(20), nullable=False)  # 'user' o 'ai'
    content = Column(Text, nullable=False)
    session_id = Column(String(100), nullable=True)  # Para agrupar conversaciones
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    timestamp = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    user = relationship("User", back_populates="chat_messages")

# Actualización del modelo User para relaciones
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    level = Column(String, default="Bronce")
    points = Column(Integer, default=0)
    benefits = Column(Integer, default=0)
    achievements_json = Column(String, default="[]")  # Para compatibilidad
    creacion = Column(DateTime(timezone=True), server_default=func.now())
    estado = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False, nullable=False)
    status = Column(Integer, default=1)  # 0 = inactivo, 1 = activo
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    role = relationship("Role", back_populates="users")
    memberships = relationship("UserMembership", back_populates="user")
    routines = relationship("UserRoutine", back_populates="user")
    points_rel = relationship("Point", back_populates="user")
    achievements = relationship("UserAchievement", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user") 