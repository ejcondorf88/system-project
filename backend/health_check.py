#!/usr/bin/env python3
"""
Script de health check para el backend
"""

import requests
import sys
import time

def check_backend_health(url="http://localhost:8080"):
    """Verifica que el backend esté funcionando correctamente"""
    try:
        # Intentar conectar al endpoint de health check
        response = requests.get(f"{url}/", timeout=10)
        
        if response.status_code == 200:
            print("✅ Backend está funcionando correctamente")
            return True
        else:
            print(f"❌ Backend respondió con código {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend")
        return False
    except requests.exceptions.Timeout:
        print("❌ Timeout al conectar con el backend")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def check_database_connection():
    """Verifica la conexión a la base de datos"""
    try:
        from database.database import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Conexión a la base de datos exitosa")
            return True
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False

def main():
    """Función principal del health check"""
    print("🔍 Iniciando health check del backend...")
    
    # Verificar conexión a la base de datos
    db_ok = check_database_connection()
    
    # Verificar que el servidor esté funcionando
    server_ok = check_backend_health()
    
    if db_ok and server_ok:
        print("🎉 Todos los checks pasaron exitosamente")
        sys.exit(0)
    else:
        print("💥 Algunos checks fallaron")
        sys.exit(1)

if __name__ == "__main__":
    main() 