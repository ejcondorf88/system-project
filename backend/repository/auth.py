from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext
from database.models import User
from schemas.user import UserCreate
from core.security import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "tu_clave_secreta_aqui"  # En producción, usar una clave segura
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def auth_user(db: Session, username: str, password: str) -> Optional[User]:
    print(f"=== INICIO DEL PROCESO DE AUTENTICACIÓN ===")
    print(f"1. Buscando usuario: {username}")
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        print("❌ Usuario no encontrado")
        return None
    
    print("2. Usuario encontrado, verificando contraseña")
    if not verify_password(password, user.password):
        print("❌ Contraseña incorrecta")
        return None
    
    print("3. Autenticación exitosa")
    print("=== FIN DEL PROCESO DE AUTENTICACIÓN ===")
    return user

def register_user(db: Session, user: UserCreate):
    print(f"=== INICIO DEL PROCESO DE REGISTRO ===")
    print(f"1. Verificando usuario existente: {user.username}")
    
    # Verificar si el usuario ya existe
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        print("❌ Usuario ya existe")
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario o correo ya está registrado"
        )
    
    print("2. Creando nuevo usuario")
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    
    print("3. Guardando usuario en la base de datos")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    print("4. Registro exitoso")
    print("=== FIN DEL PROCESO DE REGISTRO ===")
    return db_user