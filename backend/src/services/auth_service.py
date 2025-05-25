from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..repositories.user_repository import UserRepository
from ..schemas.user import UserCreate, UserLogin
from ..core.security import verify_password, create_access_token
from datetime import timedelta
from ..config.settings import settings

class AuthService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def register(self, user_data: UserCreate):
        # Verificar si el usuario ya existe
        if self.user_repository.get_by_username(user_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya está registrado"
            )
        
        if self.user_repository.get_by_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Verificar que las contraseñas coincidan
        if user_data.password != user_data.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Las contraseñas no coinciden"
            )
        
        # Crear el usuario
        user = self.user_repository.create(user_data)
        return user

    def login(self, user_data: UserLogin):
        user = self.user_repository.get_by_username(user_data.username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        if not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas"
            )
        
        # Crear token de acceso
        access_token = create_access_token(
            data={"sub": user.username},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        } 