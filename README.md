# Sistema de Autenticación Full Stack

Este proyecto implementa un sistema de autenticación completo con un backend en FastAPI y un frontend en React.

## 🚀 Características

### Backend (FastAPI)
- Registro de usuarios
- Inicio de sesión con JWT
- Validación de datos con Pydantic
- Base de datos PostgreSQL
- Arquitectura en capas (API, Servicios, Repositorios)
- Seguridad con bcrypt para contraseñas
- CORS configurado
- Documentación automática con Swagger/ReDoc

### Frontend (React)
- Interfaz moderna y responsiva
- Gestión de estado con React Context
- Formularios validados
- Manejo de tokens JWT
- Protección de rutas
- Diseño adaptable a diferentes dispositivos

## 📋 Prerrequisitos

### Backend
- Python 3.8+
- PostgreSQL
- pip (gestor de paquetes de Python)

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
   - Crear una base de datos PostgreSQL llamada `auth_db`
   - Ajustar la URL de la base de datos en `backend/src/config/settings.py` si es necesario

5. Crear archivo `.env` en el directorio backend:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db
SECRET_KEY=tu_clave_secreta_muy_segura
```

### Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
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
cd frontend
npm run dev
# o
yarn dev
```

2. Acceder a la aplicación:
   - Frontend: http://localhost:5173

## 📚 Endpoints del Backend

### Registro de Usuario
- **POST** `/api/auth/register`
- Body:
```json
{
    "username": "usuario",
    "email": "usuario@ejemplo.com",
    "password": "contraseña",
    "confirm_password": "contraseña"
}
```

### Inicio de Sesión
- **POST** `/api/auth/login`
- Body:
```json
{
    "username": "usuario",
    "password": "contraseña"
}
```

## 🏗️ Estructura del Proyecto

```
proyecto/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── auth.py
│   │   ├── config/
│   │   │   └── settings.py
│   │   ├── core/
│   │   │   └── security.py
│   │   ├── database/
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   ├── repositories/
│   │   │   └── user_repository.py
│   │   ├── schemas/
│   │   │   └── user.py
│   │   ├── services/
│   │   │   └── auth_service.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── services/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── package.json
    └── .env
```

## 🔒 Seguridad

### Backend
- Las contraseñas se almacenan hasheadas con bcrypt
- Tokens JWT para autenticación
- Validación de datos con Pydantic
- Protección contra ataques comunes

### Frontend
- Almacenamiento seguro de tokens
- Protección de rutas
- Validación de formularios
- Manejo seguro de credenciales

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles. 