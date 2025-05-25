from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(title="MF-Lifting API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserRegister):
    try:
        # Aquí iría la lógica de registro en la base de datos
        print(f"Registrando usuario: {user.username} con email: {user.email}")
        
        # Simulación de respuesta exitosa
        return {
            "id": 1,
            "username": user.username,
            "email": user.email
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 