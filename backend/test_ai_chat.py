#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de IA del chat
"""

import os
import sys
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Verificar que las variables necesarias estén configuradas
def check_environment():
    """Verifica que las variables de entorno necesarias estén configuradas"""
    required_vars = ['OPENAI_API_KEY', 'PINECONE_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Variables de entorno faltantes: {', '.join(missing_vars)}")
        print("Por favor, configura estas variables en tu archivo .env")
        return False
    
    print("✅ Variables de entorno configuradas correctamente")
    return True

def test_pinecone_connection():
    """Prueba la conexión con Pinecone"""
    try:
        from langchain_pinecone import PineconeVectorStore
        from langchain_huggingface import HuggingFaceEmbeddings
        
        print("🔍 Probando conexión con Pinecone...")
        
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        vstore = PineconeVectorStore.from_existing_index("chatbot", embeddings)
        
        # Hacer una búsqueda de prueba
        docs = vstore.similarity_search("ejercicio", k=1)
        print(f"✅ Conexión con Pinecone exitosa. Documentos encontrados: {len(docs)}")
        return True
        
    except Exception as e:
        print(f"❌ Error al conectar con Pinecone: {str(e)}")
        return False

def test_openai_connection():
    """Prueba la conexión con OpenAI"""
    try:
        from langchain_openai import ChatOpenAI
        
        print("🤖 Probando conexión con OpenAI...")
        
        llm = ChatOpenAI(model_name='gpt-3.5-turbo', temperature=0)
        response = llm.invoke("Hola, ¿cómo estás?")
        
        print(f"✅ Conexión con OpenAI exitosa. Respuesta: {response.content[:50]}...")
        return True
        
    except Exception as e:
        print(f"❌ Error al conectar con OpenAI: {str(e)}")
        return False

def test_ai_chain():
    """Prueba la cadena completa de IA"""
    try:
        from langchain_openai import ChatOpenAI
        from langchain.prompts import ChatPromptTemplate
        from langchain_core.runnables import RunnableMap
        from langchain_huggingface import HuggingFaceEmbeddings
        from langchain_pinecone import PineconeVectorStore
        
        print("🔗 Probando cadena completa de IA...")
        
        # Inicializar componentes
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
        vstore = PineconeVectorStore.from_existing_index("chatbot", embeddings)
        llm = ChatOpenAI(model_name='gpt-3.5-turbo', temperature=0)
        
        # Crear prompt y cadena
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
        
        # Probar la cadena
        docs = vstore.similarity_search("ejercicio", k=2)
        response = chain.invoke({"question": "¿Qué es el ejercicio?", "docs": docs})
        
        print(f"✅ Cadena de IA funcionando correctamente. Respuesta: {response.content[:100]}...")
        return True
        
    except Exception as e:
        print(f"❌ Error en la cadena de IA: {str(e)}")
        return False

def main():
    """Función principal de prueba"""
    print("🧪 Iniciando pruebas de IA...\n")
    
    # Verificar variables de entorno
    if not check_environment():
        sys.exit(1)
    
    print()
    
    # Probar conexiones
    pinecone_ok = test_pinecone_connection()
    openai_ok = test_openai_connection()
    
    print()
    
    # Probar cadena completa si las conexiones están bien
    if pinecone_ok and openai_ok:
        chain_ok = test_ai_chain()
        
        print("\n" + "="*50)
        if chain_ok:
            print("🎉 ¡Todas las pruebas pasaron! La IA está lista para usar.")
        else:
            print("⚠️  Algunas pruebas fallaron. Revisa los errores arriba.")
    else:
        print("\n" + "="*50)
        print("⚠️  No se pueden ejecutar todas las pruebas debido a errores de conexión.")

if __name__ == "__main__":
    main() 