from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from db.database import Base

class User(Base):
    __tablename__ = "users1"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    nombre = Column(String)
    apellido = Column(String)
    direccion = Column(String, nullable=True)
    telefono = Column(Integer)
    creacion = Column(DateTime(timezone=True), server_default=func.now())
    estado = Column(Boolean, default=True)

