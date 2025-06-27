from pydantic import BaseModel

class Respuesta(BaseModel):
    respuesta: str

class Pregunta(BaseModel):
    pregunta: str

