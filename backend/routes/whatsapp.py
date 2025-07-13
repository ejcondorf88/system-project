from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import asyncio
from services.whatsapp_service import send_welcome_message, send_whatsapp_message, whatsapp_service

router = APIRouter(tags=["whatsapp"])

class WhatsAppMessage(BaseModel):
    phone: str
    message: str

class WelcomeMessage(BaseModel):
    phone: str
    name: str

class PurchaseNotification(BaseModel):
    phone: str
    purchaseData: dict
    customMessage: Optional[str] = None

@router.post("/send-message")
async def send_message(message_data: WhatsAppMessage):
    """
    Envía un mensaje personalizado por WhatsApp
    
    Args:
        message_data: Datos del mensaje (teléfono y mensaje)
    
    Returns:
        dict: Resultado del envío
    """
    try:
        success = await send_whatsapp_message(message_data.phone, message_data.message)
        
        if success:
            return {
                "success": True,
                "message": f"Mensaje enviado exitosamente a {message_data.phone}",
                "phone": message_data.phone
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al enviar mensaje a {message_data.phone}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno: {str(e)}"
        )

@router.post("/send-welcome")
async def send_welcome(welcome_data: WelcomeMessage):
    """
    Envía un mensaje de bienvenida por WhatsApp
    
    Args:
        welcome_data: Datos del usuario (teléfono y nombre)
    
    Returns:
        dict: Resultado del envío
    """
    try:
        success = await send_welcome_message(welcome_data.phone, welcome_data.name)
        
        if success:
            return {
                "success": True,
                "message": f"Mensaje de bienvenida enviado exitosamente a {welcome_data.name}",
                "phone": welcome_data.phone,
                "name": welcome_data.name
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al enviar mensaje de bienvenida a {welcome_data.name}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno: {str(e)}"
        )

@router.post("/send-welcome-crm")
async def send_welcome_crm(welcome_data: WelcomeMessage):
    """
    Envía un mensaje de bienvenida desde el CRM
    
    Args:
        welcome_data: Datos del usuario (teléfono y nombre)
    
    Returns:
        dict: Resultado del envío
    """
    try:
        # Mensaje de bienvenida personalizado para el CRM
        welcome_message = f"""¡Hola {welcome_data.name}! 🎉

Bienvenido/a de nuevo a MF-Lifting App.

🏋️‍♂️ Tu equipo de soporte te contacta para:
• Verificar que todo esté funcionando correctamente
• Ofrecerte ayuda con cualquier duda
• Informarte sobre nuevas funcionalidades

¡Estamos aquí para ayudarte a alcanzar tus metas fitness! 💪

¿Hay algo en lo que podamos ayudarte hoy?

¡Que tengas un excelente entrenamiento! 🌟"""

        success = await whatsapp_service.send_message(welcome_data.phone, welcome_message)
        
        if success:
            return {
                "success": True,
                "message": f"Mensaje de bienvenida enviado exitosamente a {welcome_data.name}",
                "phone": welcome_data.phone,
                "name": welcome_data.name
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al enviar mensaje de bienvenida a {welcome_data.name}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno: {str(e)}"
        )

@router.get("/status")
async def get_whatsapp_status():
    """
    Obtiene el estado del servicio de WhatsApp
    
    Returns:
        dict: Estado del servicio
    """
    try:
        return {
            "enabled": True,
            "ready": whatsapp_service.is_ready,
            "client_initialized": whatsapp_service.client is not None,
            "status": "ready" if whatsapp_service.is_ready else "initializing"
        }
    except Exception as e:
        return {
            "enabled": True,
            "ready": False,
            "client_initialized": False,
            "status": "error",
            "error": str(e)
        }

@router.post("/test")
async def test_whatsapp():
    """
    Endpoint de prueba para verificar que WhatsApp funciona
    
    Returns:
        dict: Resultado de la prueba
    """
    try:
        # Verificar que el servicio esté listo
        if not whatsapp_service.is_ready:
            return {
                "success": False,
                "message": "WhatsApp no está listo. Espera unos segundos y vuelve a intentar.",
                "status": "not_ready"
            }
        
        return {
            "success": True,
            "message": "WhatsApp está funcionando correctamente",
            "status": "ready",
            "client_initialized": whatsapp_service.client is not None
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error en WhatsApp: {str(e)}",
            "status": "error"
        }

@router.post("/send-purchase-notification")
async def send_purchase_notification(notification_data: PurchaseNotification):
    """
    Envía una notificación de compra por WhatsApp
    
    Args:
        notification_data: Datos de la notificación (teléfono, datos de compra y mensaje personalizado)
    
    Returns:
        dict: Resultado del envío
    """
    try:
        purchase = notification_data.purchaseData
        prize_name = purchase.get('prize', {}).get('name', 'Premio')
        status = purchase.get('status', 'pendiente')
        tracking_number = purchase.get('tracking_number', '')
        points_spent = purchase.get('points_spent', 0)
        
        # Mensaje base según el estado
        if status == 'shipped':
            base_message = f"""🚚 ¡Tu pedido ha sido enviado!

📦 Producto: {prize_name}
💰 Puntos gastados: {points_spent}
📋 Estado: Enviado

"""
            if tracking_number:
                base_message += f"📮 Número de seguimiento: {tracking_number}\n\n"
            
            base_message += "¡Tu premio está en camino! 🎉"
            
        elif status == 'delivered':
            base_message = f"""✅ ¡Tu pedido ha sido entregado!

📦 Producto: {prize_name}
💰 Puntos gastados: {points_spent}
📋 Estado: Entregado

¡Disfruta tu premio! 🎉"""
            
        elif status == 'cancelled':
            base_message = f"""❌ Tu pedido ha sido cancelado

📦 Producto: {prize_name}
💰 Puntos gastados: {points_spent}
📋 Estado: Cancelado

Si tienes alguna pregunta, contáctanos."""
            
        else:  # pending
            base_message = f"""⏳ Tu pedido está siendo procesado

📦 Producto: {prize_name}
💰 Puntos gastados: {points_spent}
📋 Estado: Pendiente

Te notificaremos cuando esté listo para envío."""
        
        # Agregar mensaje personalizado si se proporciona
        if notification_data.customMessage:
            base_message += f"\n\n💬 Mensaje adicional:\n{notification_data.customMessage}"
        
        success = await whatsapp_service.send_message(notification_data.phone, base_message)
        
        if success:
            return {
                "success": True,
                "message": f"Notificación de compra enviada exitosamente",
                "phone": notification_data.phone,
                "status": status
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al enviar notificación de compra"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno: {str(e)}"
        ) 