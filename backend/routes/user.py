from typing import List

from fastapi import APIRouter,Depends
from db.database import get_db
from sqlalchemy.orm import Session
from db import models
from passlib.context import CryptContext

from oauth import get_current_user
from repository import user
from fastapi import HTTPException,status
from db.models import User
from schemas.user import UserCreate

router = APIRouter(
    prefix = "/user",
    tags= ["Users"]
)

@router.get("/",status_code=status.HTTP_200_OK)
def get_users(db:Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    data = db.query(models.User).all()
    print(data)
    return data

@router.post('/create',status_code=status.HTTP_202_ACCEPTED)
def create_user(usuario:UserCreate, db:Session = Depends(get_db)):
    user.crear_usuario(usuario,db)
    return{"respuesta":"Usuario creado"}