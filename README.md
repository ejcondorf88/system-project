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

MIT 