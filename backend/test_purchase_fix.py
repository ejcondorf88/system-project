#!/usr/bin/env python3
"""
Script de prueba para verificar el sistema de compras
"""

import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def test_purchase_system():
    """Prueba el sistema completo de compras"""
    print("=== PRUEBA DEL SISTEMA DE COMPRAS ===")
    
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
        print(f"Puntos actuales: {user.get('points', 0)}")
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        
        # 2. Obtener premios disponibles
        print("\n2. Obteniendo premios disponibles...")
        prizes_response = requests.get(f"{BASE_URL}/marketplace/prizes", headers=headers)
        
        if prizes_response.status_code != 200:
            print(f"❌ Error al obtener premios: {prizes_response.status_code}")
            return
        
        prizes = prizes_response.json()
        print(f"✅ Premios obtenidos: {len(prizes)}")
        
        if len(prizes) == 0:
            print("❌ No hay premios disponibles para probar")
            return
        
        # 3. Mostrar premios disponibles
        print("\n3. Premios disponibles:")
        for prize in prizes:
            print(f"   - {prize['name']}: {prize['points_cost']} puntos (Stock: {prize['stock']})")
        
        # 4. Intentar comprar el primer premio disponible
        prize = prizes[0]  # Usar el primer premio
        print(f"\n4. Intentando comprar: {prize['name']} ({prize['points_cost']} puntos)")
        
        purchase_data = {
            "prize_id": prize['id'],
            "shipping_address": "+593 97 919 5720"
        }
        
        print(f"Datos de compra: {purchase_data}")
        
        purchase_response = requests.post(
            f"{BASE_URL}/marketplace/purchase",
            json=purchase_data,
            headers=headers
        )
        
        print(f"Status Code: {purchase_response.status_code}")
        print(f"Response: {purchase_response.text}")
        
        if purchase_response.status_code == 200:
            purchase_result = purchase_response.json()
            print("✅ Compra exitosa!")
            print(f"   ID de compra: {purchase_result.get('id')}")
            print(f"   Puntos gastados: {purchase_result.get('points_spent')}")
            print(f"   Estado: {purchase_result.get('status')}")
            
            # 5. Verificar que los puntos se actualizaron
            print("\n5. Verificando actualización de puntos...")
            user_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if user_response.status_code == 200:
                updated_user = user_response.json()
                print(f"✅ Puntos actualizados: {updated_user.get('points', 0)}")
                print(f"   Puntos anteriores: {user.get('points', 0)}")
                print(f"   Diferencia: {user.get('points', 0) - updated_user.get('points', 0)}")
                
                if user.get('points', 0) - updated_user.get('points', 0) == prize['points_cost']:
                    print("✅ Los puntos se descontaron correctamente!")
                else:
                    print("❌ Los puntos no se descontaron correctamente")
            else:
                print(f"❌ Error al verificar puntos: {user_response.status_code}")
            
            # 6. Verificar que el stock se actualizó
            print("\n6. Verificando actualización de stock...")
            updated_prizes_response = requests.get(f"{BASE_URL}/marketplace/prizes", headers=headers)
            
            if updated_prizes_response.status_code == 200:
                updated_prizes = updated_prizes_response.json()
                updated_prize = next((p for p in updated_prizes if p['id'] == prize['id']), None)
                
                if updated_prize:
                    print(f"✅ Stock actualizado: {updated_prize['stock']}")
                    print(f"   Stock anterior: {prize['stock']}")
                    print(f"   Diferencia: {prize['stock'] - updated_prize['stock']}")
                    
                    if prize['stock'] - updated_prize['stock'] == 1:
                        print("✅ El stock se redujo correctamente!")
                    else:
                        print("❌ El stock no se redujo correctamente")
                else:
                    print("❌ No se pudo encontrar el premio actualizado")
            else:
                print(f"❌ Error al verificar stock: {updated_prizes_response.status_code}")
            
            # 7. Verificar las compras del usuario
            print("\n7. Verificando compras del usuario...")
            purchases_response = requests.get(f"{BASE_URL}/marketplace/purchases/my", headers=headers)
            
            if purchases_response.status_code == 200:
                purchases = purchases_response.json()
                print(f"✅ Compras del usuario: {len(purchases)}")
                
                if len(purchases) > 0:
                    latest_purchase = purchases[-1]
                    print(f"   Última compra: {latest_purchase.get('prize', {}).get('name')}")
                    print(f"   Puntos gastados: {latest_purchase.get('points_spent')}")
                    print(f"   Estado: {latest_purchase.get('status')}")
                else:
                    print("❌ No se encontraron compras")
            else:
                print(f"❌ Error al obtener compras: {purchases_response.status_code}")
                
        else:
            print("❌ Compra falló")
            if purchase_response.status_code == 422:
                print("   Error de validación - verificar esquema de datos")
            elif purchase_response.status_code == 400:
                print("   Error de negocio - verificar puntos o stock")
            else:
                print("   Error desconocido")
        
        print("\n🎉 Prueba completada!")
        
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_purchase_system() 