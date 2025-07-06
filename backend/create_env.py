import os

def create_env_file():
    """Crea el archivo .env con las configuraciones necesarias"""
    
    env_content = """# Configuración de la base de datos Supabase
DATABASE_URL=postgresql://postgres.wwwanszaadvicyfkudaj:Pigo0173!@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Configuración JWT
SECRET_KEY=tu_clave_secreta_aqui_cambiala_en_produccion

# Configuración de CORS
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:8080","http://127.0.0.1:5173","http://127.0.0.1:8080"]

# Configuración de IA - REEMPLAZA CON TUS CLAVES REALES
OPENAI_API_KEY=tu_clave_de_openai_aqui
PINECONE_API_KEY=pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv
PINECONE_INDEX_NAME=chatbot
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Archivo .env creado exitosamente")
        print("\n📝 INSTRUCCIONES:")
        print("1. Edita el archivo .env y reemplaza las claves:")
        print("   - OPENAI_API_KEY: Obtén tu clave en https://platform.openai.com/api-keys")
        print("   - PINECONE_API_KEY: Ya está configurada")
        print("2. Reinicia el servidor backend")
        print("3. El chat usará las APIs reales de OpenAI y Pinecone")
        
    except Exception as e:
        print(f"❌ Error al crear archivo .env: {e}")

if __name__ == "__main__":
    create_env_file() 