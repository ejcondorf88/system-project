# Configuración de IA para el Chat

Este documento explica cómo configurar la funcionalidad de IA para el chat usando OpenAI, Pinecone y LangChain.

## Requisitos Previos

1. **Cuenta de OpenAI**: Necesitas una clave de API de OpenAI
2. **Cuenta de Pinecone**: Necesitas una clave de API de Pinecone
3. **Documentos cargados en Pinecone**: Los documentos deben estar ya procesados y almacenados en el índice "chatbot"

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

```env
# Configuración de la base de datos
DATABASE_URL=postgresql://postgres:password@localhost:5432/system_project

# Claves de API para IA
OPENAI_API_KEY=tu_clave_de_openai_aqui
PINECONE_API_KEY=pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv

# Configuración de seguridad
SECRET_KEY=tu_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Configuración de CORS
ALLOWED_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]
```

### 2. Instalar Dependencias

Ejecuta el siguiente comando para instalar las dependencias de IA:

```bash
pip install -r requirements.txt
```

### 3. Cargar Documentos en Pinecone

Si aún no has cargado documentos en Pinecone, puedes usar el script que proporcionaste:

```python
import os
from pinecone import Pinecone
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

# Configurar variables
os.environ["PINECONE_API_KEY"] = "tu_clave_de_pinecone"
INDEX_NAME = 'chatbot'
pdf_path = "ruta/a/tu/archivo.pdf"

def text_to_pinecone(pdf_path):
    # Cargar PDF
    loader = PyPDFLoader(pdf_path)
    text = loader.load()
    
    # Dividir en chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        length_function=len
    )
    chunks = text_splitter.split_documents(text)
    
    # Crear embeddings y almacenar
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    PineconeVectorStore.from_documents(
        chunks,
        embeddings,
        index_name=INDEX_NAME
    )

# Ejecutar
text_to_pinecone(pdf_path)
```

## Pruebas

### Ejecutar Script de Prueba

Para verificar que todo está configurado correctamente:

```bash
python test_ai_chat.py
```

Este script verificará:
- Variables de entorno configuradas
- Conexión con Pinecone
- Conexión con OpenAI
- Funcionamiento de la cadena de IA

### Probar el Endpoint

Una vez que el servidor esté corriendo, puedes probar el endpoint:

```bash
curl -X POST "http://localhost:8080/api/chat/send" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Qué ejercicios son buenos para ganar masa muscular?",
    "user_id": 1,
    "timestamp": "2024-01-01T12:00:00Z"
  }'
```

## Funcionamiento

### Flujo del Chat con IA

1. **Usuario envía mensaje**: El frontend envía un mensaje al endpoint `/api/chat/send`
2. **Búsqueda en Pinecone**: Se buscan documentos relevantes usando embeddings
3. **Generación de respuesta**: Se usa OpenAI con el contexto encontrado
4. **Respuesta al usuario**: Se devuelve la respuesta generada por la IA

### Componentes Utilizados

- **HuggingFace Embeddings**: Para convertir texto a vectores
- **Pinecone**: Base de datos vectorial para almacenar embeddings
- **OpenAI GPT-3.5-turbo**: Modelo de lenguaje para generar respuestas
- **LangChain**: Framework para orquestar el flujo de IA

## Personalización

### Modificar el Prompt

Puedes personalizar el prompt en `api/chat.py`:

```python
prompt = ChatPromptTemplate.from_template(
    "Eres un asistente experto en [tu_dominio]. Responde la siguiente pregunta utilizando los documentos como contexto:\n\n{context}\n\nPregunta: {question}\n\nResponde de manera [estilo_deseado]."
)
```

### Cambiar el Modelo

Para usar un modelo diferente de OpenAI:

```python
llm = ChatOpenAI(model_name='gpt-4', temperature=0.7)
```

### Ajustar Búsqueda

Para cambiar cuántos documentos se recuperan:

```python
docs = vstore.similarity_search(message.message, k=5)  # Cambiar k=3 a k=5
```

## Solución de Problemas

### Error: "No module named 'langchain'"
```bash
pip install langchain langchain-openai langchain-community langchain-core langchain-pinecone
```

### Error: "OpenAI API key not found"
Verifica que la variable `OPENAI_API_KEY` esté configurada en tu archivo `.env`

### Error: "Pinecone index not found"
Asegúrate de que el índice "chatbot" exista en tu cuenta de Pinecone

### Error: "No documents found"
Verifica que hayas cargado documentos en el índice de Pinecone

## Notas Importantes

- **Costo**: El uso de OpenAI tiene un costo por token. Monitorea tu uso.
- **Latencia**: La primera respuesta puede ser más lenta debido a la carga de modelos.
- **Contexto**: El modelo usa los 3 documentos más relevantes como contexto.
- **Idioma**: El modelo de embeddings es multilingüe, pero funciona mejor en español. 