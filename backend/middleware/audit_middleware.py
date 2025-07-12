from fastapi import Request
from typing import Optional
import re

class AuditMiddleware:
    @staticmethod
    def get_client_ip(request: Request) -> Optional[str]:
        """
        Obtiene la IP real del cliente considerando proxies
        """
        # Intentar obtener IP de headers comunes de proxy
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Tomar la primera IP de la lista
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # IP directa del cliente
        if request.client:
            return request.client.host
        
        return None

    @staticmethod
    def get_user_agent(request: Request) -> Optional[str]:
        """
        Obtiene el User-Agent del cliente
        """
        return request.headers.get("User-Agent")

    @staticmethod
    def is_valid_ip(ip: str) -> bool:
        """
        Valida si una IP es válida
        """
        if not ip:
            return False
        
        # Patrón para IPv4
        ipv4_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
        
        # Patrón para IPv6 (simplificado)
        ipv6_pattern = r'^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$'
        
        return bool(re.match(ipv4_pattern, ip) or re.match(ipv6_pattern, ip))

    @staticmethod
    def sanitize_user_agent(user_agent: str) -> str:
        """
        Sanitiza el User-Agent para evitar inyección
        """
        if not user_agent:
            return ""
        
        # Limitar longitud
        if len(user_agent) > 500:
            user_agent = user_agent[:500]
        
        # Remover caracteres problemáticos
        user_agent = user_agent.replace("\x00", "").replace("\r", "").replace("\n", "")
        
        return user_agent 