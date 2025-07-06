# Configuración de APIs de IA - OpenAI y Pinecone

## 🚀 Configuración Rápida

### 1. Crear archivo .env
```bash
cd backend
python create_env.py
```

### 2. Configurar OpenAI
1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una nueva API key
3. Edita el archivo `.env` y reemplaza:
   ```
   OPENAI_API_KEY=tu_clave_real_aqui
   ```

### 3. Verificar Pinecone
La clave de Pinecone ya está configurada en el archivo `.env`:
```
PINECONE_API_KEY=pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv
```

### 4. Probar APIs
```bash
python test_ai_apis.py
```

### 5. Reiniciar servidor
```bash
python main.py
```

## 🔧 Funcionalidades del Chat con IA

### OpenAI GPT-3.5-turbo
- ✅ **Respuestas inteligentes**: Basadas en contexto de fitness
- ✅ **Multilingüe**: Responde en español
- ✅ **Especializado**: Enfoque en rutinas de ejercicio
- ✅ **Motivacional**: Respuestas que motivan al usuario

### Pinecone Vector Database
- ✅ **Búsqueda semántica**: Encuentra información relevante
- ✅ **Contexto especializado**: Base de datos de fitness
- ✅ **Respuestas precisas**: Basadas en documentos reales
- ✅ **Escalable**: Maneja grandes volúmenes de datos

### Integración Completa
- ✅ **RAG (Retrieval Augmented Generation)**: Combina búsqueda + generación
- ✅ **Contexto dinámico**: Respuestas basadas en documentos relevantes
- ✅ **Fallback inteligente**: Si las APIs fallan, usa respuestas predefinidas

## 📝 Estructura del Sistema

### Backend
```
backend/
├── api/chat.py              # Endpoint de chat con IA
├── .env                     # Variables de entorno
├── create_env.py           # Script para crear .env
├── test_ai_apis.py         # Pruebas de APIs
└── setup_ai.py             # Configuración de IA
```

### Flujo de Chat
1. **Usuario envía mensaje** → Frontend
2. **Frontend** → Backend `/api/chat/send`
3. **Backend busca contexto** → Pinecone
4. **Backend genera respuesta** → OpenAI GPT-3.5
5. **Respuesta** → Frontend → Usuario

## 🧪 Pruebas

### Probar APIs individualmente
```bash
# Probar OpenAI
python -c "
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model_name='gpt-3.5-turbo')
print(llm.invoke('Di hola'))
"

# Probar Pinecone
python -c "
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
embeddings = HuggingFaceEmbeddings()
vstore = PineconeVectorStore.from_existing_index('chatbot', embeddings)
docs = vstore.similarity_search('ejercicio', k=1)
print(docs[0].page_content)
"
```

### Probar endpoint completo
```bash
python test_chat_endpoint.py
```

## 🔄 Fallback System

Si las APIs no están disponibles, el sistema usa respuestas predefinidas:

- ✅ **Saludos**: "¡Hola! Soy tu asistente de fitness..."
- ✅ **Rutinas**: "Te ayudo con tu rutina de ejercicios..."
- ✅ **Cardio**: "Para cardio te recomiendo..."
- ✅ **Fuerza**: "Para entrenamiento de fuerza..."
- ✅ **Nutrición**: "La nutrición es clave..."

## 📊 Monitoreo

### Logs del Backend
```python
# En api/chat.py
print(f"=== MENSAJE RECIBIDO ===")
print(f"Usuario ID: {message.user_id}")
print(f"Mensaje: {message.message}")
print(f"=== RESPUESTA GENERADA ===")
print(f"Respuesta: {ai_response_text}")
```

### Verificar estado
```bash
# Verificar variables de entorno
python setup_ai.py

# Probar APIs
python test_ai_apis.py
```

## 🚨 Troubleshooting

### Error: "OpenAI API Key no configurada"
1. Verifica que el archivo `.env` existe
2. Asegúrate de que `OPENAI_API_KEY` tenga tu clave real
3. Reinicia el servidor

### Error: "Pinecone API Key no configurada"
1. Verifica que `PINECONE_API_KEY` esté en el archivo `.env`
2. La clave ya está configurada por defecto

### Error: "No se puede conectar a OpenAI"
1. Verifica tu conexión a internet
2. Asegúrate de que tu clave de OpenAI sea válida
3. Verifica que tengas créditos en tu cuenta de OpenAI

### Error: "No se puede conectar a Pinecone"
1. Verifica que el índice "chatbot" exista en Pinecone
2. Asegúrate de que la clave de Pinecone sea válida

## 🎯 Resultado Final

Con las APIs configuradas, el chat tendrá:

- ✅ **Respuestas inteligentes** de OpenAI GPT-3.5
- ✅ **Contexto especializado** de Pinecone
- ✅ **Integración completa** RAG
- ✅ **Fallback robusto** si las APIs fallan
- ✅ **Logging detallado** para debugging
- ✅ **Escalabilidad** para crecer con el proyecto

¡El chat ahora usará las APIs reales de OpenAI y Pinecone para proporcionar respuestas inteligentes y contextuales! 