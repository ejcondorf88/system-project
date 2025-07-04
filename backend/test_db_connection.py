#!/usr/bin/env python3
"""
Script para probar la conexión a la base de datos
"""

import sys
import os

# Agregar el directorio actual al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database.database import engine, SessionLocal
from config.settings import settings

def test_connection():
    """Prueba la conexión a la base de datos"""
    print("🔍 Probando conexión a la base de datos...")
    print(f"URL: {settings.DATABASE_URL}")
    
    try:
        # Probar conexión básica
        with engine.connect() as connection:
            print("✅ Conexión básica exitosa")
            
            # Probar consulta simple
            result = connection.execute(text("SELECT 1"))
            print("✅ Consulta de prueba exitosa")
            
            # Obtener información de la base de datos
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Versión de PostgreSQL: {version}")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        print("\n🔧 Posibles soluciones:")
        print("1. Verifica que las credenciales sean correctas")
        print("2. Asegúrate de que el proyecto de Supabase esté activo")
        print("3. Verifica que la IP esté en la lista blanca de Supabase")
        print("4. Revisa la documentación de Supabase para obtener las credenciales correctas")
        return False
    
    return True

def test_session():
    """Prueba la creación de sesiones"""
    print("\n🔍 Probando creación de sesiones...")
    
    try:
        db = SessionLocal()
        print("✅ Sesión creada exitosamente")
        
        # Probar consulta con sesión
        result = db.execute(text("SELECT current_database()"))
        db_name = result.fetchone()[0]
        print(f"✅ Base de datos actual: {db_name}")
        
        db.close()
        print("✅ Sesión cerrada correctamente")
        
    except Exception as e:
        print(f"❌ Error con sesión: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("=" * 50)
    print("DIAGNÓSTICO DE CONEXIÓN A BASE DE DATOS")
    print("=" * 50)
    
    # Probar conexión
    connection_ok = test_connection()
    
    if connection_ok:
        # Probar sesiones
        session_ok = test_session()
        
        if session_ok:
            print("\n🎉 ¡Todas las pruebas pasaron! La base de datos está configurada correctamente.")
        else:
            print("\n⚠️ Hay problemas con las sesiones de la base de datos.")
    else:
        print("\n❌ No se pudo conectar a la base de datos.")
    
    print("\n" + "=" * 50) 