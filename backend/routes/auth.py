from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from schemas.user import Login, UserCreate, Token, User, UserResponse
from repository import auth
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from core.security import create_access_token, get_current_user
from fastapi import APIRouter, HTTPException, status, Depends, Response
from sqlalchemy.orm import Session
import json
import asyncio
from services.whatsapp_service import send_welcome_message
from fastapi import Request
from core.security import get_current_user
from database.models import User
from schemas.user import User as UserSchema

router = APIRouter(tags=["auth"])

@router.post("/login", response_model=UserResponse)
def login(credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"\n{'='*50}")
    print("=== INICIO DEL ENDPOINT DE LOGIN ===")
    print(f"1. Datos recibidos:")
    print(f"   - Usuario: {credentials.username}")
    print(f"   - Contraseña: {'*' * len(credentials.password)}")
    
    user = auth.auth_user(db, credentials.username, credentials.password)
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

    # --- ACTUALIZAR STATUS A 1 (ACTIVO) ---
    user.status = 1
    db.commit()
    db.refresh(user)
    # --------------------------------------
    print("3. Generando token de acceso")
    access_token = create_access_token(
        data={"sub": user.username}
    )
    print("4. Login exitoso")
    print(f"{'='*50}\n")
    # --- Asegurar achievements como string ---
    user_dict = user.__dict__.copy()
    if hasattr(user, 'achievements_json'):
        user_dict['achievements'] = user.achievements_json
    else:
        import json
        user_dict['achievements'] = json.dumps([a.name for a in getattr(user, 'achievements', [])])
    # -----------------------------------------
    return UserResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_dict
    )

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, response: Response, db: Session = Depends(get_db)):
    print(f"\n{'='*50}")
    print("=== INICIO DEL REGISTRO ===")
    print("1. Datos recibidos:")
    print(f"   - Username: {user.username}")
    print(f"   - Email: {user.email}")
    print(f"   - Phone: {user.phone if user.phone else 'No proporcionado'}")
    print(f"   - Contraseña: {'*' * len(user.password)}")
    
    if user.password != user.confirmPassword:
        print("❌ Las contraseñas no coinciden")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Las contraseñas no coinciden"
        )

    try:
        print("2. Llamando a register_user")
        db_user = auth.register_user(db, user)
        
        print("3. Usuario registrado correctamente")
        print(f"   - ID: {db_user.id}")
        print(f"   - Username: {db_user.username}")
        print(f"   - Email: {db_user.email}")
        
        print("4. Generando token de acceso")
        access_token = create_access_token(data={"sub": user.username})

        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=3600
        )

        print("5. Enviando mensaje de bienvenida por WhatsApp")
        # Enviar mensaje de bienvenida por WhatsApp de forma asíncrona
        if db_user.phone:
            try:
                # Ejecutar en un thread separado para no bloquear la respuesta
                loop = asyncio.get_event_loop()
                loop.create_task(send_welcome_message(db_user.phone, db_user.username))
                print(f"   - Mensaje de bienvenida programado para {db_user.username} ({db_user.phone})")
            except Exception as e:
                print(f"   - Error al programar mensaje de WhatsApp: {e}")
        else:
            print("   - No se envió mensaje de WhatsApp (sin número de teléfono)")

        print("6. Preparando respuesta")
        # Al preparar la respuesta, aseguramos que achievements sea un string
        user_dict = db_user.__dict__.copy() if 'db_user' in locals() else user.__dict__.copy()
        user_dict['achievements'] = user_dict.get('achievements_json', '[]')
        result = UserResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_dict
        )

        print("7. Registro completado exitosamente")
        print(f"{'='*50}\n")
        return result

    except HTTPException as e:
        print(f"❌ Error HTTP: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.post("/logout")
def logout(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        print(f"[LOGOUT] Usuario identificado: {current_user.username} (ID: {current_user.id})")
        current_user.status = 0
        db.commit()
        db.refresh(current_user)
        print(f"[LOGOUT] Status actualizado a 0 para usuario {current_user.username}")
        return {"message": "Sesión cerrada correctamente"}
    except Exception as e:
        print(f"[LOGOUT][ERROR] {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al cerrar sesión: {str(e)}")

@router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    # Asegurarse de que achievements sea string
    user_dict = current_user.__dict__.copy()
    # Si viene como lista, convertir a string
    if isinstance(user_dict.get('achievements'), list):
        user_dict['achievements'] = json.dumps(user_dict['achievements'])
    elif user_dict.get('achievements') is None:
        user_dict['achievements'] = "[]"
    return UserSchema(**user_dict)