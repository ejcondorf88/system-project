#!/usr/bin/env python3
"""
Script de instalación simplificado para WhatsApp Integration
"""

import subprocess
import sys
import os

def install_pywhatkit():
    """Instala pywhatkit"""
    print("📦 Instalando pywhatkit...")
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", "pywhatkit==5.4.3"
        ], check=True)
        print("✅ pywhatkit instalado correctamente")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al instalar pywhatkit: {e}")
        return False

def test_import():
    """Prueba la importación de pywhatkit"""
    print("🧪 Probando importación...")
    try:
        import pywhatkit
        print("✅ pywhatkit importado correctamente")
        return True
    except ImportError as e:
        print(f"❌ Error de importación: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Instalación de WhatsApp Integration")
    print("=" * 50)
    
    # Instalar pywhatkit
    if not install_pywhatkit():
        print("❌ Instalación fallida")
        sys.exit(1)
    
    # Probar importación
    if not test_import():
        print("❌ Error en la importación")
        sys.exit(1)
    
    print("\n🎉 ¡Instalación completada!")
    print("\n📋 Próximos pasos:")
    print("1. Asegúrate de estar conectado a WhatsApp Web")
    print("2. Ejecuta la aplicación: python main.py")
    print("3. Prueba el servicio: python test_whatsapp.py")
    print("\n📚 Documentación: README_WHATSAPP.md")

if __name__ == "__main__":
    main() 