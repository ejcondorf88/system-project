# Configuración de la Base de Datos

## Problema Actual
El error "Tenant or user not found" indica que las credenciales de Supabase no son válidas.

## Solución: Configurar Supabase Correctamente

### 1. Obtener las Credenciales de Supabase

1. **Ve a tu proyecto de Supabase:**
   - Abre [https://supabase.com](https://supabase.com)
   - Inicia sesión y selecciona tu proyecto

2. **Obtén la URL de conexión:**
   - Ve a **Settings** > **Database**
   - Busca la sección **Connection string** o **URI**
   - Copia la URL que se ve así:
     ```
     postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
     ```

### 2. Actualizar la Configuración

1. **Edita el archivo `config/settings.py`:**
   ```python
   DATABASE_URL: str = "tu_nueva_url_de_supabase_aqui"
   ```

2. **O crea un archivo `.env` en el directorio `backend/`:**
   ```
   DATABASE_URL=tu_nueva_url_de_supabase_aqui
   SECRET_KEY=tu_clave_secreta_aqui
   ```

### 3. Verificar la Configuración

Ejecuta el script de diagnóstico:
```bash
cd backend
python test_db_connection.py
```

### 4. Posibles Problemas y Soluciones

#### Problema: "Tenant or user not found"
- **Causa:** Credenciales incorrectas o proyecto inactivo
- **Solución:** Verifica las credenciales en Supabase

#### Problema: "Connection timeout"
- **Causa:** Firewall o IP no autorizada
- **Solución:** 
  - Ve a Supabase > Settings > Database
  - Agrega tu IP a la lista blanca

#### Problema: "SSL connection required"
- **Causa:** Configuración SSL incorrecta
- **Solución:** La configuración actual ya incluye SSL

### 5. Estructura de la Base de Datos

El sistema creará automáticamente la tabla `users` con la siguiente estructura:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);
```

### 6. Probar el Servidor

Una vez configurado correctamente:

```bash
cd backend
python main.py
```

Deberías ver:
```
✅ Tablas creadas exitosamente
INFO:     Started server process [xxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8080
```

### 7. Alternativa: Usar SQLite para Desarrollo

Si tienes problemas con Supabase, puedes usar SQLite temporalmente:

1. **Edita `config/settings.py`:**
   ```python
   DATABASE_URL: str = "sqlite:///./app.db"
   ```

2. **Edita `database/database.py`:**
   ```python
   if DATABASE_URL.startswith("sqlite"):
       engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
   else:
       engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
   ```

### 8. Contacto

Si sigues teniendo problemas:
1. Verifica que tu proyecto de Supabase esté activo
2. Revisa la documentación oficial de Supabase
3. Asegúrate de que las credenciales sean las correctas del proyecto actual 