import asyncio
import logging
import threading
import time
from datetime import datetime
from typing import Optional
import pywhatkit as pwk
from config.settings import settings

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WhatsAppService:
    def __init__(self):
        self.is_ready = True  # pywhatkit no requiere inicialización compleja
        self.last_send_time = 0
        self.min_interval = 30  # Intervalo mínimo entre mensajes (segundos)
        
    def format_phone(self, phone: str) -> str:
        """
        Formatea un número de teléfono para WhatsApp
        
        Args:
            phone (str): Número de teléfono original
            
        Returns:
            str: Número formateado con código de país
        """
        # Remover caracteres especiales
        clean_phone = ''.join(filter(str.isdigit, phone))
        
        # Si no tiene código de país, agregar +52 (México)
        if len(clean_phone) == 10:
            return f"+52{clean_phone}"
        elif len(clean_phone) == 12 and clean_phone.startswith('52'):
            return f"+{clean_phone}"
        elif clean_phone.startswith('+'):
            return clean_phone
        else:
            return f"+{clean_phone}"
    
    def send_message_sync(self, phone: str, message: str) -> bool:
        """
        Envía un mensaje de forma síncrona
        
        Args:
            phone (str): Número de teléfono
            message (str): Mensaje a enviar
            
        Returns:
            bool: True si se envió correctamente
        """
        try:
            # Formatear teléfono
            formatted_phone = self.format_phone(phone)
            
            # Obtener hora actual
            now = datetime.now()
            
            # Enviar mensaje inmediatamente
            pwk.sendwhatmsg_instantly(
                phone_no=formatted_phone,
                message=message,
                wait_time=15,  # Esperar 15 segundos para que se abra WhatsApp Web
                tab_close=True,  # Cerrar pestaña después de enviar
                close_time=3  # Esperar 3 segundos antes de cerrar
            )
            
            logger.info(f"Mensaje enviado exitosamente a {formatted_phone}")
            return True
            
        except Exception as e:
            logger.error(f"Error al enviar mensaje a {phone}: {e}")
            return False
    
    async def send_welcome_message(self, phone: str, name: str) -> bool:
        """
        Envía un mensaje de bienvenida a un usuario
        
        Args:
            phone (str): Número de teléfono del usuario
            name (str): Nombre del usuario
            
        Returns:
            bool: True si el mensaje se envió correctamente, False en caso contrario
        """
        if not self.is_ready:
            logger.error("Servicio de WhatsApp no está listo")
            return False
        
        try:
            # Mensaje de bienvenida personalizado
            welcome_message = f"""¡Hola {name}! 🎉

Bienvenido/a a MF-Lifting App, tu compañero de entrenamiento personal.

🏋️‍♂️ Comienza tu transformación hoy:
• Accede a rutinas personalizadas
• Gana puntos y desbloquea beneficios
• Conecta con entrenadores expertos
• Rastrea tu progreso

¡Estamos emocionados de acompañarte en tu viaje fitness! 💪

¿Tienes alguna pregunta? No dudes en contactarnos.

¡Que tengas un excelente día! 🌟"""

            # Ejecutar en un thread separado para no bloquear
            def send_message():
                return self.send_message_sync(phone, welcome_message)
            
            # Usar ThreadPoolExecutor para ejecutar de forma asíncrona
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, send_message)
            
            if result:
                logger.info(f"Mensaje de bienvenida enviado exitosamente a {name} ({phone})")
            else:
                logger.error(f"Error al enviar mensaje de bienvenida a {name} ({phone})")
            
            return result
            
        except Exception as e:
            logger.error(f"Error al enviar mensaje de bienvenida a {phone}: {e}")
            return False
    
    async def send_message(self, phone: str, message: str) -> bool:
        """
        Envía un mensaje personalizado
        
        Args:
            phone (str): Número de teléfono del usuario
            message (str): Mensaje a enviar
            
        Returns:
            bool: True si el mensaje se envió correctamente, False en caso contrario
        """
        if not self.is_ready:
            logger.error("Servicio de WhatsApp no está listo")
            return False
        
        try:
            # Ejecutar en un thread separado para no bloquear
            def send_message():
                return self.send_message_sync(phone, message)
            
            # Usar ThreadPoolExecutor para ejecutar de forma asíncrona
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, send_message)
            
            if result:
                logger.info(f"Mensaje enviado exitosamente a {phone}")
            else:
                logger.error(f"Error al enviar mensaje a {phone}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error al enviar mensaje a {phone}: {e}")
            return False
    
    async def close(self):
        """Cierra el servicio (no es necesario con pywhatkit)"""
        logger.info("Servicio de WhatsApp cerrado")

# Instancia global del servicio
whatsapp_service = WhatsAppService()

async def initialize_whatsapp():
    """Inicializa el servicio de WhatsApp"""
    try:
        logger.info("Inicializando servicio de WhatsApp con pywhatkit...")
        # pywhatkit no requiere inicialización compleja
        logger.info("✅ Servicio de WhatsApp inicializado correctamente")
        return True
    except Exception as e:
        logger.error(f"Error al inicializar WhatsApp: {e}")
        return False

async def send_welcome_message(phone: str, name: str) -> bool:
    """Función helper para enviar mensaje de bienvenida"""
    return await whatsapp_service.send_welcome_message(phone, name)

async def send_whatsapp_message(phone: str, message: str) -> bool:
    """Función helper para enviar mensaje personalizado"""
    return await whatsapp_service.send_message(phone, message) 