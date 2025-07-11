# Guía de Despliegue - Render y Netlify

## 🚀 Despliegue del Backend en Render

### 1. Preparación
- Asegúrate de tener una cuenta en [Render](https://render.com)
- Conecta tu repositorio de GitHub a Render

### 2. Configuración en Render
1. Ve a tu dashboard de Render
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `fitness-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Root Directory**: `backend`

### 3. Variables de Entorno
Configura las siguientes variables de entorno en Render:

```
DATABASE_URL=postgresql://postgres.wwwanszaadvicyfkudaj:Pigo0173!@aws-0-us-west-1.pooler.supabase.com:5432/postgres
SECRET_KEY=tu_clave_secreta_aqui_cambiala_en_produccion
ALLOWED_ORIGINS=["https://tu-app-frontend.netlify.app", "http://localhost:3000", "http://localhost:8080"]
OPENAI_API_KEY=tu_clave_de_openai_aqui
PINECONE_API_KEY=pcsk_6FECK2_AZPddmaoWkDJxqaWGyoN8HsfsJXe67WHWtMoBSJkhZiaCQ58KDMgZJXHA2sqBWv
PINECONE_INDEX_NAME=chatbot
```

### 4. Despliegue
- Render detectará automáticamente el archivo `render.yaml`
- El servicio se desplegará automáticamente
- La URL será: `https://tu-backend-app.onrender.com`

---

## 🎨 Despliegue del Frontend en Netlify

### 1. Preparación
- Asegúrate de tener una cuenta en [Netlify](https://netlify.com)
- Conecta tu repositorio de GitHub a Netlify

### 2. Configuración en Netlify
1. Ve a tu dashboard de Netlify
2. Haz clic en "Add new site" → "Import an existing project"
3. Conecta tu repositorio de GitHub
4. Configura el build:
   - **Base directory**: `fronted`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 3. Variables de Entorno
Configura las siguientes variables de entorno en Netlify:

```
VITE_API_URL=https://tu-backend-app.onrender.com/api
VITE_APP_NAME=Fitness AI Assistant
```

### 4. Configuración de Dominio
- Netlify te asignará una URL automática
- Puedes configurar un dominio personalizado en Settings → Domain management

---

## 🔧 Configuración Post-Despliegue

### 1. Actualizar URLs
Después del despliegue, actualiza las siguientes URLs:

1. **En el frontend** (`fronted/src/adapters/api.ts`):
   ```typescript
   const API_URL = process.env.NODE_ENV === 'production' 
     ? 'https://tu-backend-app.onrender.com/api'  // Reemplaza con tu URL real
     : 'http://localhost:8080/api';
   ```

2. **En Render** (variables de entorno):
   ```
   ALLOWED_ORIGINS=["https://tu-app-frontend.netlify.app", "http://localhost:3000"]
   ```

### 2. Verificar CORS
Asegúrate de que el backend permita las peticiones del frontend:

```python
# En backend/main.py
ALLOWED_ORIGINS = [
    "https://tu-app-frontend.netlify.app",
    "http://localhost:3000",
    "http://localhost:8080"
]
```

### 3. Health Checks
- **Render**: Configura el health check en `/`
- **Netlify**: Los health checks son automáticos

---

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de CORS**:
   - Verifica que las URLs del frontend estén en `ALLOWED_ORIGINS`
   - Asegúrate de que el protocolo sea HTTPS en producción

2. **Error de conexión a la base de datos**:
   - Verifica que `DATABASE_URL` esté correctamente configurada
   - Asegúrate de que la base de datos esté accesible desde Render

3. **Error de build en Netlify**:
   - Verifica que Node.js 18 esté disponible
   - Revisa los logs de build para errores específicos

4. **Variables de entorno no encontradas**:
   - Asegúrate de que las variables estén configuradas en ambos servicios
   - Verifica que los nombres de las variables sean correctos

### Logs y Debugging

- **Render**: Ve a la pestaña "Logs" en tu servicio
- **Netlify**: Ve a "Deploys" → "View deploy log"

---

## 📝 Notas Importantes

1. **Seguridad**: 
   - Cambia `SECRET_KEY` en producción
   - No expongas claves API en el código
   - Usa variables de entorno para todas las configuraciones sensibles

2. **Performance**:
   - Render puede tardar en "despertar" el servicio si no hay tráfico
   - Considera usar un plan pagado para mejor performance

3. **Monitoreo**:
   - Configura alertas en ambos servicios
   - Monitorea los logs regularmente

4. **Backup**:
   - Mantén backups de tu base de datos
   - Versiona tu código en GitHub

---

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. **Backend**: Push a GitHub → Render se actualiza automáticamente
2. **Frontend**: Push a GitHub → Netlify se actualiza automáticamente

Ambos servicios tienen auto-deploy configurado. 