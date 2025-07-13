# WhatsApp Integration - MF-Lifting App

## 🚀 Funcionalidad Implementada

### ✅ Características Principales
- **Mensaje de Bienvenida Automático**: Se envía automáticamente cuando un usuario se registra
- **Mensajes Personalizados**: API para enviar mensajes personalizados
- **Formateo Automático de Teléfonos**: Soporte para diferentes formatos de números
- **Inicialización Automática**: El servicio se inicia automáticamente con la aplicación
- **Manejo de Errores**: Logging detallado y manejo de excepciones

## 📱 Configuración

### 1. Instalar Dependencias
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configuración del Entorno
El servicio de WhatsApp se configura automáticamente con los siguientes valores por defecto:
- **Código de País**: +52 (México)
- **Directorio de Sesión**: `./whatsapp_session`
- **Habilitado**: `True`

### 3. Primera Ejecución
Al ejecutar la aplicación por primera vez:
1. Asegúrate de estar conectado a WhatsApp Web en tu navegador
2. El servicio abrirá automáticamente una pestaña del navegador
3. Los mensajes se enviarán automáticamente

## 🔧 Uso

### Mensaje de Bienvenida Automático
Cuando un usuario se registra con un número de teléfono, automáticamente recibe:

```
¡Hola [Nombre]! 🎉

Bienvenido/a a MF-Lifting App, tu compañero de entrenamiento personal.

🏋️‍♂️ Comienza tu transformación hoy:
• Accede a rutinas personalizadas
• Gana puntos y desbloquea beneficios
• Conecta con entrenadores expertos
• Rastrea tu progreso

¡Estamos emocionados de acompañarte en tu viaje fitness! 💪

¿Tienes alguna pregunta? No dudes en contactarnos.

¡Que tengas un excelente día! 🌟
```

### API Endpoints

#### 1. Enviar Mensaje Personalizado
```http
POST /api/whatsapp/send-message
Content-Type: application/json

{
    "phone": "1234567890",
    "message": "Tu mensaje personalizado aquí"
}
```

#### 2. Enviar Mensaje de Bienvenida
```http
POST /api/whatsapp/send-welcome
Content-Type: application/json

{
    "phone": "1234567890",
    "name": "Nombre del Usuario"
}
```

#### 3. Verificar Estado del Servicio
```http
GET /api/whatsapp/status
```

#### 4. Probar Servicio
```http
POST /api/whatsapp/test
```

## 🧪 Pruebas

### Script de Prueba Automático
```bash
# Probar formateo de teléfonos
python test_whatsapp.py

# Probar envío real (reemplaza con un número real)
python test_whatsapp.py 1234567890
```

### Pruebas Manuales con cURL

#### 1. Verificar Estado
```bash
curl -X GET "http://localhost:8080/api/whatsapp/status"
```

#### 2. Enviar Mensaje de Prueba
```bash
curl -X POST "http://localhost:8080/api/whatsapp/send-message" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "message": "¡Hola! Este es un mensaje de prueba desde MF-Lifting App 🏋️‍♂️"
  }'
```

#### 3. Enviar Mensaje de Bienvenida
```bash
curl -X POST "http://localhost:8080/api/whatsapp/send-welcome" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "name": "Usuario de Prueba"
  }'
```

## 📞 Formatos de Teléfono Soportados

El servicio acepta múltiples formatos y los convierte automáticamente:

| Formato Original | Formato WhatsApp |
|------------------|------------------|
| `1234567890` | `521234567890` |
| `521234567890` | `521234567890` |
| `+52 123 456 7890` | `521234567890` |
| `(123) 456-7890` | `521234567890` |
| `123-456-7890` | `521234567890` |
| `123.456.7890` | `521234567890` |

## 🔍 Logs y Debugging

### Niveles de Log
- **INFO**: Operaciones normales
- **WARNING**: Problemas menores (formato de teléfono no reconocido)
- **ERROR**: Errores críticos

### Ejemplo de Logs
```
INFO: Inicializando cliente de WhatsApp...
INFO: Código QR recibido. Escanea el código para autenticarte:
INFO: WhatsApp autenticado exitosamente
INFO: Cliente de WhatsApp listo!
INFO: Mensaje de bienvenida enviado exitosamente a Juan (1234567890)
```

## ⚠️ Consideraciones Importantes

### 1. Autenticación
- **Primera vez**: Se requiere escanear código QR
- **Sesiones posteriores**: Se usa la sesión guardada automáticamente
- **Sesión expirada**: Se generará un nuevo código QR

### 2. Limitaciones de WhatsApp
- **Rate Limiting**: WhatsApp tiene límites de envío
- **Números no registrados**: Los mensajes fallarán si el número no está en WhatsApp
- **Bloqueos**: Evita enviar spam para prevenir bloqueos

### 3. Privacidad
- **Números de teléfono**: Se procesan localmente
- **Mensajes**: No se almacenan en la base de datos
- **Sesión**: Se guarda localmente en `./whatsapp_session`

## 🚨 Solución de Problemas

### Error: "Cliente de WhatsApp no está listo"
```bash
# Verificar estado
curl -X GET "http://localhost:8080/api/whatsapp/status"

# Esperar unos segundos y volver a intentar
```

### Error: "Formato de teléfono no reconocido"
- Verifica que el número tenga al menos 10 dígitos
- Asegúrate de incluir el código de país si es necesario

### Error: "Fallo en autenticación"
- Asegúrate de estar conectado a WhatsApp Web en tu navegador
- Verifica que tu WhatsApp esté conectado a internet

### Error: "Mensaje no enviado"
- Verifica que el número esté registrado en WhatsApp
- Asegúrate de que no haya bloqueos temporales

## 🔄 Próximos Pasos

### Funcionalidades Futuras
- [ ] **Plantillas de Mensajes**: Diferentes tipos de mensajes automáticos
- [ ] **Programación**: Envío de mensajes en horarios específicos
- [ ] **Notificaciones**: Alertas de progreso y logros
- [ ] **Respuestas Automáticas**: Chatbot básico para consultas frecuentes
- [ ] **Múltiples Números**: Soporte para varios números de WhatsApp

### Mejoras Técnicas
- [ ] **Cola de Mensajes**: Para manejar envíos masivos
- [ ] **Retry Logic**: Reintentos automáticos en caso de fallo
- [ ] **Métricas**: Estadísticas de envío y entrega
- [ ] **Webhook**: Notificaciones de estado de entrega

## 📚 Recursos Adicionales

- [Documentación de whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [API de WhatsApp Business](https://developers.facebook.com/docs/whatsapp)
- [Mejores Prácticas de WhatsApp](https://www.whatsapp.com/legal/business-policy/)

---

**Nota**: Este servicio está diseñado para uso interno y de desarrollo. Para uso en producción, considera usar la API oficial de WhatsApp Business. 