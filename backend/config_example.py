# Archivo de ejemplo para configurar las credenciales de Supabase
# Copia este archivo como .env en el directorio backend

# Configuración de la base de datos Supabase
# Para obtener las credenciales correctas:
# 1. Ve a tu proyecto en Supabase (https://supabase.com)
# 2. Ve a Settings > Database
# 3. Copia la "Connection string" o "URI"
# 4. Reemplaza la URL de abajo con la tuya

DATABASE_URL=postgresql://postgres.wwwanszaadvicyfkudaj:Pigo0173!@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# Configuración JWT
SECRET_KEY=tu_clave_secreta_aqui_cambiala_en_produccion

# Configuración de CORS
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:8080","http://127.0.0.1:5173","http://127.0.0.1:8080"]

# Configuración de IA
OPENAI_API_KEY=tu_clave_de_openai_aqui
PINECONE_API_KEY=pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv 