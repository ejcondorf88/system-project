from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_db
from repository.prize import PrizeRepository
from schemas.user import Prize, PrizeCreate, PrizePurchase, PrizePurchaseCreate, PrizePurchaseWithUser
from core.security import get_current_user
from typing import List
import logging
from services.audit_service import AuditService

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/prizes", response_model=List[Prize])
def get_prizes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener todos los premios disponibles"""
    try:
        prize_repo = PrizeRepository(db)
        prizes = prize_repo.get_all_prizes(skip=skip, limit=limit)
        logger.info(f"Obtenidos {len(prizes)} premios")
        return prizes
    except Exception as e:
        logger.error(f"Error al obtener premios: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/prizes/{prize_id}", response_model=Prize)
def get_prize(prize_id: int, db: Session = Depends(get_db)):
    """Obtener un premio específico"""
    try:
        prize_repo = PrizeRepository(db)
        prize = prize_repo.get_prize_by_id(prize_id)
        if not prize:
            raise HTTPException(status_code=404, detail="Premio no encontrado")
        return prize
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener premio {prize_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/prizes/category/{category}", response_model=List[Prize])
def get_prizes_by_category(category: str, db: Session = Depends(get_db)):
    """Obtener premios por categoría"""
    try:
        prize_repo = PrizeRepository(db)
        prizes = prize_repo.get_prizes_by_category(category)
        logger.info(f"Obtenidos {len(prizes)} premios de la categoría {category}")
        return prizes
    except Exception as e:
        logger.error(f"Error al obtener premios por categoría {category}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/prizes", response_model=Prize)
def create_prize(prize: PrizeCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Crear un nuevo premio (solo superusuarios)"""
    try:
        if not current_user.is_superuser:
            raise HTTPException(status_code=403, detail="Acceso denegado")
        prize_repo = PrizeRepository(db)
        new_prize = prize_repo.create_prize(prize)
        # Auditoría
        AuditService.log_create(
            db=db,
            table_name="prizes",
            record_id=new_prize.id,
            user_id=current_user.id,
            ip_address=None,
            user_agent=None
        )
        logger.info(f"Premio creado: {new_prize.name}")
        return new_prize
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al crear premio: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.put("/prizes/{prize_id}", response_model=Prize)
def update_prize(prize_id: int, prize_data: dict, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Actualizar un premio (solo superusuarios)"""
    try:
        if not current_user.is_superuser:
            raise HTTPException(status_code=403, detail="Acceso denegado")
        prize_repo = PrizeRepository(db)
        # Obtener valores antiguos para auditoría
        old_prize = prize_repo.get_prize_by_id(prize_id)
        updated_prize = prize_repo.update_prize(prize_id, prize_data)
        if not updated_prize:
            raise HTTPException(status_code=404, detail="Premio no encontrado")
        # Auditoría campo por campo
        for key, new_value in prize_data.items():
            if hasattr(old_prize, key):
                old_value = getattr(old_prize, key)
                if old_value != new_value:
                    AuditService.log_update(
                        db=db,
                        table_name="prizes",
                        record_id=prize_id,
                        field_name=key,
                        old_value=old_value,
                        new_value=new_value,
                        user_id=current_user.id,
                        ip_address=None,
                        user_agent=None
                    )
        logger.info(f"Premio actualizado: {updated_prize.name}")
        return updated_prize
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al actualizar premio {prize_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.delete("/prizes/{prize_id}")
def delete_prize(prize_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Eliminar un premio (solo superusuarios)"""
    try:
        if not current_user.is_superuser:
            raise HTTPException(status_code=403, detail="Acceso denegado")
        prize_repo = PrizeRepository(db)
        success = prize_repo.delete_prize(prize_id)
        if not success:
            raise HTTPException(status_code=404, detail="Premio no encontrado")
        # Auditoría
        AuditService.log_delete(
            db=db,
            table_name="prizes",
            record_id=prize_id,
            user_id=current_user.id,
            ip_address=None,
            user_agent=None
        )
        logger.info(f"Premio eliminado: {prize_id}")
        return {"message": "Premio eliminado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al eliminar premio {prize_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/purchase", response_model=PrizePurchase)
def purchase_prize(purchase_data: PrizePurchaseCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Comprar un premio con puntos"""
    try:
        user_id = current_user.id
        if not user_id:
            raise HTTPException(status_code=401, detail="Usuario no autenticado")
        prize_repo = PrizeRepository(db)
        purchase = prize_repo.purchase_prize(
            user_id=user_id,
            prize_id=purchase_data.prize_id,
            shipping_address=purchase_data.shipping_address
        )
        # Auditoría
        AuditService.log_create(
            db=db,
            table_name="prize_purchases",
            record_id=purchase.id,
            user_id=user_id,
            ip_address=None,
            user_agent=None
        )
        logger.info(f"Compra realizada: Usuario {user_id} compró premio {purchase_data.prize_id}")
        return purchase
    except ValueError as e:
        logger.warning(f"Error de validación en compra: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al procesar compra: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/purchases/my", response_model=List[PrizePurchase])
def get_my_purchases(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Obtener las compras del usuario actual"""
    try:
        user_id = current_user.id
        if not user_id:
            raise HTTPException(status_code=401, detail="Usuario no autenticado")
        
        prize_repo = PrizeRepository(db)
        purchases = prize_repo.get_user_purchases(user_id)
        logger.info(f"Obtenidas {len(purchases)} compras del usuario {user_id}")
        return purchases
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener compras del usuario {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.get("/purchases/all", response_model=List[PrizePurchaseWithUser])
def get_all_purchases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Obtener todas las compras (solo superusuarios)"""
    try:
        if not current_user.is_superuser:
            raise HTTPException(status_code=403, detail="Acceso denegado")
        
        prize_repo = PrizeRepository(db)
        purchases = prize_repo.get_all_purchases(skip=skip, limit=limit)
        logger.info(f"Obtenidas {len(purchases)} compras totales")
        return purchases
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener todas las compras: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.put("/purchases/{purchase_id}/status")
def update_purchase_status(purchase_id: int, status: str, tracking_number: str = None, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """Actualizar el estado de una compra (solo superusuarios)"""
    try:
        if not current_user.is_superuser:
            raise HTTPException(status_code=403, detail="Acceso denegado")
        prize_repo = PrizeRepository(db)
        purchase = prize_repo.update_purchase_status(purchase_id, status, tracking_number)
        if not purchase:
            raise HTTPException(status_code=404, detail="Compra no encontrada")
        # Auditoría
        AuditService.log_update(
            db=db,
            table_name="prize_purchases",
            record_id=purchase_id,
            field_name="status",
            old_value=None,  # Si puedes obtener el valor anterior, cámbialo aquí
            new_value=status,
            user_id=current_user.id,
            ip_address=None,
            user_agent=None
        )
        logger.info(f"Estado de compra {purchase_id} actualizado a: {status}")
        return {"message": "Estado de compra actualizado exitosamente", "purchase": purchase}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al actualizar estado de compra {purchase_id}: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor") 