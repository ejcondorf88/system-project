# Usar imagen base de Python 3.11
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Crear directorio para logs
RUN mkdir -p /app/logs

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV PYTHONPATH=/app
ENV DATABASE_URL=postgresql://postgres.wwwanszaadvicyfkudaj:Pigo0173!@aws-0-us-west-1.pooler.supabase.com:5432/postgres
ENV SECRET_KEY=tu_clave_secreta_aqui_cambiala_en_produccion
ENV ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:8080","http://127.0.0.1:5173","http://127.0.0.1:8080"]
ENV OPENAI_API_KEY=tu_clave_de_openai_aqui
ENV PINECONE_API_KEY=pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv
ENV PINECONE_INDEX_NAME=chatbot

# Comando para ejecutar la aplicación
CMD ["python", "main.py"] 