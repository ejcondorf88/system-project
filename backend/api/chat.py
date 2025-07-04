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
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
vstore = PineconeVectorStore.from_existing_index(INDEX_NAME, embeddings)
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
        # Buscar documentos relevantes en Pinecone
        docs = vstore.similarity_search(message.message, k=3)
        
        # Generar respuesta usando la IA
        ai_response = chain.invoke({"question": message.message, "docs": docs})
        
        # Crear respuesta
        response = ChatResponse(
            message=ai_response.content,
            timestamp=datetime.now().isoformat(),
            message_id=f"msg_{len(chat_history) + 1}"
        )
        
        # Guardar en historial
        chat_history.append({
            "user_message": message.message,
            "bot_response": ai_response.content,
            "timestamp": response.timestamp
        })
        
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