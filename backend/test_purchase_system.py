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
        
        # Mostrar premios disponibles
        for i, prize in enumerate(prizes[:3]):  # Solo mostrar los primeros 3
            print(f"   {i+1}. {prize['name']} - {prize['points_cost']} puntos - Stock: {prize['stock']}")
        
        # 3. Obtener compras actuales del usuario
        print("\n3. Obteniendo compras actuales del usuario...")
        purchases_response = requests.get(f"{BASE_URL}/marketplace/purchases/my", headers=headers)
        
        if purchases_response.status_code == 200:
            purchases = purchases_response.json()
            print(f"✅ Compras actuales: {len(purchases)}")
        else:
            print(f"❌ Error al obtener compras: {purchases_response.status_code}")
        
        # 4. Intentar comprar un premio
        if len(prizes) > 0:
            prize = prizes[0]  # Usar el primer premio
            print(f"\n4. Intentando comprar: {prize['name']} ({prize['points_cost']} puntos)")
            
            purchase_data = {
                "prize_id": prize['id'],
                "shipping_address": "Dirección de prueba"
            }
            
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
                user_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
                
                if user_response.status_code == 200:
                    updated_user = user_response.json()
                    new_points = updated_user.get('points', 0)
                    old_points = user.get('points', 0)
                    points_spent = prize['points_cost']
                    
                    print(f"   Puntos antes: {old_points}")
                    print(f"   Puntos después: {new_points}")
                    print(f"   Puntos gastados: {points_spent}")
                    print(f"   Diferencia esperada: {old_points - points_spent}")
                    
                    if new_points == (old_points - points_spent):
                        print("✅ Los puntos se actualizaron correctamente!")
                    else:
                        print("❌ Los puntos no se actualizaron correctamente")
                else:
                    print(f"❌ Error al obtener usuario actualizado: {user_response.status_code}")
                
                # 6. Verificar que la compra aparece en la lista
                print("\n6. Verificando que la compra aparece en la lista...")
                purchases_response = requests.get(f"{BASE_URL}/marketplace/purchases/my", headers=headers)
                
                if purchases_response.status_code == 200:
                    updated_purchases = purchases_response.json()
                    print(f"✅ Compras después de la compra: {len(updated_purchases)}")
                    
                    # Buscar la compra recién creada
                    new_purchase = None
                    for p in updated_purchases:
                        if p.get('prize_id') == prize['id'] and p.get('points_spent') == prize['points_cost']:
                            new_purchase = p
                            break
                    
                    if new_purchase:
                        print("✅ La compra aparece en la lista del usuario!")
                    else:
                        print("❌ La compra no aparece en la lista del usuario")
                else:
                    print(f"❌ Error al obtener compras actualizadas: {purchases_response.status_code}")
                
                # 7. Verificar que el stock se actualizó
                print("\n7. Verificando actualización del stock...")
                prizes_response = requests.get(f"{BASE_URL}/marketplace/prizes", headers=headers)
                
                if prizes_response.status_code == 200:
                    updated_prizes = prizes_response.json()
                    updated_prize = None
                    for p in updated_prizes:
                        if p['id'] == prize['id']:
                            updated_prize = p
                            break
                    
                    if updated_prize:
                        old_stock = prize['stock']
                        new_stock = updated_prize['stock']
                        print(f"   Stock antes: {old_stock}")
                        print(f"   Stock después: {new_stock}")
                        
                        if new_stock == (old_stock - 1):
                            print("✅ El stock se actualizó correctamente!")
                        else:
                            print("❌ El stock no se actualizó correctamente")
                    else:
                        print("❌ No se pudo encontrar el premio actualizado")
                else:
                    print(f"❌ Error al obtener premios actualizados: {prizes_response.status_code}")
                
            else:
                print("❌ Error en la compra")
                print(f"   Error: {purchase_response.text}")
        
        # 8. Verificar compras en el CRM (solo si es superusuario)
        if user.get('is_superuser'):
            print("\n8. Verificando compras en el CRM...")
            all_purchases_response = requests.get(f"{BASE_URL}/marketplace/purchases/all", headers=headers)
            
            if all_purchases_response.status_code == 200:
                all_purchases = all_purchases_response.json()
                print(f"✅ Total de compras en el sistema: {len(all_purchases)}")
                
                # Buscar la compra recién creada
                recent_purchase = None
                for p in all_purchases:
                    if p.get('user_id') == user.get('id') and p.get('prize_id') == prize['id']:
                        recent_purchase = p
                        break
                
                if recent_purchase:
                    print("✅ La compra aparece en el CRM!")
                else:
                    print("❌ La compra no aparece en el CRM")
            else:
                print(f"❌ Error al obtener todas las compras: {all_purchases_response.status_code}")
        else:
            print("\n8. Usuario no es superusuario, saltando verificación del CRM")
        
        print("\n=== PRUEBA COMPLETADA ===")
        
    except Exception as e:
        print(f"❌ Error en la prueba: {e}")

if __name__ == "__main__":
    test_purchase_system() 