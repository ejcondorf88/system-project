# MF-Lifting App

Aplicación de gestión de gimnasio desarrollada con React y FastAPI.

## Estructura del Proyecto

```
mf-lifting-app/
├── src/
│   ├── frontend/           # Frontend React + TypeScript
│   │   ├── src/
│   │   │   ├── components/ # Componentes React
│   │   │   ├── adapters/   # Adaptadores para API
│   │   │   ├── hooks/      # Hooks personalizados
│   │   │   └── ...
│   │   ├── package.json
│   │   └── ...
│   │
│   └── backend/           # Backend FastAPI
│       ├── src/
│       │   └── app.py     # Aplicación FastAPI
│       └── requirements.txt
│
├── .gitignore
└── README.md
```

## Requisitos

- Node.js 18+
- Python 3.8+
- PostgreSQL

## Instalación

### Frontend

```bash
cd src/frontend
npm install
npm run dev
```

### Backend

```bash
cd src/backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/app.py
```

## Características

- Registro de usuarios
- Autenticación segura
- Interfaz moderna y responsiva
- API RESTful
- Base de datos PostgreSQL

## Tecnologías

### Frontend
- React
- TypeScript
- Tailwind CSS
- Heroicons

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic

## Autor

Elian Condor

## Licencia

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

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 
