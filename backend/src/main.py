
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth
from .api import chat
from .config.settings import settings
from .database.database import engine
from .database.models import Base

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")