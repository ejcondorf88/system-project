# Docker Setup - Fitness App

## 🐳 Configuración de Docker

### 📋 Prerrequisitos

- Docker Desktop instalado
- Docker Compose instalado
- Al menos 4GB de RAM disponible

### 🚀 Inicio Rápido

#### 1. Configurar Variables de Entorno

```bash
# Configurar OpenAI API Key (opcional)
export OPENAI_API_KEY=tu_clave_real_de_openai
```

#### 2. Construir e Iniciar

```bash
# Dar permisos al script
chmod +x docker-scripts.sh

# Construir imágenes
./docker-scripts.sh build

# Iniciar servicios
./docker-scripts.sh start
```

#### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **API Docs**: http://localhost:8080/docs

### 🔧 Comandos Disponibles

```bash
# Construir imágenes
./docker-scripts.sh build

# Iniciar servicios
./docker-scripts.sh start

# Detener servicios
./docker-scripts.sh stop

# Reiniciar servicios
./docker-scripts.sh restart

# Ver logs
./docker-scripts.sh logs

# Ver estado
./docker-scripts.sh status

# Limpiar Docker
./docker-scripts.sh clean

# Abrir shell en backend
./docker-scripts.sh shell

# Ver ayuda
./docker-scripts.sh help
```

### 📁 Estructura de Archivos Docker

```
system-project/
├── docker-compose.yml          # Orquestación de servicios
├── docker-scripts.sh           # Script de manejo de Docker
├── backend/
│   ├── Dockerfile              # Imagen del backend
│   └── .dockerignore           # Archivos a ignorar
└── fronted/
    ├── Dockerfile              # Imagen del frontend
    ├── nginx.conf              # Configuración de nginx
    └── .dockerignore           # Archivos a ignorar
```

### 🏗️ Arquitectura Docker

#### Backend Service
- **Imagen**: `python:3.11-slim`
- **Puerto**: 8080
- **Funcionalidades**:
  - FastAPI con autenticación JWT
  - Base de datos PostgreSQL (Supabase)
  - APIs de OpenAI y Pinecone
  - Chat con IA

#### Frontend Service
- **Imagen**: `node:18-alpine` + `nginx:alpine`
- **Puerto**: 3000
- **Funcionalidades**:
  - React + Vite
  - Nginx para servir archivos estáticos
  - Proxy reverso al backend
  - Compresión gzip

### 🔄 Flujo de Datos

```
Usuario → Frontend (Nginx) → Backend (FastAPI) → APIs Externas
                ↓                    ↓
            React App         OpenAI + Pinecone
```

### 📊 Monitoreo

#### Health Checks
- **Backend**: Verifica endpoint `/`
- **Frontend**: Verifica servidor nginx
- **Intervalo**: 30 segundos
- **Timeout**: 10 segundos
- **Reintentos**: 3

#### Logs
```bash
# Ver logs en tiempo real
./docker-scripts.sh logs

# Ver logs específicos
docker-compose logs backend
docker-compose logs frontend
```

### 🔧 Configuración Avanzada

#### Variables de Entorno

```yaml
# docker-compose.yml
environment:
  - DATABASE_URL=postgresql://...
  - SECRET_KEY=tu_clave_secreta
  - OPENAI_API_KEY=${OPENAI_API_KEY}
  - PINECONE_API_KEY=pcsk_...
```

#### Volúmenes
- `./backend/logs:/app/logs` - Logs del backend
- `logs` - Volumen para logs compartidos

#### Redes
- `fitness-network` - Red bridge para comunicación entre servicios

### 🚨 Troubleshooting

#### Error: "Port already in use"
```bash
# Verificar puertos en uso
lsof -i :3000
lsof -i :8080

# Detener servicios
./docker-scripts.sh stop
```

#### Error: "Build failed"
```bash
# Limpiar Docker
./docker-scripts.sh clean

# Reconstruir
./docker-scripts.sh build
```

#### Error: "Container not starting"
```bash
# Ver logs
docker-compose logs backend
docker-compose logs frontend

# Verificar estado
./docker-scripts.sh status
```

#### Error: "API not responding"
```bash
# Verificar variables de entorno
echo $OPENAI_API_KEY

# Reiniciar servicios
./docker-scripts.sh restart
```

### 🔒 Seguridad

#### Headers de Seguridad (Nginx)
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`
- `Content-Security-Policy: default-src 'self'`

#### Optimizaciones
- **Compresión gzip** para archivos estáticos
- **Cache headers** para recursos estáticos
- **Proxy reverso** para API calls
- **Health checks** para monitoreo

### 📈 Performance

#### Optimizaciones de Imagen
- **Backend**: Multi-stage build con Python slim
- **Frontend**: Multi-stage build con nginx alpine
- **Dockerignore**: Excluye archivos innecesarios

#### Recursos Recomendados
- **CPU**: 2 cores mínimo
- **RAM**: 4GB mínimo
- **Disco**: 10GB libre

### 🚀 Producción

#### Para Despliegue en Producción

1. **Configurar variables de entorno**:
   ```bash
   export OPENAI_API_KEY=tu_clave_real
   export SECRET_KEY=clave_secreta_fuerte
   ```

2. **Construir para producción**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Configurar SSL/TLS** (opcional):
   ```bash
   # Agregar certificados SSL
   cp ssl/cert.pem fronted/ssl/
   cp ssl/key.pem fronted/ssl/
   ```

### 📝 Notas Importantes

- **Desarrollo**: Usa `docker-compose.yml` para desarrollo
- **Producción**: Usa `docker-compose.prod.yml` para producción
- **Logs**: Se guardan en `./backend/logs/`
- **Backup**: Considera hacer backup de la base de datos
- **Updates**: Actualiza imágenes regularmente para seguridad

### 🎯 Resultado

Con Docker configurado, tendrás:
- ✅ **Entorno aislado** y reproducible
- ✅ **Despliegue fácil** en cualquier servidor
- ✅ **Escalabilidad** horizontal
- ✅ **Monitoreo** integrado
- ✅ **Seguridad** mejorada
- ✅ **Performance** optimizada

¡El sistema está listo para producción con Docker! 