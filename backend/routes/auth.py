from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from schemas.user import Login, UserCreate, Token, User, UserResponse
from repository import auth
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from tokenJWT import create_access_token

router = APIRouter(
    prefix = "/auth",
    tags= ["Auth"]
)

@router.post("/login", response_model=UserResponse)
def login(username: str, password: str, db: Session = Depends(get_db)):
    print(f"\n{'='*50}")
    print("=== INICIO DEL ENDPOINT DE LOGIN ===")
    print(f"1. Datos recibidos:")
    print(f"   - Usuario: {username}")
    print(f"   - Contraseña: {'*' * len(password)}")
    
    user = auth.auth_user(db, username, password)
    if not user:
        print("❌ Autenticación fallida")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print("2. Usuario autenticado correctamente")
    print(f"   - ID: {user.id}")
    print(f"   - Username: {user.username}")
    print(f"   - Email: {user.email}")
    
    print("3. Generando token de acceso")
    access_token = create_access_token(
        data={"sub": user.username}
    )
    
    print("4. Login exitoso")
    print(f"{'='*50}\n")
    return UserResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    print(f"\n{'='*50}")
    print("=== INICIO DEL ENDPOINT DE REGISTRO ===")
    print("1. Datos recibidos:")
    print(f"   - Username: {user.username}")
    print(f"   - Email: {user.email}")
    print(f"   - Nombre: {user.nombre}")
    print(f"   - Apellido: {user.apellido}")
    print(f"   - Dirección: {user.direccion}")
    print(f"   - Teléfono: {user.telefono}")
    print(f"   - Contraseña: {'*' * len(user.password)}")
    
    try:
        print("2. Llamando a register_user")
        db_user = auth.register_user(db, user)
        
        print("3. Usuario registrado correctamente")
        print(f"   - ID: {db_user.id}")
        print(f"   - Username: {db_user.username}")
        print(f"   - Email: {db_user.email}")
        
        print("4. Generando token de acceso")
        access_token = create_access_token(
            data={"sub": user.username}
        )
        
        print("5. Preparando respuesta")
        response = UserResponse(
            access_token=access_token,
            token_type="bearer",
            user=db_user
        )
        
        print("6. Registro completado exitosamente")
        print(f"{'='*50}\n")
        return response
        
    except HTTPException as e:
        print(f"❌ Error HTTP: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )

