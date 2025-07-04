import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Configuración de la base de datos
    DATABASE_URL: str = "postgresql://postgres.ooxpguxxhembfoefgrfv:Pigo0173!@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
    
    # Configuración JWT
    SECRET_KEY: str = "tu_clave_secreta_aqui"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Configuración de CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings() 