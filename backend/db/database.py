from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres.wwwanszaadvicyfkudaj:Pigo0173!@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
#engine nosayuda con la intereaciion de las tablas
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"sslmode": "require"})
#session nos indica como estan lo datos actualmente
SessionLocal = sessionmaker(bind=engine,autocommit=False,autoflush=False)
Base = declarative_base()

#devuelve un objeto de tipo  sessionmaker
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()