import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from routes import auth, user


# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Gestión de Tareas")

# Configuración de CORS
origins = [
    "http://localhost:5173",  # Frontend en desarrollo
    "http://localhost:8080",  # Backend
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(auth.router, prefix="/api/auth/auth", tags=["auth"])
app.include_router(user.router, prefix="/api/users", tags=["users"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Gestión de Tareas"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)