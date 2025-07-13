#!/usr/bin/env python3
"""
Script de prueba para verificar las notificaciones de WhatsApp en compras
"""

import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def test_whatsapp_purchase_notification():
    """Prueba las notificaciones de WhatsApp para compras"""
    print("=== PRUEBA DE NOTIFICACIONES DE WHATSAPP EN COMPRAS ===")
    
    # Datos de prueba
    login_data = {
        "username": "ejcondorf",
        "password": "testpass123"
    }
    
    try:
        # 1. Login para obtener token
        print("1. Haciendo login...")
        login_response = requests.post(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if login_response.status_code != 200:
            print(f"❌ Error en login: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return
        
        login_result = login_response.json()
        token = login_result.get('access_token')
        user = login_result.get('user')
        
        print(f"✅ Login exitoso para usuario: {user.get('username')}")
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        
        # 2. Obtener compras del sistema
        print("\n2. Obteniendo compras del sistema...")
        purchases_response = requests.get(f"{BASE_URL}/marketplace/purchases/all", headers=headers)
        
        if purchases_response.status_code != 200:
            print(f"❌ Error al obtener compras: {purchases_response.status_code}")
            return
        
        purchases = purchases_response.json()
        print(f"✅ Compras obtenidas: {len(purchases)}")
        
        if len(purchases) == 0:
            print("❌ No hay compras disponibles para probar")
            return
        
        # 3. Mostrar compras disponibles
        print("\n3. Compras disponibles:")
        for i, purchase in enumerate(purchases):
            print(f"   {i+1}. Compra #{purchase['id']} - {purchase['prize']['name']}")
            print(f"      Usuario: {purchase.get('user', {}).get('username', 'N/A')}")
            print(f"      Teléfono: {purchase.get('user', {}).get('phone', 'N/A')}")
            print(f"      Estado: {purchase['status']}")
            print()
        
        # 4. Probar notificación de WhatsApp con la primera compra
        purchase = purchases[0]
        print(f"4. Probando notificación de WhatsApp para compra #{purchase['id']}")
        
        # Obtener teléfono del usuario
        phone = purchase.get('user', {}).get('phone', '')
        if not phone:
            print("❌ No hay teléfono disponible para esta compra")
            return
        
        print(f"   Teléfono: {phone}")
        print(f"   Estado: {purchase['status']}")
        
        # Datos de la notificación
        notification_data = {
            "phone": phone,
            "purchaseData": purchase,
            "customMessage": "¡Gracias por tu compra! Esperamos que disfrutes tu premio."
        }
        
        print(f"Datos de notificación: {json.dumps(notification_data, indent=2)}")
        
        # 5. Enviar notificación de WhatsApp
        print("\n5. Enviando notificación de WhatsApp...")
        whatsapp_response = requests.post(
            f"{BASE_URL}/whatsapp/send-purchase-notification",
            json=notification_data,
            headers=headers
        )
        
        print(f"Status Code: {whatsapp_response.status_code}")
        print(f"Response: {whatsapp_response.text}")
        
        if whatsapp_response.status_code == 200:
            result = whatsapp_response.json()
            print("✅ Notificación de WhatsApp enviada exitosamente!")
            print(f"   Mensaje: {result.get('message')}")
            print(f"   Teléfono: {result.get('phone')}")
            print(f"   Estado: {result.get('status')}")
        else:
            print("❌ Error al enviar notificación de WhatsApp")
            if whatsapp_response.status_code == 422:
                print("   Error de validación - verificar datos")
            elif whatsapp_response.status_code == 500:
                print("   Error interno del servidor")
            else:
                print("   Error desconocido")
        
        print("\n🎉 Prueba completada!")
        
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_whatsapp_purchase_notification() 