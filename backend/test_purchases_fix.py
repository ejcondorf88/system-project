#!/usr/bin/env python3
"""
Script de prueba para verificar que el endpoint de compras funciona correctamente
"""

import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def test_purchases_endpoint():
    """Prueba el endpoint de compras"""
    print("=== PRUEBA DEL ENDPOINT DE COMPRAS ===")
    
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
        print(f"Es superusuario: {user.get('is_superuser')}")
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        
        # 2. Probar endpoint de compras
        print("\n2. Probando endpoint de compras...")
        purchases_response = requests.get(f"{BASE_URL}/marketplace/purchases/all", headers=headers)
        
        print(f"Status Code: {purchases_response.status_code}")
        
        if purchases_response.status_code == 200:
            purchases = purchases_response.json()
            print(f"✅ Compras obtenidas exitosamente: {len(purchases)}")
            
            # Mostrar información de las compras
            for i, purchase in enumerate(purchases):
                print(f"\n   Compra #{purchase['id']}:")
                print(f"      Premio: {purchase['prize']['name']}")
                print(f"      Usuario: {purchase.get('user', {}).get('username', 'N/A')}")
                print(f"      Teléfono: {purchase.get('user', {}).get('phone', 'N/A')}")
                print(f"      Estado: {purchase['status']}")
                print(f"      Puntos: {purchase['points_spent']}")
                
                # Verificar que no hay errores en los datos del usuario
                user_data = purchase.get('user', {})
                if 'achievements' in user_data:
                    print(f"      ⚠️  Campo achievements encontrado: {type(user_data['achievements'])}")
                else:
                    print(f"      ✅ Campo achievements no presente (correcto)")
                    
        else:
            print(f"❌ Error al obtener compras: {purchases_response.status_code}")
            print(f"Response: {purchases_response.text}")
            
            # Si es error 500, mostrar más detalles
            if purchases_response.status_code == 500:
                try:
                    error_data = purchases_response.json()
                    print(f"Error details: {json.dumps(error_data, indent=2)}")
                except:
                    print("No se pudo parsear el error como JSON")
        
        print("\n🎉 Prueba completada!")
        
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_purchases_endpoint() 