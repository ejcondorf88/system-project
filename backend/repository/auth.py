from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext
from db.models import User
from schemas.user import UserCreate
from tokenJWT import create_access_token
from db.models import User
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "tu_clave_secreta_aqui"  # En producción, usar una clave segura
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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
    # Verificar si el usuario ya existe
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario o correo ya está registrado"
        )

    # Crear nuevo usuario
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')  # Hashear la contraseña
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user    # Verificar si el usuario ya existe
    existing_user = db.query(UserModel).filter(
        (UserModel.username == user.username) | (UserModel.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="El nombre de usuario o correo ya está registrado"
        )

    # Crear nuevo usuario
    db_user = UserModel(
        username=user.username,
        email=user.email,
        password=user.password  # Aplica hash aquí, ej: bcrypt.hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
    print(f"=== INICIO DEL PROCESO DE REGISTRO ===")
    print(f"1. Verificando usuario existente: {user_data.username}")
    
    # Verificar si el usuario ya existe
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        print("❌ Usuario ya existe")
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    
    print("2. Verificando email existente")
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        print("❌ Email ya registrado")
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    print("3. Creando nuevo usuario")
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password,
        nombre=user_data.nombre,
        apellido=user_data.apellido,
        direccion=user_data.direccion,
        telefono=user_data.telefono,
        creacion=datetime.now(),
        estado=True
    )
    
    print("4. Guardando usuario en la base de datos")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    print("5. Registro exitoso")
    print("=== FIN DEL PROCESO DE REGISTRO ===")
    return db_user