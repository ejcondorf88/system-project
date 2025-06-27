import re
from typing import List, Dict, Any
from datetime import datetime, timedelta
import hashlib
import uuid

def validate_email(email: str) -> bool:
    """Valida si un email tiene formato correcto"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password_strength(password: str) -> Dict[str, Any]:
    """Valida la fortaleza de una contraseña"""
    errors = []
    
    if len(password) < 8:
        errors.append("La contraseña debe tener al menos 8 caracteres")
    
    if not re.search(r'[A-Z]', password):
        errors.append("La contraseña debe contener al menos una mayúscula")
    
    if not re.search(r'[a-z]', password):
        errors.append("La contraseña debe contener al menos una minúscula")
    
    if not re.search(r'\d', password):
        errors.append("La contraseña debe contener al menos un número")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("La contraseña debe contener al menos un carácter especial")
    
    return {
        'is_valid': len(errors) == 0,
        'errors': errors
    }

def sanitize_string(text: str) -> str:
    """Limpia y sanitiza una cadena de texto"""
    # Eliminar caracteres peligrosos
    text = re.sub(r'[<>"\']', '', text)
    # Eliminar espacios extra
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def generate_unique_id() -> str:
    """Genera un ID único"""
    return str(uuid.uuid4())

def hash_string(text: str) -> str:
    """Genera un hash SHA-256 de una cadena"""
    return hashlib.sha256(text.encode()).hexdigest()

def format_datetime(dt: datetime) -> str:
    """Formatea una fecha y hora en formato legible"""
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def parse_datetime(date_string: str) -> datetime:
    """Parsea una cadena de fecha a datetime"""
    try:
        return datetime.fromisoformat(date_string.replace('Z', '+00:00'))
    except ValueError:
        raise ValueError("Formato de fecha inválido")

def calculate_time_difference(start_time: datetime, end_time: datetime) -> timedelta:
    """Calcula la diferencia entre dos fechas"""
    return end_time - start_time

def chunk_list(lst: List[Any], chunk_size: int) -> List[List[Any]]:
    """Divide una lista en chunks de tamaño especificado"""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

def flatten_list(nested_list: List[List[Any]]) -> List[Any]:
    """Aplana una lista anidada"""
    return [item for sublist in nested_list for item in sublist]

def remove_duplicates(lst: List[Any]) -> List[Any]:
    """Elimina duplicados de una lista manteniendo el orden"""
    seen = set()
    return [x for x in lst if not (x in seen or seen.add(x))]

def safe_get(dictionary: Dict[str, Any], key: str, default: Any = None) -> Any:
    """Obtiene un valor de un diccionario de forma segura"""
    return dictionary.get(key, default)

def merge_dictionaries(dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Dict[str, Any]:
    """Combina dos diccionarios"""
    result = dict1.copy()
    result.update(dict2)
    return result 