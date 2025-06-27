from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[int] = None
    timestamp: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    message_id: str

# Simulación de historial de chat (en producción usar base de datos)
chat_history = []

@router.post("/send", response_model=ChatResponse)
async def send_message(message: ChatMessage):
    """
    Envía un mensaje y recibe una respuesta
    """
    try:
        # Aquí iría la lógica de procesamiento del mensaje
        # Por ahora, simulamos una respuesta simple
        
        response_text = f"Recibí tu mensaje: {message.message}"
        
        # Crear respuesta
        response = ChatResponse(
            response=response_text,
            timestamp="2024-01-01T12:00:00Z",
            message_id="msg_123"
        )
        
        # Guardar en historial
        chat_history.append({
            "user_message": message.message,
            "bot_response": response_text,
            "timestamp": response.timestamp
        })
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[dict])
async def get_chat_history():
    """
    Obtiene el historial de chat
    """
    return chat_history

@router.delete("/clear")
async def clear_chat_history():
    """
    Limpia el historial de chat
    """
    global chat_history
    chat_history.clear()
    return {"message": "Historial de chat limpiado"} 