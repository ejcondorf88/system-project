import os
from dotenv import load_dotenv

def setup_ai_environment():
    """Configura el entorno para las APIs de IA"""
    print("=== CONFIGURACIÓN DE APIS DE IA ===")
    
    # Cargar variables de entorno
    load_dotenv()
    
    # Verificar variables de entorno
    openai_key = os.getenv("OPENAI_API_KEY")
    pinecone_key = os.getenv("PINECONE_API_KEY")
    pinecone_index = os.getenv("PINECONE_INDEX_NAME", "chatbot")
    
    print(f"OpenAI API Key: {'✅ Configurada' if openai_key and openai_key != 'tu_clave_de_openai_aqui' else '❌ No configurada'}")
    print(f"Pinecone API Key: {'✅ Configurada' if pinecone_key else '❌ No configurada'}")
    print(f"Pinecone Index: {pinecone_index}")
    
    if not openai_key or openai_key == 'tu_clave_de_openai_aqui':
        print("\n⚠️  Para usar OpenAI, necesitas:")
        print("1. Ir a https://platform.openai.com/api-keys")
        print("2. Crear una nueva API key")
        print("3. Agregar OPENAI_API_KEY=tu_clave_real en el archivo .env")
    
    if not pinecone_key:
        print("\n⚠️  Para usar Pinecone, necesitas:")
        print("1. Ir a https://app.pinecone.io/")
        print("2. Crear una nueva API key")
        print("3. Agregar PINECONE_API_KEY=tu_clave_real en el archivo .env")
    
    return openai_key and openai_key != 'tu_clave_de_openai_aqui', pinecone_key

if __name__ == "__main__":
    setup_ai_environment() 