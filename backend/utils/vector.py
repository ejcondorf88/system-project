import numpy as np
from typing import List, Dict, Any
import json

class VectorStore:
    def __init__(self):
        self.vectors = []
        self.metadata = []
    
    def add_vector(self, vector: List[float], metadata: Dict[str, Any]):
        """Añade un vector y su metadata al almacén"""
        self.vectors.append(vector)
        self.metadata.append(metadata)
    
    def search(self, query_vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """Busca los vectores más similares al vector de consulta"""
        if not self.vectors:
            return []
        
        # Convertir a numpy arrays para cálculos eficientes
        vectors_array = np.array(self.vectors)
        query_array = np.array(query_vector)
        
        # Calcular similitud coseno
        similarities = np.dot(vectors_array, query_array) / (
            np.linalg.norm(vectors_array, axis=1) * np.linalg.norm(query_array)
        )
        
        # Obtener los índices de los top_k resultados
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        # Construir resultados
        results = []
        for idx in top_indices:
            results.append({
                'similarity': float(similarities[idx]),
                'metadata': self.metadata[idx]
            })
        
        return results
    
    def save(self, filepath: str):
        """Guarda el almacén de vectores en un archivo"""
        data = {
            'vectors': self.vectors,
            'metadata': self.metadata
        }
        with open(filepath, 'w') as f:
            json.dump(data, f)
    
    def load(self, filepath: str):
        """Carga el almacén de vectores desde un archivo"""
        with open(filepath, 'r') as f:
            data = json.load(f)
        self.vectors = data['vectors']
        self.metadata = data['metadata']

# Función de utilidad para normalizar vectores
def normalize_vector(vector: List[float]) -> List[float]:
    """Normaliza un vector a longitud unitaria"""
    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return [x / norm for x in vector] 