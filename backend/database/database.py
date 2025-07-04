from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import settings

# Usar la URL de la base de datos desde la configuración
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Configuración del engine con manejo de errores
try:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"sslmode": "require"},
        pool_pre_ping=True,  # Verificar conexión antes de usar
        pool_recycle=300     # Reciclar conexiones cada 5 minutos
    )
except Exception as e:
    print(f"Error al crear el engine de la base de datos: {e}")
    raise

# Session maker
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# Función para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 