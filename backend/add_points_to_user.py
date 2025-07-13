import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def add_points_to_user():
    """Agrega puntos a un usuario de prueba"""
    print("=== AGREGANDO PUNTOS A USUARIO ===")
    
    # Datos de login para superusuario
    login_data = {
        "username": "admin",  # Cambiar por el usuario superusuario real
        "password": "admin123"  # Cambiar por la contraseña real
    }
    
    try:
        # 1. Login como superusuario
        print("1. Haciendo login como superusuario...")
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
        
        if not user.get('is_superuser'):
            print("❌ El usuario no es superusuario")
            return
        
        print(f"✅ Login exitoso como superusuario: {user.get('username')}")
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        
        # 2. Obtener lista de usuarios
        print("\n2. Obteniendo lista de usuarios...")
        users_response = requests.get(f"{BASE_URL}/users", headers=headers)
        
        if users_response.status_code != 200:
            print(f"❌ Error al obtener usuarios: {users_response.status_code}")
            return
        
        users = users_response.json()
        print(f"✅ Usuarios encontrados: {len(users)}")
        
        # Mostrar usuarios disponibles
        for i, u in enumerate(users[:5]):  # Solo mostrar los primeros 5
            print(f"   {i+1}. {u.get('username', 'N/A')} - Puntos: {u.get('points', 0)} - ID: {u.get('id')}")
        
        # 3. Seleccionar usuario para agregar puntos
        target_user_id = None
        target_username = "ejcondorf"  # Cambiar por el usuario que quieres modificar
        
        for u in users:
            if u.get('username') == target_username:
                target_user_id = u.get('id')
                break
        
        if not target_user_id:
            print(f"❌ Usuario '{target_username}' no encontrado")
            return
        
        print(f"\n3. Agregando puntos al usuario: {target_username} (ID: {target_user_id})")
        
        # 4. Agregar puntos
        points_data = {
            "user_id": target_user_id,
            "amount": 2000,  # Agregar 2000 puntos
            "reason": "Puntos de prueba para testing del sistema de compras"
        }
        
        points_response = requests.post(
            f"{BASE_URL}/users/assign-points",
            json=points_data,
            headers=headers
        )
        
        if points_response.status_code == 200:
            result = points_response.json()
            print("✅ Puntos agregados exitosamente!")
            print(f"   Puntos agregados: {result.get('amount')}")
            print(f"   Nuevo total: {result.get('new_total')}")
            print(f"   Razón: {result.get('reason')}")
        else:
            print(f"❌ Error al agregar puntos: {points_response.status_code}")
            print(f"Response: {points_response.text}")
        
        # 5. Verificar el usuario actualizado
        print("\n4. Verificando usuario actualizado...")
        user_response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        
        if user_response.status_code == 200:
            updated_user = user_response.json()
            print(f"✅ Usuario actualizado:")
            print(f"   Username: {updated_user.get('username')}")
            print(f"   Puntos actuales: {updated_user.get('points')}")
        else:
            print(f"❌ Error al obtener usuario actualizado: {user_response.status_code}")
        
        print("\n=== PUNTOS AGREGADOS ===")
        print(f"El usuario '{target_username}' ahora tiene suficientes puntos para probar las compras.")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    add_points_to_user() 