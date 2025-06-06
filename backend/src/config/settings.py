from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/auth_db"
    
    # JWT
    SECRET_KEY: str = "tu_clave_secreta_muy_segura"  # En producción, usar una clave segura
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173"]  # URL del frontend
    
    class Config:
        env_file = ".env"

settings = Settings() 