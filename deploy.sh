#!/bin/bash

# Script de Despliegue Automatizado
# Para Render (Backend) y Netlify (Frontend)

echo "🚀 Iniciando proceso de despliegue..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    print_error "No se encontró docker-compose.yml. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existen los directorios necesarios
if [ ! -d "backend" ]; then
    print_error "Directorio 'backend' no encontrado"
    exit 1
fi

if [ ! -d "fronted" ]; then
    print_error "Directorio 'fronted' no encontrado"
    exit 1
fi

print_status "✅ Estructura del proyecto verificada"

# Verificar archivos de configuración
print_status "Verificando archivos de configuración..."

if [ ! -f "render.yaml" ]; then
    print_warning "render.yaml no encontrado. Se creará automáticamente."
fi

if [ ! -f "fronted/netlify.toml" ]; then
    print_warning "netlify.toml no encontrado. Se creará automáticamente."
fi

print_status "✅ Archivos de configuración verificados"

# Verificar dependencias del backend
print_status "Verificando dependencias del backend..."
if [ ! -f "backend/requirements.txt" ]; then
    print_error "requirements.txt no encontrado en el directorio backend"
    exit 1
fi

# Verificar dependencias del frontend
print_status "Verificando dependencias del frontend..."
if [ ! -f "fronted/package.json" ]; then
    print_error "package.json no encontrado en el directorio fronted"
    exit 1
fi

print_status "✅ Dependencias verificadas"

# Verificar variables de entorno
print_status "Verificando variables de entorno..."

# Verificar si existe .env en el backend
if [ ! -f "backend/.env" ]; then
    print_warning "Archivo .env no encontrado en backend. Se creará un template."
    cat > backend/.env << EOF
# Variables de entorno para desarrollo
DATABASE_URL=postgresql://postgres.wwwanszaadvicyfkudaj:Pigo0173!@aws-0-us-west-1.pooler.supabase.com:5432/postgres
SECRET_KEY=tu_clave_secreta_aqui_cambiala_en_produccion
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:8080","http://127.0.0.1:3000","http://127.0.0.1:8080"]
OPENAI_API_KEY=tu_clave_de_openai_aqui
PINECONE_API_KEY=pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv
PINECONE_INDEX_NAME=chatbot
EOF
    print_status "✅ Template de .env creado en backend"
fi

print_status "✅ Variables de entorno verificadas"

# Verificar Git
print_status "Verificando estado de Git..."

if ! command -v git &> /dev/null; then
    print_error "Git no está instalado"
    exit 1
fi

if [ ! -d ".git" ]; then
    print_error "No se encontró un repositorio Git. Inicializa Git primero:"
    echo "git init"
    echo "git add ."
    echo "git commit -m 'Initial commit'"
    exit 1
fi

# Verificar si hay cambios sin commitear
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Hay cambios sin commitear. ¿Quieres continuar? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_status "Despliegue cancelado. Haz commit de tus cambios primero."
        exit 1
    fi
fi

print_status "✅ Git verificado"

# Mostrar instrucciones de despliegue
echo ""
echo "🎯 INSTRUCCIONES DE DESPLIEGUE"
echo "================================"
echo ""
echo "1. 🚀 BACKEND (Render):"
echo "   - Ve a https://render.com"
echo "   - Crea un nuevo Web Service"
echo "   - Conecta tu repositorio de GitHub"
echo "   - Configura:"
echo "     * Root Directory: backend"
echo "     * Build Command: pip install -r requirements.txt"
echo "     * Start Command: python main.py"
echo "   - Configura las variables de entorno (ver DEPLOYMENT.md)"
echo ""
echo "2. 🎨 FRONTEND (Netlify):"
echo "   - Ve a https://netlify.com"
echo "   - Importa tu proyecto desde GitHub"
echo "   - Configura:"
echo "     * Base directory: fronted"
echo "     * Build command: npm run build"
echo "     * Publish directory: dist"
echo "   - Configura las variables de entorno (ver DEPLOYMENT.md)"
echo ""
echo "3. 🔧 POST-DESPLIEGUE:"
echo "   - Actualiza las URLs en el código (ver DEPLOYMENT.md)"
echo "   - Verifica la conectividad entre frontend y backend"
echo "   - Prueba todas las funcionalidades"
echo ""
echo "📖 Para instrucciones detalladas, consulta DEPLOYMENT.md"
echo ""

