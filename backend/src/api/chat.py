import os
from fastapi import APIRouter, Request
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableMap
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from ..schemas.chat import Pregunta

# Cargar variables de entorno
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Inicializar router
router = APIRouter(prefix="/chat", tags=["chat"])

# Reutilizables
INDEX_NAME = "chatbot"
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
vstore = PineconeVectorStore.from_existing_index(INDEX_NAME, embeddings)
llm = ChatOpenAI(model_name='gpt-3.5-turbo', temperature=0)

# Crear Prompt y Pipeline
prompt = ChatPromptTemplate.from_template(
    "Responde la siguiente pregunta utilizando los documentos como contexto:\n\n{context}\n\nPregunta: {question}"
)

chain = (
    RunnableMap({
        "context": lambda x: "\n\n".join([doc.page_content for doc in x["docs"]]),
        "question": lambda x: x["question"]
    })
    | prompt
    | llm
)

# Endpoint
@router.post("/pregunta")
async def ask_question(request: Pregunta):
    #data = await request.json()
    #pregunta = data.get("pregunta")
    pregunta = request.pregunta
    if not pregunta:
        return {"error": "Campo 'pregunta' es obligatorio"}

    docs = vstore.similarity_search(pregunta, k=3)
    respuesta = chain.invoke({"question": pregunta, "docs": docs})
    return {"respuesta": respuesta.content}
