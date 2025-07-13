#!/usr/bin/env python3
"""
Script de configuración para WhatsApp Integration
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_banner():
    """Imprime el banner de bienvenida"""
    print("=" * 60)
    print("🚀 CONFIGURACIÓN DE WHATSAPP INTEGRATION")
    print("   MF-Lifting App")
    print("=" * 60)

def check_python_version():
    """Verifica la versión de Python"""
    print("\n🐍 Verificando versión de Python...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Se requiere Python 3.8 o superior")
        print(f"   Versión actual: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
    return True

def install_dependencies():
    """Instala las dependencias necesarias"""
    print("\n📦 Instalando dependencias...")
    try:
        # Instalar pywhatkit
        subprocess.run([
            sys.executable, "-m", "pip", "install", "pywhatkit==5.4.3"
        ], check=True, capture_output=True)
        print("✅ pywhatkit instalado")
        
        # Verificar otras dependencias
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requerimients.txt"
        ], check=True, capture_output=True)
        print("✅ Todas las dependencias instaladas")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al instalar dependencias: {e}")
        return False

def create_directories():
    """Crea los directorios necesarios"""
    print("\n📁 Creando directorios...")
    directories = [
        "whatsapp_session",
        "logs"
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Directorio {directory} creado")

def create_env_file():
    """Crea archivo .env si no existe"""
    print("\n⚙️ Configurando variables de entorno...")
    env_file = Path(".env")
    
    if not env_file.exists():
        env_content = """# Configuración de WhatsApp
WHATSAPP_ENABLED=true
WHATSAPP_SESSION_DIR=./whatsapp_session
WHATSAPP_COUNTRY_CODE=52

# Configuración de la aplicación
DATABASE_URL=postgresql://postgres.ooxpguxxhembfoefgrfv:Pigo0173!@aws-0-us-east-2.pooler.supabase.com:6543/postgres
SECRET_KEY=tu_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
"""
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ Archivo .env creado")
    else:
        print("✅ Archivo .env ya existe")

def test_imports():
    """Prueba las importaciones necesarias"""
    print("\n🧪 Probando importaciones...")
    try:
        import pywhatkit
        print("✅ pywhatkit importado correctamente")
        
        from services.whatsapp_service import WhatsAppService
        print("✅ Servicio de WhatsApp importado correctamente")
        
        return True
        
    except ImportError as e:
        print(f"❌ Error de importación: {e}")
        return False

def show_next_steps():
    """Muestra los siguientes pasos"""
    print("\n" + "=" * 60)
    print("🎉 CONFIGURACIÓN COMPLETADA")
    print("=" * 60)
    print("\n📋 Próximos pasos:")
    print("1. Ejecuta la aplicación:")
    print("   python main.py")
    print("\n2. Escanea el código QR que aparecerá en la consola")
    print("   con tu WhatsApp")
    print("\n3. Prueba el servicio:")
    print("   python test_whatsapp.py")
    print("\n4. Verifica el estado:")
    print("   curl -X GET http://localhost:8080/api/whatsapp/status")
    print("\n📚 Documentación completa:")
    print("   README_WHATSAPP.md")
    print("\n" + "=" * 60)

def main():
    """Función principal"""
    print_banner()
    
    # Verificar versión de Python
    if not check_python_version():
        sys.exit(1)
    
    # Instalar dependencias
    if not install_dependencies():
        print("❌ Error en la instalación de dependencias")
        sys.exit(1)
    
    # Crear directorios
    create_directories()
    
    # Crear archivo .env
    create_env_file()
    
    # Probar importaciones
    if not test_imports():
        print("❌ Error en las importaciones")
        sys.exit(1)
    
    # Mostrar siguientes pasos
    show_next_steps()

if __name__ == "__main__":
    main() 