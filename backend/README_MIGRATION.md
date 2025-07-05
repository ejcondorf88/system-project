# Migración de Base de Datos

## Nuevos Campos Agregados

Se han agregado los siguientes campos a la tabla `users`:

- `phone` (VARCHAR, nullable): Número de celular del usuario
- `level` (VARCHAR, default: 'Bronce'): Nivel del usuario (Bronce, Plata, Oro)
- `points` (INTEGER, default: 0): Puntos acumulados del usuario
- `benefits` (INTEGER, default: 0): Beneficios activos del usuario
- `achievements` (VARCHAR, default: '[]'): Logros del usuario como JSON string

## Ejecutar la Migración

1. **Activar el entorno virtual:**
   ```bash
   cd backend
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

2. **Ejecutar el script de migración:**
   ```bash
   python migrate_db.py
   ```

3. **Verificar que la migración fue exitosa:**
   - Deberías ver mensajes como "✅ Migración completada exitosamente"
   - Si las columnas ya existen, no se mostrarán errores

## Verificar la Migración

Puedes verificar que los nuevos campos se agregaron correctamente ejecutando:

```sql
-- En tu cliente de base de datos
DESCRIBE users;
-- o
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users';
```

## Nuevas Funcionalidades

### Backend
- **GET /api/users/me**: Ahora devuelve todos los campos del usuario incluyendo level, points, benefits, achievements
- **PUT /api/users/me**: Permite actualizar los campos del perfil del usuario
- **POST /api/auth/register**: Ahora acepta el campo `phone` opcional

### Frontend
- **Registro**: Nuevo campo de celular en el formulario de registro
- **Perfil**: Muestra datos reales del usuario desde la base de datos
- **Tienda**: Usa puntos reales del usuario en lugar de mockups

## Estructura de Datos

### Niveles de Usuario
- **Bronce**: Usuario nuevo (0-500 puntos)
- **Plata**: Usuario intermedio (501-1000 puntos)
- **Oro**: Usuario avanzado (1001+ puntos)

### Logros (achievements)
Los logros se almacenan como JSON string en la base de datos:
```json
["10 Rutinas", "Chat VIP", "1 Año"]
```

### Puntos
Los puntos se acumulan por:
- Completar rutinas
- Usar el chat
- Tiempo de uso
- Logros desbloqueados

## Notas Importantes

1. **Compatibilidad**: Los usuarios existentes mantendrán sus datos y se les asignarán valores por defecto para los nuevos campos
2. **Validación**: El campo `phone` es opcional en el registro
3. **Seguridad**: Los puntos y beneficios solo pueden ser modificados por el sistema, no por el usuario directamente
4. **Performance**: Los logros se almacenan como JSON string para simplicidad, pero podrían migrarse a una tabla separada en el futuro si es necesario 