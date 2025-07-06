import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def test_chat_with_user():
    """Prueba el chat con un usuario específico"""
    print("=== PRUEBA DE CHAT CON USUARIO ===")
    
    # Primero hacer login para obtener token
    login_data = {
        "username": "ejcondorf",
        "password": "testpass123"
    }
    
    try:
        # Login
        print("1. Haciendo login...")
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
            print(f"   User ID: {user.get('id')}")
            print(f"   Token: {token[:20]}...")
            
            # Probar chat con diferentes mensajes
            test_messages = [
                "Hola, ¿cómo estás?",
                "¿Qué ejercicios me recomiendas para cardio?",
                "Necesito una rutina para aumentar masa muscular",
                "¿Cuál es la mejor dieta para fitness?"
            ]
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
            
            for i, message in enumerate(test_messages, 1):
                print(f"\n{i}. Probando mensaje: '{message}'")
                
                chat_data = {
                    "message": message,
                    "user_id": user.get('id'),
                    "timestamp": "2025-01-06T12:00:00Z"
                }
                
                chat_response = requests.post(
                    f"{BASE_URL}/chat/send",
                    json=chat_data,
                    headers=headers
                )
                
                print(f"   Status Code: {chat_response.status_code}")
                
                if chat_response.status_code == 200:
                    data = chat_response.json()
                    print(f"   ✅ Respuesta: {data.get('message', 'No message')[:100]}...")
                    print(f"   Message ID: {data.get('message_id', 'No ID')}")
                else:
                    print(f"   ❌ Error: {chat_response.text}")
                    
        else:
            print(f"❌ Error en login: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_chat_without_auth():
    """Prueba el chat sin autenticación"""
    print("\n=== PRUEBA DE CHAT SIN AUTENTICACIÓN ===")
    
    chat_data = {
        "message": "Hola, ¿cómo estás?",
        "user_id": 2,
        "timestamp": "2025-01-06T12:00:00Z"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat/send",
            json=chat_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Chat sin autenticación funcionando!")
            print(f"Respuesta: {data.get('message', 'No message')}")
        else:
            print("❌ Error en chat sin autenticación")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_chat_with_user()
    test_chat_without_auth() 