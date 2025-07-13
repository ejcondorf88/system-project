from sqlalchemy.orm import Session, joinedload, load_only
from database.models import Prize, PrizePurchase, User
from schemas.user import PrizeCreate, PrizePurchaseCreate
from typing import List, Optional

class PrizeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_prizes(self, skip: int = 0, limit: int = 100) -> List[Prize]:
        """Obtener todos los premios activos"""
        return self.db.query(Prize).filter(Prize.status == 1).offset(skip).limit(limit).all()

    def get_prize_by_id(self, prize_id: int) -> Optional[Prize]:
        """Obtener un premio por ID"""
        return self.db.query(Prize).filter(Prize.id == prize_id, Prize.status == 1).first()

    def get_prizes_by_category(self, category: str) -> List[Prize]:
        """Obtener premios por categoría"""
        return self.db.query(Prize).filter(Prize.category == category, Prize.status == 1).all()

    def create_prize(self, prize: PrizeCreate) -> Prize:
        """Crear un nuevo premio"""
        db_prize = Prize(**prize.dict())
        self.db.add(db_prize)
        self.db.commit()
        self.db.refresh(db_prize)
        return db_prize

    def update_prize(self, prize_id: int, prize_data: dict) -> Optional[Prize]:
        """Actualizar un premio"""
        db_prize = self.get_prize_by_id(prize_id)
        if db_prize:
            for key, value in prize_data.items():
                setattr(db_prize, key, value)
            self.db.commit()
            self.db.refresh(db_prize)
        return db_prize

    def delete_prize(self, prize_id: int) -> bool:
        """Eliminar un premio (cambiar status a 0)"""
        db_prize = self.get_prize_by_id(prize_id)
        if db_prize:
            db_prize.status = 0
            self.db.commit()
            return True
        return False

    def purchase_prize(self, user_id: int, prize_id: int, shipping_address: str = None) -> Optional[PrizePurchase]:
        """Comprar un premio con puntos"""
        # Obtener el premio
        prize = self.get_prize_by_id(prize_id)
        if not prize:
            raise ValueError("Premio no encontrado")

        # Verificar stock
        if prize.stock <= 0:
            raise ValueError("Premio sin stock disponible")

        # Obtener el usuario
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("Usuario no encontrado")

        # Verificar si tiene suficientes puntos
        if user.points < prize.points_cost:
            raise ValueError(f"Puntos insuficientes. Necesitas {prize.points_cost} puntos, tienes {user.points}")

        try:
            # Crear la transacción de compra
            purchase = PrizePurchase(
                user_id=user_id,
                prize_id=prize_id,
                points_spent=prize.points_cost,
                shipping_address=shipping_address
            )
            self.db.add(purchase)

            # Descontar puntos del usuario
            user.points -= prize.points_cost

            # Reducir stock del premio
            prize.stock -= 1

            self.db.commit()
            self.db.refresh(purchase)
            return purchase

        except Exception as e:
            self.db.rollback()
            raise e

    def get_user_purchases(self, user_id: int) -> List[PrizePurchase]:
        """Obtener todas las compras de un usuario"""
        return self.db.query(PrizePurchase).filter(PrizePurchase.user_id == user_id).all()

    def update_purchase_status(self, purchase_id: int, status: str, tracking_number: str = None) -> Optional[PrizePurchase]:
        """Actualizar el estado de una compra"""
        purchase = self.db.query(PrizePurchase).filter(PrizePurchase.id == purchase_id).first()
        if purchase:
            purchase.status = status
            if tracking_number:
                purchase.tracking_number = tracking_number
            self.db.commit()
            self.db.refresh(purchase)
        return purchase

    def get_all_purchases(self, skip: int = 0, limit: int = 100) -> List[PrizePurchase]:
        """Obtener todas las compras (para administradores)"""
        return self.db.query(PrizePurchase).options(
            joinedload(PrizePurchase.user).load_only(
                User.id, User.username, User.email, User.phone, 
                User.level, User.points, User.is_superuser, 
                User.is_trainer, User.status
            ),
            joinedload(PrizePurchase.prize)
        ).offset(skip).limit(limit).all() 