
from fastapi.openapi.utils import status_code_ranges
from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from hashing import Hash
from db import models


def crear_usuario(user,db:Session):
    usuario = user.dict()
    try:

        new_user = models.User(
            username=usuario["username"],
            password=Hash.hash_password(usuario["password"]),
            nombre=usuario["nombre"],
            apellido=usuario["apellido"],
            direccion=usuario["direccion"],
            telefono=usuario["telefono"],
            correo=usuario["correo"],
        )
        # agragamos
        db.add(new_user)
        # commit y refresh
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Error creando usuario{e}"
        )
