#!/usr/bin/env python3
"""
Script de migración para agregar nuevos campos a la tabla de usuarios
"""

import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database.database import Base, engine
from database.models import User
import sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Boolean
from config.settings import settings

engine = create_engine(settings.DATABASE_URL)
metadata = MetaData()
metadata.reflect(bind=engine)

users = Table('users', metadata, autoload_with=engine)

def migrate_database():
    """Ejecuta la migración de la base de datos"""
    try:
        # Crear las nuevas tablas con los campos actualizados
        Base.metadata.create_all(bind=engine)
        print("✅ Tablas creadas/actualizadas exitosamente")
        
        # Verificar si la tabla users existe y tiene los nuevos campos
        with engine.connect() as connection:
            # Verificar si la columna phone existe
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'phone'
            """))
            
            if not result.fetchone():
                print("🔄 Agregando columna 'phone'...")
                connection.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR"))
                
            # Verificar si la columna level existe
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'level'
            """))
            
            if not result.fetchone():
                print("🔄 Agregando columna 'level'...")
                connection.execute(text("ALTER TABLE users ADD COLUMN level VARCHAR DEFAULT 'Bronce'"))
                
            # Verificar si la columna points existe
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'points'
            """))
            
            if not result.fetchone():
                print("🔄 Agregando columna 'points'...")
                connection.execute(text("ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0"))
                
            # Verificar si la columna benefits existe
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'benefits'
            """))
            
            if not result.fetchone():
                print("🔄 Agregando columna 'benefits'...")
                connection.execute(text("ALTER TABLE users ADD COLUMN benefits INTEGER DEFAULT 0"))
                
            # Verificar si la columna achievements existe
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'achievements'
            """))
            
            if not result.fetchone():
                print("🔄 Agregando columna 'achievements'...")
                connection.execute(text("ALTER TABLE users ADD COLUMN achievements VARCHAR DEFAULT '[]'"))
            
            connection.commit()
            print("✅ Migración completada exitosamente")
            
    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        return False
    
    return True

# Verificar si la columna is_superuser existe, si no, agregarla
def add_is_superuser_column():
    with engine.connect() as conn:
        insp = sqlalchemy.inspect(conn)
        columns = [col['name'] for col in insp.get_columns('users')]
        if 'is_superuser' not in columns:
            print('Agregando columna is_superuser a la tabla users...')
            conn.execute(sqlalchemy.text('ALTER TABLE users ADD COLUMN is_superuser BOOLEAN DEFAULT FALSE'))
        else:
            print('La columna is_superuser ya existe.')

# Normalizar los valores nulos o inexistentes a False
def normalize_is_superuser():
    with engine.connect() as conn:
        print('Normalizando valores nulos de is_superuser a FALSE...')
        conn.execute(sqlalchemy.text('UPDATE users SET is_superuser = FALSE WHERE is_superuser IS NULL'))
        print('Normalización completada.')

if __name__ == "__main__":
    print("🚀 Iniciando migración de la base de datos...")
    success = migrate_database()
    
    if success:
        print("🎉 Migración completada exitosamente!")
    else:
        print("💥 Error en la migración")
        sys.exit(1) 
    add_is_superuser_column()
    normalize_is_superuser()
    print('Migración y normalización completadas.') 