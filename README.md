# 🏋️‍♂️ M-Lifting: Tu Asistente Personal de Gimnasio con IA

M-Lifting es una plataforma innovadora que combina inteligencia artificial con entrenamiento físico para ofrecer una experiencia personalizada en el gimnasio. Nuestra aplicación no solo gestiona tu membresía, sino que también actúa como tu entrenador personal virtual.

## ✨ Características Destacadas

### 🤖 Asistente IA
- Análisis personalizado de tu forma física
- Recomendaciones de ejercicios adaptadas a tus objetivos
- Seguimiento de progreso con IA
- Detección de posturas incorrectas mediante visión por computadora
- Planes de entrenamiento dinámicos que se adaptan a tu progreso

### 💪 Gestión de Membresía
- Sistema de prueba gratuita de 15 días
- Planes de suscripción flexibles
- Acceso a contenido premium
- Seguimiento de asistencia
- Reserva de clases y equipos

### 📱 Frontend (React + Vite)
- Interfaz moderna con diseño Material UI
- Modo oscuro/claro
- Animaciones fluidas y transiciones suaves
- Diseño responsivo para todos los dispositivos
- PWA (Progressive Web App) para acceso offline
- Gráficos interactivos de progreso
- Calendario de entrenamientos
- Chat en tiempo real con el asistente IA

### 🔧 Backend (FastAPI)
- API RESTful de alto rendimiento
- Autenticación JWT segura
- Integración con servicios de IA
- Sistema de notificaciones en tiempo real
- Análisis de datos de entrenamiento
- Gestión de membresías y pagos
- Documentación automática con Swagger

## 🚀 Tecnologías Principales

### Frontend
- React 18
- Vite
- Material UI
- Redux Toolkit
- React Query
- Socket.io Client
- Chart.js
- Framer Motion

### Backend
- FastAPI
- PostgreSQL
- Redis
- TensorFlow/PyTorch
- OpenCV
- Celery
- WebSockets

## 📋 Prerrequisitos

### Backend
- Python 3.8+
- PostgreSQL
- Redis
- pip

### Frontend
- Node.js 16+
- npm o yarn

## 🔧 Instalación

### Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Crear y activar entorno virtual:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Configurar la base de datos:
   - Crear una base de datos PostgreSQL
   - Configurar Redis para caché y WebSockets
   - Ajustar las variables de entorno

5. Crear archivo `.env` en el directorio backend:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mlifting_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=tu_clave_secreta_muy_segura
AI_MODEL_PATH=/path/to/model
```

### Frontend

1. Navegar al directorio del frontend:
```bash
cd fronted
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Crear archivo `.env` en el directorio frontend:
```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_AI_ENDPOINT=http://localhost:8000/api/ai
```

## 🚀 Ejecución

### Backend

1. Iniciar el servidor:
```bash
cd backend
uvicorn src.main:app --reload
```

2. Acceder a la documentación:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend

1. Iniciar el servidor de desarrollo:
```bash
cd fronted
npm run dev
# o
yarn dev
```

2. Acceder a la aplicación:
   - Frontend: http://localhost:5173

## 📱 Características de la Aplicación

### Sistema de Prueba Gratuita
- 15 días de acceso completo
- Tutorial interactivo
- Evaluación inicial de condición física
- Plan de entrenamiento personalizado
- Acceso a todas las funciones premium

### Asistente IA
- Análisis de ejercicios en tiempo real
- Corrección de postura
- Recomendaciones personalizadas
- Seguimiento de progreso
- Adaptación dinámica de rutinas

### Gestión de Usuario
- Perfil personalizado
- Historial de entrenamientos
- Métricas de progreso
- Objetivos y logros
- Sistema de recompensas

## 🏗️ Estructura del Proyecto

Aquí tienes una vista simplificada de la estructura de carpetas del proyecto:

```
/
├── backend/
│   ├── db/
│   │   ├── database.py
│   │   └── models.py
│   ├── repository/
│   │   ├── auth.py
│   │   └── user.py
│   ├── routes/
│   │   ├── auth.py
│   │   └── user.py
│   ├── schemas/
│   │   └── user.py
│   ├── templates/
│   │   ├── dashboard.html
│   │   └── index.html
│   ├── hashing.py
│   ├── main.py
│   ├── oauth.py
│   ├── tokenJWT.py
│   └── requirements.txt
│
└── fronted/
    ├── src/
    │   ├── adapters/
    │   │   ├── api.ts
    │   │   └── auth.adapter.ts
    │   ├── components/
    │   │   ├── Chat.tsx
    │   │   ├── Login.tsx
    │   │   ├── Profile.tsx
    │   │   └── Register.tsx
    │   ├── hooks/
    │   │   ├── useAuth.ts
    │   │   ├── useChat.ts
    │   │   └── useRegisterForm.ts
    │   ├── routes/
    │   │   └── AppRouter.tsx
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## 🔒 Seguridad

### Backend
- Autenticación JWT
- Encriptación de datos sensibles
- Protección contra ataques comunes
- Validación de datos
- Rate limiting

### Frontend
- Almacenamiento seguro de tokens
- Protección de rutas
- Validación de formularios
- Manejo seguro de credenciales
- HTTPS forzado

## 🚀 Despliegue

### Despliegue Automatizado

Para desplegar tu aplicación en producción, puedes usar el script automatizado:

```bash
./deploy.sh
```

### Despliegue Manual

#### Backend en Render
1. Ve a [Render](https://render.com) y crea una cuenta
2. Crea un nuevo Web Service
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
5. Configura las variables de entorno (ver `DEPLOYMENT.md`)

#### Frontend en Netlify
1. Ve a [Netlify](https://netlify.com) y crea una cuenta
2. Importa tu proyecto desde GitHub
3. Configura:
   - **Base directory**: `fronted`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Configura las variables de entorno (ver `DEPLOYMENT.md`)

### Alternativas de Despliegue

- **Vercel**: Usa el archivo `fronted/vercel.json` para desplegar el frontend
- **Railway**: Alternativa a Render para el backend
- **Heroku**: Plataforma tradicional para aplicaciones web

Para instrucciones detalladas, consulta `DEPLOYMENT.md`.

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 