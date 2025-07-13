import requests
import json

# URL del backend
BASE_URL = "http://localhost:8080/api"

def create_test_prizes():
    """Crea premios de prueba en la base de datos"""
    print("=== CREANDO PREMIOS DE PRUEBA ===")
    
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
        
        # 2. Crear premios de prueba
        test_prizes = [
            {
                "name": "Proteína Whey Gold Standard",
                "description": "Proteína de suero de leche de alta calidad, 30g por porción",
                "image_url": "https://example.com/whey.jpg",
                "points_cost": 500,
                "stock": 10,
                "category": "suplementos"
            },
            {
                "name": "Cinturón de Levantamiento",
                "description": "Cinturón de cuero para levantamiento de pesas, ajustable",
                "image_url": "https://example.com/belt.jpg",
                "points_cost": 300,
                "stock": 5,
                "category": "equipamiento"
            },
            {
                "name": "Camiseta Deportiva Premium",
                "description": "Camiseta de algodón transpirable, perfecta para entrenar",
                "image_url": "https://example.com/shirt.jpg",
                "points_cost": 200,
                "stock": 15,
                "category": "ropa"
            },
            {
                "name": "Smartwatch Fitness",
                "description": "Reloj inteligente con GPS y monitor de frecuencia cardíaca",
                "image_url": "https://example.com/watch.jpg",
                "points_cost": 1000,
                "stock": 3,
                "category": "tecnología"
            },
            {
                "name": "Botella de Agua 1L",
                "description": "Botella de agua reutilizable con filtro integrado",
                "image_url": "https://example.com/bottle.jpg",
                "points_cost": 150,
                "stock": 20,
                "category": "accesorios"
            }
        ]
        
        print(f"\n2. Creando {len(test_prizes)} premios de prueba...")
        
        created_prizes = []
        for i, prize_data in enumerate(test_prizes, 1):
            print(f"   Creando premio {i}: {prize_data['name']}")
            
            response = requests.post(
                f"{BASE_URL}/marketplace/prizes",
                json=prize_data,
                headers=headers
            )
            
            if response.status_code == 200:
                created_prize = response.json()
                created_prizes.append(created_prize)
                print(f"   ✅ Creado: {created_prize['name']} (ID: {created_prize['id']})")
            else:
                print(f"   ❌ Error al crear {prize_data['name']}: {response.status_code}")
                print(f"   Response: {response.text}")
        
        # 3. Verificar que se crearon correctamente
        print(f"\n3. Verificando premios creados...")
        prizes_response = requests.get(f"{BASE_URL}/marketplace/prizes", headers=headers)
        
        if prizes_response.status_code == 200:
            all_prizes = prizes_response.json()
            print(f"✅ Total de premios en el sistema: {len(all_prizes)}")
            
            # Mostrar los premios creados
            for prize in all_prizes:
                print(f"   - {prize['name']} ({prize['points_cost']} puntos) - Stock: {prize['stock']}")
        else:
            print(f"❌ Error al obtener premios: {prizes_response.status_code}")
        
        print("\n=== PREMIOS DE PRUEBA CREADOS ===")
        print("Ahora puedes probar el sistema de compras con estos premios.")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_test_prizes() 