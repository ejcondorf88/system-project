import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def test_login():
    """Prueba el endpoint de login"""
    print("=== PRUEBA DE LOGIN ===")
    
    # Datos de prueba
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        # Crear FormData para enviar los datos
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login exitoso!")
            print(f"Token: {data.get('access_token', 'No token')}")
            print(f"User: {data.get('user', {}).get('username', 'No user')}")
        else:
            print("❌ Login falló")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_register():
    """Prueba el endpoint de registro"""
    print("\n=== PRUEBA DE REGISTRO ===")
    
    # Datos de prueba
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "phone": "123456789",
        "password": "testpass123",
        "confirmPassword": "testpass123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=register_data
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Registro exitoso!")
            print(f"Token: {data.get('access_token', 'No token')}")
            print(f"User: {data.get('user', {}).get('username', 'No user')}")
        else:
            print("❌ Registro falló")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Primero intentar registrar un usuario
    test_register()
    
    # Luego intentar hacer login
    test_login() 