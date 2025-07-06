#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}Fitness App - Docker Management Script${NC}"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build     - Construir las imágenes Docker"
    echo "  start     - Iniciar los servicios"
    echo "  stop      - Detener los servicios"
    echo "  restart   - Reiniciar los servicios"
    echo "  logs      - Mostrar logs de los servicios"
    echo "  clean     - Limpiar contenedores e imágenes"
    echo "  status    - Mostrar estado de los servicios"
    echo "  shell     - Abrir shell en el contenedor backend"
    echo "  help      - Mostrar esta ayuda"
    echo ""
}

# Función para construir las imágenes
build_images() {
    echo -e "${YELLOW}🔨 Construyendo imágenes Docker...${NC}"
    docker-compose build --no-cache
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Imágenes construidas exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al construir las imágenes${NC}"
        exit 1
    fi
}

# Función para iniciar los servicios
start_services() {
    echo -e "${YELLOW}🚀 Iniciando servicios...${NC}"
    docker-compose up -d
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servicios iniciados exitosamente${NC}"
        echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
        echo -e "${BLUE}🔧 Backend: http://localhost:8080${NC}"
        echo -e "${BLUE}📊 API Docs: http://localhost:8080/docs${NC}"
    else
        echo -e "${RED}❌ Error al iniciar los servicios${NC}"
        exit 1
    fi
}

# Función para detener los servicios
stop_services() {
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    docker-compose down
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servicios detenidos exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al detener los servicios${NC}"
        exit 1
    fi
}

# Función para reiniciar los servicios
restart_services() {
    echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
    docker-compose restart
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servicios reiniciados exitosamente${NC}"
    else
        echo -e "${RED}❌ Error al reiniciar los servicios${NC}"
        exit 1
    fi
}

# Función para mostrar logs
show_logs() {
    echo -e "${YELLOW}📋 Mostrando logs...${NC}"
    docker-compose logs -f
}

# Función para limpiar
clean_docker() {
    echo -e "${YELLOW}🧹 Limpiando Docker...${NC}"
    docker-compose down -v --remove-orphans
    docker system prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Función para mostrar estado
show_status() {
    echo -e "${YELLOW}📊 Estado de los servicios:${NC}"
    docker-compose ps
    echo ""
    echo -e "${YELLOW}📈 Uso de recursos:${NC}"
    docker stats --no-stream
}

# Función para abrir shell en backend
open_shell() {
    echo -e "${YELLOW}🐚 Abriendo shell en el contenedor backend...${NC}"
    docker-compose exec backend /bin/bash
}

# Función para verificar Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker no está instalado${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose no está instalado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker y Docker Compose están instalados${NC}"
}

# Función para verificar variables de entorno
check_env() {
    echo -e "${YELLOW}🔍 Verificando variables de entorno...${NC}"
    
    if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "tu_clave_de_openai_aqui" ]; then
        echo -e "${YELLOW}⚠️  OPENAI_API_KEY no está configurada${NC}"
        echo -e "${BLUE}   Configura OPENAI_API_KEY en tu entorno o en docker-compose.yml${NC}"
    else
        echo -e "${GREEN}✅ OPENAI_API_KEY está configurada${NC}"
    fi
}

# Función principal
main() {
    case "$1" in
        "build")
            check_docker
            build_images
            ;;
        "start")
            check_docker
            check_env
            start_services
            ;;
        "stop")
            check_docker
            stop_services
            ;;
        "restart")
            check_docker
            restart_services
            ;;
        "logs")
            check_docker
            show_logs
            ;;
        "clean")
            check_docker
            clean_docker
            ;;
        "status")
            check_docker
            show_status
            ;;
        "shell")
            check_docker
            open_shell
            ;;
        "help"|"")
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando no reconocido: $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@" 