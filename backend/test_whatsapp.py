#!/usr/bin/env python3
"""
Script de prueba para el servicio de WhatsApp
"""

import asyncio
import sys
import os
import pywhatkit as pwk
from datetime import datetime

# Agregar el directorio actual al path para importar módulos
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.whatsapp_service import initialize_whatsapp, send_welcome_message, send_whatsapp_message

async def test_whatsapp_service():
    """Prueba el servicio de WhatsApp"""
    print("🧪 === PRUEBA DEL SERVICIO DE WHATSAPP ===")
    
    try:
        # 1. Inicializar el servicio
        print("\n1. Inicializando servicio de WhatsApp...")
        success = await initialize_whatsapp()
        
        if not success:
            print("❌ Error al inicializar WhatsApp")
            return
        
        print("✅ WhatsApp inicializado correctamente")
        
        # 2. Probar envío de mensaje de bienvenida
        print("\n2. Probando envío de mensaje de bienvenida...")
        test_phone = "+593983154886"  # Número destino para Ecuador
        test_name = "Usuario de Prueba"
        
        success = await send_welcome_message(test_phone, test_name)
        
        if success:
            print(f"✅ Mensaje de bienvenida enviado exitosamente a {test_name}")
        else:
            print(f"❌ Error al enviar mensaje de bienvenida a {test_name}")
        
        # 3. Probar envío de mensaje personalizado
        print("\n3. Probando envío de mensaje personalizado...")
        custom_message = "Este es un mensaje de prueba desde MF-Lifting App! 🏋️‍♂️"
        
        success = await send_whatsapp_message(test_phone, custom_message)
        
        if success:
            print(f"✅ Mensaje personalizado enviado exitosamente")
        else:
            print(f"❌ Error al enviar mensaje personalizado")
        
        print("\n🎉 Pruebas completadas!")
        
    except Exception as e:
        print(f"❌ Error durante las pruebas: {e}")
        import traceback
        traceback.print_exc()

def test_pywhatkit_direct():
    """Prueba directa de pywhatkit"""
    print("\n🧪 === PRUEBA DIRECTA DE PYWHATKIT ===")
    
    try:
        test_phone = "+593983154886"  # Número destino para Ecuador
        test_message = "¡Hola! Este es un mensaje de prueba desde pywhatkit 🚀"
        
        print(f"Enviando mensaje a {test_phone}...")
        print("⚠️  IMPORTANTE: Asegúrate de estar conectado a WhatsApp Web")
        print("   El navegador se abrirá automáticamente")
        
        # Enviar mensaje inmediatamente
        pwk.sendwhatmsg_instantly(
            phone_no=test_phone,
            message=test_message,
            wait_time=15,
            tab_close=True,
            close_time=3
        )
        
        print("✅ Mensaje enviado exitosamente")
        
    except Exception as e:
        if "Number not found" in str(e):
            print(f"❌ Error: El número {test_phone} no está registrado en WhatsApp")
        else:
            print(f"❌ Error: {e}")
            print("💡 Asegúrate de:")
            print("   - Estar conectado a WhatsApp Web con el número +593983409313")
            print("   - Tener un navegador instalado")
            print("   - Usar un número de teléfono válido")

def test_phone_format():
    """Prueba el formateo de números de teléfono"""
    print("\n📞 === PRUEBA DE FORMATEO DE TELÉFONOS ===")
    
    test_cases = [
        "0983154886",      # 10 dígitos (Ecuador)
        "593983154886",    # 12 dígitos con código de país
        "+593 983 154 886", # Con formato
        "(098) 315-4886",   # Con paréntesis y guiones
        "098-315-4886",     # Con guiones
        "098.315.4886",     # Con puntos
    ]
    
    for phone in test_cases:
        clean_phone = ''.join(filter(str.isdigit, phone))
        
        if len(clean_phone) == 10:
            formatted_phone = f"+593{clean_phone[1:]}"  # Quitar el 0 inicial y agregar +593
        elif len(clean_phone) == 12 and clean_phone.startswith('593'):
            formatted_phone = f"+{clean_phone}"
        else:
            formatted_phone = "Formato no reconocido"
        
        print(f"Original: {phone:20} → Limpio: {clean_phone:12} → Formateado: {formatted_phone}")

if __name__ == "__main__":
    print("🚀 Iniciando pruebas de WhatsApp...")
    
    # Probar formateo de teléfonos
    test_phone_format()
    
    # Probar pywhatkit directamente
    test_pywhatkit_direct()
    
    # Probar servicio de WhatsApp
    print(f"\n📱 Número de prueba proporcionado: +593983154886")
    asyncio.run(test_whatsapp_service())