#!/usr/bin/env python3
"""
Script para migrar la base de datos y agregar campos de auditoría
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database.database import engine, SessionLocal
from database.models import Base
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_audit_table():
    """Crear tabla de auditoría"""
    try:
        with engine.connect() as conn:
            # Crear tabla audit_logs
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id SERIAL PRIMARY KEY,
                    table_name VARCHAR(100) NOT NULL,
                    record_id INTEGER NOT NULL,
                    action VARCHAR(20) NOT NULL,
                    field_name VARCHAR(100),
                    old_value TEXT,
                    new_value TEXT,
                    user_id INTEGER REFERENCES users(id),
                    ip_address VARCHAR(45),
                    user_agent VARCHAR(500),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # Crear índices para mejor rendimiento
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name)
            """))
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)
            """))
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)
            """))
            
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)
            """))
            
            conn.commit()
            logger.info("✅ Tabla audit_logs creada exitosamente")
            
    except Exception as e:
        logger.error(f"❌ Error al crear tabla audit_logs: {e}")
        raise

def add_status_columns():
    """Agregar columnas status a todas las tablas existentes"""
    tables = [
        'roles',
        'memberships', 
        'user_memberships',
        'routines',
        'user_routines',
        'points',
        'achievements',
        'user_achievements',
        'chat_messages',
        'users'
    ]
    
    try:
        with engine.connect() as conn:
            for table in tables:
                # Verificar si la columna status ya existe
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = '{table}' AND column_name = 'status'
                """))
                
                if not result.fetchone():
                    # Agregar columna status
                    conn.execute(text(f"""
                        ALTER TABLE {table} 
                        ADD COLUMN status INTEGER DEFAULT 1
                    """))
                    logger.info(f"✅ Columna status agregada a tabla {table}")
                else:
                    logger.info(f"ℹ️  Columna status ya existe en tabla {table}")
            
            conn.commit()
            
    except Exception as e:
        logger.error(f"❌ Error al agregar columnas status: {e}")
        raise

def add_timestamp_columns():
    """Agregar columnas de timestamp a todas las tablas"""
    tables = [
        'roles',
        'memberships',
        'user_memberships', 
        'routines',
        'user_routines',
        'points',
        'achievements',
        'user_achievements',
        'chat_messages',
        'users'
    ]
    
    try:
        with engine.connect() as conn:
            for table in tables:
                # Verificar si las columnas ya existen
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = '{table}' AND column_name IN ('created_at', 'updated_at')
                """))
                
                existing_columns = [row[0] for row in result.fetchall()]
                
                if 'created_at' not in existing_columns:
                    conn.execute(text(f"""
                        ALTER TABLE {table} 
                        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    """))
                    logger.info(f"✅ Columna created_at agregada a tabla {table}")
                
                if 'updated_at' not in existing_columns:
                    conn.execute(text(f"""
                        ALTER TABLE {table} 
                        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    """))
                    logger.info(f"✅ Columna updated_at agregada a tabla {table}")
                
                # Crear trigger para updated_at
                trigger_name = f"update_{table}_updated_at"
                conn.execute(text(f"""
                    CREATE OR REPLACE FUNCTION update_updated_at_column()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        NEW.updated_at = CURRENT_TIMESTAMP;
                        RETURN NEW;
                    END;
                    $$ language 'plpgsql';
                """))
                
                conn.execute(text(f"""
                    DROP TRIGGER IF EXISTS {trigger_name} ON {table}
                """))
                
                conn.execute(text(f"""
                    CREATE TRIGGER {trigger_name}
                        BEFORE UPDATE ON {table}
                        FOR EACH ROW
                        EXECUTE FUNCTION update_updated_at_column();
                """))
                
                logger.info(f"✅ Trigger para updated_at creado en tabla {table}")
            
            conn.commit()
            
    except Exception as e:
        logger.error(f"❌ Error al agregar columnas de timestamp: {e}")
        raise

def update_existing_records():
    """Actualizar registros existentes para tener status = 1"""
    tables = [
        'roles',
        'memberships',
        'user_memberships',
        'routines', 
        'user_routines',
        'points',
        'achievements',
        'user_achievements',
        'chat_messages',
        'users'
    ]
    
    try:
        with engine.connect() as conn:
            for table in tables:
                # Actualizar registros donde status es NULL
                result = conn.execute(text(f"""
                    UPDATE {table} 
                    SET status = 1 
                    WHERE status IS NULL
                """))
                
                logger.info(f"✅ Registros actualizados en tabla {table}: {result.rowcount}")
            
            conn.commit()
            
    except Exception as e:
        logger.error(f"❌ Error al actualizar registros existentes: {e}")
        raise

def main():
    """Ejecutar migración completa"""
    logger.info("🚀 Iniciando migración de auditoría...")
    
    try:
        # 1. Crear tabla de auditoría
        logger.info("📋 Creando tabla de auditoría...")
        create_audit_table()
        
        # 2. Agregar columnas status
        logger.info("📋 Agregando columnas status...")
        add_status_columns()
        
        # 3. Agregar columnas de timestamp
        logger.info("📋 Agregando columnas de timestamp...")
        add_timestamp_columns()
        
        # 4. Actualizar registros existentes
        logger.info("📋 Actualizando registros existentes...")
        update_existing_records()
        
        logger.info("✅ Migración completada exitosamente")
        
    except Exception as e:
        logger.error(f"❌ Error en la migración: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 