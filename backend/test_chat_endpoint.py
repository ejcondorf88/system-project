import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def test_chat_endpoint():
    """Prueba el endpoint de chat"""
    print("=== PRUEBA DEL ENDPOINT DE CHAT ===")
    
    # Datos de prueba
    chat_data = {
        "message": "Hola, ¿cómo estás?",
        "user_id": 2,
        "timestamp": "2025-01-06T12:00:00Z"
    }
    
    try:
        print("Enviando mensaje de prueba...")
        print(f"Datos: {chat_data}")
        
        response = requests.post(
            f"{BASE_URL}/chat/send",
            json=chat_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Chat endpoint funcionando!")
            print(f"Mensaje de respuesta: {data.get('message', 'No message')}")
            print(f"Timestamp: {data.get('timestamp', 'No timestamp')}")
            print(f"Message ID: {data.get('message_id', 'No message_id')}")
        else:
            print("❌ Error en chat endpoint")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_chat_with_auth():
    """Prueba el endpoint de chat con autenticación"""
    print("\n=== PRUEBA DEL CHAT CON AUTENTICACIÓN ===")
    
    # Primero hacer login para obtener token
    login_data = {
        "username": "ejcondorf",
        "password": "testpass123"
    }
    
    try:
        # Login
        login_response = requests.post(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            token = login_result.get('access_token')
            user = login_result.get('user')
            
            print(f"✅ Login exitoso para usuario: {user.get('username')}")
            print(f"Token: {token[:20]}...")
            
            # Ahora probar chat con token
            chat_data = {
                "message": "Hola, ¿puedes ayudarme con una rutina de ejercicio?",
                "user_id": user.get('id'),
                "timestamp": "2025-01-06T12:00:00Z"
            }
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
            
            chat_response = requests.post(
                f"{BASE_URL}/chat/send",
                json=chat_data,
                headers=headers
            )
            
            print(f"Chat Status Code: {chat_response.status_code}")
            print(f"Chat Response: {chat_response.text}")
            
            if chat_response.status_code == 200:
                data = chat_response.json()
                print("✅ Chat con autenticación funcionando!")
                print(f"Respuesta: {data.get('message', 'No message')}")
            else:
                print("❌ Error en chat con autenticación")
                
        else:
            print(f"❌ Error en login: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_chat_endpoint()
    test_chat_with_auth() 