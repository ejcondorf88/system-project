import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import Base, engine
from routes import auth, user
from api import chat
from config.settings import settings


# Crear las tablas en la base de datos
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente")
except Exception as e:
    print(f"❌ Error al crear las tablas: {e}")
    print("Verifica las credenciales de la base de datos en config/settings.py")

app = FastAPI(title="API de Gestión de Tareas")

# Configuración de CORS
origins = settings.ALLOWED_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/users", tags=["users"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Gestión de Tareas"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)