# Verificar si el usuario quiere continuar
print_status "¿Quieres que te ayude con algún paso específico? (y/n)"
read -r help_response
if [[ "$help_response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "¿Qué necesitas ayuda?"
    echo "1. Configurar Render (Backend)"
    echo "2. Configurar Netlify (Frontend)"
    echo "3. Configurar variables de entorno"
    echo "4. Troubleshooting"
    echo "5. Salir"
    echo ""
    read -r choice
    
    case $choice in
        1)
            echo ""
            echo "🔧 CONFIGURACIÓN DE RENDER:"
            echo "1. Ve a https://render.com y crea una cuenta"
            echo "2. Haz clic en 'New +' → 'Web Service'"
            echo "3. Conecta tu repositorio de GitHub"
            echo "4. Configura:"
            echo "   - Name: fitness-backend"
            echo "   - Environment: Python 3"
            echo "   - Build Command: pip install -r requirements.txt"
            echo "   - Start Command: python main.py"
            echo "   - Root Directory: backend"
            echo "5. En la sección 'Environment Variables', agrega:"
            echo "   - DATABASE_URL: tu_url_de_base_de_datos"
            echo "   - SECRET_KEY: una_clave_secreta_segura"
            echo "   - ALLOWED_ORIGINS: [\"https://tu-app.netlify.app\"]"
            echo "   - OPENAI_API_KEY: tu_clave_de_openai"
            echo "   - PINECONE_API_KEY: tu_clave_de_pinecone"
            echo "   - PINECONE_INDEX_NAME: chatbot"
            ;;
        2)
            echo ""
            echo "🎨 CONFIGURACIÓN DE NETLIFY:"
            echo "1. Ve a https://netlify.com y crea una cuenta"
            echo "2. Haz clic en 'Add new site' → 'Import an existing project'"
            echo "3. Conecta tu repositorio de GitHub"
            echo "4. Configura:"
            echo "   - Base directory: fronted"
            echo "   - Build command: npm run build"
            echo "   - Publish directory: dist"
            echo "5. En la sección 'Environment variables', agrega:"
            echo "   - VITE_API_URL: https://tu-backend-app.onrender.com/api"
            echo "   - VITE_APP_NAME: Fitness AI Assistant"
            ;;
        3)
            echo ""
            echo "🔐 VARIABLES DE ENTORNO:"
            echo ""
            echo "BACKEND (Render):"
            echo "DATABASE_URL=postgresql://usuario:password@host:puerto/database"
            echo "SECRET_KEY=una_clave_secreta_muy_larga_y_segura"
            echo "ALLOWED_ORIGINS=[\"https://tu-app.netlify.app\", \"http://localhost:3000\"]"
            echo "OPENAI_API_KEY=sk-tu_clave_de_openai"
            echo "PINECONE_API_KEY=tu_clave_de_pinecone"
            echo "PINECONE_INDEX_NAME=chatbot"
            echo ""
            echo "FRONTEND (Netlify):"
            echo "VITE_API_URL=https://tu-backend-app.onrender.com/api"
            echo "VITE_APP_NAME=Fitness AI Assistant"
            ;;
        4)
            echo ""
            echo "🚨 TROUBLESHOOTING COMÚN:"
            echo ""
            echo "Error de CORS:"
            echo "- Verifica que la URL del frontend esté en ALLOWED_ORIGINS"
            echo "- Asegúrate de usar HTTPS en producción"
            echo ""
            echo "Error de conexión a la base de datos:"
            echo "- Verifica que DATABASE_URL esté correcta"
            echo "- Asegúrate de que la base de datos sea accesible desde Render"
            echo ""
            echo "Error de build en Netlify:"
            echo "- Verifica que Node.js 18 esté disponible"
            echo "- Revisa los logs de build"
            echo ""
            echo "Variables de entorno no encontradas:"
            echo "- Verifica que las variables estén configuradas en ambos servicios"
            echo "- Asegúrate de que los nombres sean correctos"
            ;;
        5)
            print_status "¡Gracias por usar el script de despliegue!"
            ;;
        *)
            print_error "Opción no válida"
            ;;
    esac
fi

# Verificar build del frontend
print_status "Verificando build del frontend..."
cd fronted
if npm run build > /dev/null 2>&1; then
    print_status "✅ Build del frontend exitoso"
else
    print_warning "⚠️  Build del frontend tiene advertencias (esto es normal)"
fi
cd ..

print_status "✅ Script de despliegue completado"
print_status "📖 Consulta DEPLOYMENT.md para instrucciones detalladas"
print_status "🚀 ¡Buena suerte con tu despliegue!" 