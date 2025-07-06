import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def test_complete_auth_flow():
    """Prueba el flujo completo de autenticación"""
    print("=== PRUEBA COMPLETA DEL SISTEMA DE AUTENTICACIÓN ===")
    
    # 1. Registrar un usuario
    print("\n1. Registrando usuario...")
    register_data = {
        "username": "testuser_auth",
        "email": "test_auth@example.com",
        "phone": "123456789",
        "password": "testpass123",
        "confirmPassword": "testpass123"
    }
    
    try:
        register_response = requests.post(
            f"{BASE_URL}/auth/register",
            json=register_data
        )
        
        if register_response.status_code == 200:
            register_result = register_response.json()
            print("✅ Registro exitoso!")
            print(f"   - Token: {register_result.get('access_token', 'No token')[:20]}...")
            print(f"   - Usuario: {register_result.get('user', {}).get('username', 'No user')}")
            
            # Guardar token para pruebas posteriores
            token = register_result.get('access_token')
            
            # 2. Probar endpoint /me
            print("\n2. Probando endpoint /me...")
            headers = {'Authorization': f'Bearer {token}'}
            me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if me_response.status_code == 200:
                me_result = me_response.json()
                print("✅ Endpoint /me exitoso!")
                print(f"   - Usuario: {me_result.get('username')}")
                print(f"   - Email: {me_result.get('email')}")
                print(f"   - Level: {me_result.get('level')}")
                print(f"   - Points: {me_result.get('points')}")
            else:
                print(f"❌ Error en /me: {me_response.status_code}")
                print(f"   Response: {me_response.text}")
            
            # 3. Probar login
            print("\n3. Probando login...")
            login_data = {
                "username": "testuser_auth",
                "password": "testpass123"
            }
            
            login_response = requests.post(
                f"{BASE_URL}/auth/login",
                data=login_data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            
            if login_response.status_code == 200:
                login_result = login_response.json()
                print("✅ Login exitoso!")
                print(f"   - Token: {login_result.get('access_token', 'No token')[:20]}...")
                print(f"   - Usuario: {login_result.get('user', {}).get('username', 'No user')}")
            else:
                print(f"❌ Error en login: {login_response.status_code}")
                print(f"   Response: {login_response.text}")
                
        else:
            print(f"❌ Error en registro: {register_response.status_code}")
            print(f"   Response: {register_response.text}")
            
    except Exception as e:
        print(f"❌ Error general: {e}")

def test_invalid_credentials():
    """Prueba credenciales inválidas"""
    print("\n=== PRUEBA DE CREDENCIALES INVÁLIDAS ===")
    
    # Login con credenciales incorrectas
    login_data = {
        "username": "usuario_inexistente",
        "password": "password_incorrecto"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if response.status_code == 401:
            print("✅ Error de autenticación manejado correctamente")
            print(f"   - Status: {response.status_code}")
            print(f"   - Detail: {response.json().get('detail', 'No detail')}")
        else:
            print(f"❌ Error inesperado: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_complete_auth_flow()
    test_invalid_credentials() 