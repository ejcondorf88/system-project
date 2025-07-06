import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableMap
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
import json
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

router = APIRouter(prefix="/chat", tags=["Chat"])

# Configuración de IA
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "chatbot"

# Inicializar componentes de IA
def initialize_ai_components():
    """Inicializa los componentes de IA con manejo de errores"""
    try:
        if not OPENAI_API_KEY or OPENAI_API_KEY == "tu_clave_de_openai_aqui":
            print("⚠️  OpenAI API Key no configurada")
            return None, None, None
        
        if not PINECONE_API_KEY:
            print("⚠️  Pinecone API Key no configurada")
            return None, None, None
        
        # Inicializar embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
        
        # Inicializar Pinecone
        vstore = PineconeVectorStore.from_existing_index(INDEX_NAME, embeddings)
        
        # Inicializar OpenAI
        llm = ChatOpenAI(model_name='gpt-3.5-turbo', temperature=0)
        
        # Crear Prompt y Pipeline
        prompt = ChatPromptTemplate.from_template(
            "Eres un asistente experto en rutinas de ejercicio y fitness. Responde la siguiente pregunta utilizando los documentos como contexto:\n\n{context}\n\nPregunta: {question}\n\nResponde de manera clara, útil y motivadora."
        )
        
        chain = (
            RunnableMap({
                "context": lambda x: "\n\n".join([doc.page_content for doc in x["docs"]]),
                "question": lambda x: x["question"]
            })
            | prompt
            | llm
        )
        
        print("✅ Componentes de IA inicializados correctamente")
        return embeddings, vstore, chain
        
    except Exception as e:
        print(f"❌ Error al inicializar componentes de IA: {e}")
        return None, None, None

# Inicializar componentes
embeddings, vstore, chain = initialize_ai_components()

def get_ai_response_with_apis(message: str) -> str:
    """Genera respuesta usando las APIs de OpenAI y Pinecone"""
    try:
        if not chain or not vstore:
            return get_fallback_response(message)
        
        # Buscar documentos relevantes en Pinecone
        docs = vstore.similarity_search(message, k=3)
        
        # Generar respuesta usando OpenAI
        ai_response = chain.invoke({"question": message, "docs": docs})
        
        return ai_response.content
        
    except Exception as e:
        print(f"Error al usar APIs de IA: {e}")
        return get_fallback_response(message)

def get_fallback_response(message: str) -> str:
    """Respuesta de fallback cuando las APIs no están disponibles"""
    message_lower = message.lower()
    
    if "hola" in message_lower or "buenos días" in message_lower or "buenas" in message_lower:
        return "¡Hola! Soy tu asistente de fitness. ¿En qué puedo ayudarte hoy? ¿Te gustaría que te ayude con una rutina de ejercicios?"
    
    elif "rutina" in message_lower or "ejercicio" in message_lower or "entrenamiento" in message_lower:
        return "¡Perfecto! Te ayudo con tu rutina de ejercicios. ¿Qué parte del cuerpo te gustaría trabajar hoy? Puedo recomendarte ejercicios para tren superior, inferior, cardio o fuerza."
    
    elif "cardio" in message_lower or "correr" in message_lower or "bicicleta" in message_lower:
        return "¡Excelente elección! Para cardio te recomiendo: 1) 20 minutos de trote suave, 2) 15 minutos de bicicleta estática, 3) 10 minutos de saltos con cuerda. ¿Te gustaría que te guíe durante el entrenamiento?"
    
    elif "fuerza" in message_lower or "pesas" in message_lower or "musculación" in message_lower:
        return "¡Genial! Para entrenamiento de fuerza te sugiero: 1) Press de banca 3x10, 2) Sentadillas 3x12, 3) Peso muerto 3x8. Recuerda calentar bien antes de empezar."
    
    elif "dieta" in message_lower or "nutrición" in message_lower or "alimentación" in message_lower:
        return "La nutrición es clave para tus resultados. Te recomiendo: proteínas magras, carbohidratos complejos, grasas saludables y mucha agua. ¿Quieres que te ayude con un plan de alimentación?"
    
    elif "gracias" in message_lower or "thanks" in message_lower:
        return "¡De nada! Estoy aquí para ayudarte a alcanzar tus objetivos de fitness. ¡Sigue así!"
    
    else:
        return "Entiendo tu mensaje. Como tu asistente de fitness, puedo ayudarte con rutinas de ejercicios, consejos de nutrición, y motivación. ¿Qué te gustaría saber específicamente?"

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[int] = None
    timestamp: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    timestamp: str
    message_id: str

# Simulación de historial de chat (en producción usar base de datos)
chat_history = []

@router.post("/send", response_model=ChatResponse)
async def send_message(message: ChatMessage):
    """
    Envía un mensaje y recibe una respuesta de IA
    """
    try:
        print(f"=== MENSAJE RECIBIDO ===")
        print(f"Usuario ID: {message.user_id}")
        print(f"Mensaje: {message.message}")
        print(f"Timestamp: {message.timestamp}")
        
        # Generar respuesta usando las APIs de IA
        ai_response_text = get_ai_response_with_apis(message.message)
        
        # Crear respuesta
        response = ChatResponse(
            message=ai_response_text,
            timestamp=datetime.now().isoformat(),
            message_id=f"msg_{len(chat_history) + 1}"
        )
        
        # Guardar en historial
        chat_history.append({
            "user_message": message.message,
            "bot_response": ai_response_text,
            "timestamp": response.timestamp
        })
        
        print(f"=== RESPUESTA GENERADA ===")
        print(f"Respuesta: {ai_response_text}")
        print(f"Message ID: {response.message_id}")
        
        return response
        
    except Exception as e:
        print(f"Error en chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al procesar mensaje: {str(e)}")

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