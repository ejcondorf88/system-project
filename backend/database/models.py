from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String, nullable=True)  # Campo celular
    level = Column(String, default="Bronce")  # Nivel del usuario
    points = Column(Integer, default=0)  # Puntos acumulados
    benefits = Column(Integer, default=0)  # Beneficios activos
    achievements = Column(String, default="[]")  # Logros como JSON string
    creacion = Column(DateTime(timezone=True), server_default=func.now())
    estado = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)  # Nuevo campo para superusuario 