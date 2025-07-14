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

## 🗄️ Diagrama Entidad-Relación de la Base de Datos

```mermaid
erDiagram
  User {
    Integer id PK
    String username
    String email
    String password
    String phone
    String level
    Integer points
    Integer benefits
    String achievements_json
    DateTime creacion
    Boolean estado
    Boolean is_superuser
    Boolean is_trainer
    Integer status
    Integer role_id FK
    DateTime created_at
    DateTime updated_at
  }
  Role {
    Integer id PK
    String name
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  Membership {
    Integer id PK
    String name
    String description
    Numeric price
    Integer duration_days
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  UserMembership {
    Integer id PK
    Integer user_id FK
    Integer membership_id FK
    DateTime start_date
    DateTime end_date
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  Routine {
    Integer id PK
    String name
    String focus
    String level
    String description
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  UserRoutine {
    Integer id PK
    Integer user_id FK
    Integer routine_id FK
    DateTime assigned_at
    DateTime completed_at
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  Point {
    Integer id PK
    Integer user_id FK
    Integer amount
    String reason
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  Achievement {
    Integer id PK
    String name
    String description
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  UserAchievement {
    Integer id PK
    Integer user_id FK
    Integer achievement_id FK
    Integer status
    DateTime obtained_at
    DateTime created_at
    DateTime updated_at
  }
  ChatMessage {
    Integer id PK
    Integer user_id FK
    String message_type
    String content
    String session_id
    Integer status
    DateTime timestamp
    DateTime created_at
    DateTime updated_at
  }
  Prize {
    Integer id PK
    String name
    String description
    String image_url
    Integer points_cost
    Integer stock
    String category
    Integer status
    DateTime created_at
    DateTime updated_at
  }
  PrizePurchase {
    Integer id PK
    Integer user_id FK
    Integer prize_id FK
    Integer points_spent
    DateTime purchase_date
    String status
    String shipping_address
    String tracking_number
    DateTime created_at
    DateTime updated_at
  }
  AuditLog {
    Integer id PK
    String table_name
    Integer record_id
    String action
    String field_name
    String old_value
    String new_value
    Integer user_id FK
    String ip_address
    String user_agent
    DateTime created_at
  }
  
  User ||--o{ UserMembership : "memberships"
  Membership ||--o{ UserMembership : "user_memberships"
  User ||--o{ UserRoutine : "routines"
  Routine ||--o{ UserRoutine : "user_routines"
  User ||--o{ Point : "points_rel"
  User ||--o{ UserAchievement : "achievements"
  Achievement ||--o{ UserAchievement : "user_achievements"
  User ||--o{ ChatMessage : "chat_messages"
  User ||--o{ PrizePurchase : "prize_purchases"
  Prize ||--o{ PrizePurchase : "purchases"
  User ||--o{ AuditLog : "audit_logs"
  Role ||--o{ User : "users"
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