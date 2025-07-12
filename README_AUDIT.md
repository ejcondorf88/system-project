# Sistema de Auditoría - CRM

## 📋 Descripción

El sistema de auditoría proporciona un seguimiento completo de todas las actividades realizadas en el CRM, registrando quién hizo qué, cuándo y desde dónde. Esto permite mantener un historial detallado para cumplimiento, seguridad y análisis.

## 🏗️ Arquitectura

### Backend

```
backend/
├── database/
│   └── models.py          # Modelo AuditLog y campos status
├── schemas/
│   └── audit.py           # Esquemas Pydantic para auditoría
├── services/
│   └── audit_service.py   # Lógica de negocio para auditoría
├── middleware/
│   └── audit_middleware.py # Captura de IP y User-Agent
├── routes/
│   └── audit.py           # Endpoints de auditoría
└── migrate_audit.py       # Script de migración
```

### Frontend

```
fronted/src/
├── hooks/
│   └── useAudit.ts        # Hook personalizado para auditoría
├── components/
│   ├── admin/
│   │   ├── AuditLogs.tsx  # Componente principal
│   │   └── AuditRoute.tsx # Protección de rutas
│   └── ui/                # Componentes UI reutilizables
└── routes/
    └── CRMRouter.tsx      # Rutas protegidas
```

## 🗄️ Base de Datos

### Tabla `audit_logs`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | SERIAL | Clave primaria |
| `table_name` | VARCHAR(100) | Nombre de la tabla afectada |
| `record_id` | INTEGER | ID del registro modificado |
| `action` | VARCHAR(20) | CREATE, UPDATE, DELETE |
| `field_name` | VARCHAR(100) | Campo modificado (para UPDATE) |
| `old_value` | TEXT | Valor anterior |
| `new_value` | TEXT | Valor nuevo |
| `user_id` | INTEGER | Usuario que realizó la acción |
| `ip_address` | VARCHAR(45) | IP del cliente |
| `user_agent` | VARCHAR(500) | Navegador/dispositivo |
| `created_at` | TIMESTAMP | Fecha y hora de la acción |

### Campos `status` agregados

Todas las tablas ahora incluyen:
- `status`: INTEGER (0 = inactivo, 1 = activo)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## 🔧 Funcionalidades

### 1. Auditoría Automática
- **Creación de registros**: Se registra automáticamente cuando se crea un nuevo usuario
- **Actualización de registros**: Se registran los cambios en campos específicos
- **Eliminación de registros**: Se registra cuando se elimina un registro

### 2. Captura de Información
- **IP del cliente**: Detecta automáticamente la IP real considerando proxies
- **User-Agent**: Captura información del navegador/dispositivo
- **Usuario**: Registra quién realizó la acción
- **Timestamp**: Fecha y hora exacta de la acción

### 3. Filtros y Búsqueda
- **Por tabla**: Filtrar por tabla específica
- **Por acción**: CREATE, UPDATE, DELETE
- **Por usuario**: Filtrar por ID de usuario
- **Por fechas**: Rango de fechas
- **Paginación**: Límite y offset para grandes volúmenes

### 4. Resúmenes Estadísticos
- **Total de registros**: Número total de acciones registradas
- **Conteo por acción**: Cuántas creaciones, actualizaciones, eliminaciones
- **Usuario más activo**: Quién ha realizado más acciones
- **Tabla más modificada**: Qué tabla tiene más actividad

## 🚀 Instalación

### 1. Ejecutar Migración

```bash
cd backend
python migrate_audit.py
```

### 2. Verificar Dependencias Frontend

```bash
cd fronted
npm install clsx tailwind-merge class-variance-authority
```

### 3. Configurar Variables de Entorno

```env
# En .env
AUDIT_ENABLED=true
AUDIT_LOG_LEVEL=INFO
```

## 📊 Uso

### Acceso a Auditoría

1. **Iniciar sesión** como superusuario o administrador
2. **Navegar** a CRM → Auditoría
3. **Ver logs** en tiempo real
4. **Aplicar filtros** según necesidades
5. **Exportar datos** (funcionalidad futura)

### Permisos

- **Superusuarios**: Acceso completo
- **Administradores**: Acceso completo
- **Usuarios normales**: Sin acceso

## 🔒 Seguridad

### Protección de Datos
- **Encriptación**: Los valores sensibles se almacenan de forma segura
- **Sanitización**: User-Agent y IP se sanitizan antes de almacenar
- **Validación**: Todos los datos se validan antes de procesar

### Control de Acceso
- **Autenticación**: Requiere token válido
- **Autorización**: Solo usuarios autorizados pueden ver logs
- **Auditoría de auditoría**: Los accesos a logs se registran

## 📈 Monitoreo

### Métricas Clave
- **Actividad diaria**: Número de acciones por día
- **Usuarios activos**: Quiénes están realizando más cambios
- **Tablas críticas**: Qué tablas se modifican más
- **Patrones sospechosos**: Actividad inusual

### Alertas (Futuro)
- **Múltiples eliminaciones**: Alertar sobre eliminaciones masivas
- **Acceso desde IPs desconocidas**: Detectar accesos sospechosos
- **Modificaciones fuera de horario**: Actividad en horarios no laborales

## 🛠️ Mantenimiento

### Limpieza de Logs
```sql
-- Eliminar logs antiguos (más de 1 año)
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Optimización
```sql
-- Crear índices para mejor rendimiento
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- **Exportación**: Exportar logs a CSV/Excel
- **Notificaciones**: Alertas en tiempo real
- **Dashboard avanzado**: Gráficos y métricas
- **Búsqueda avanzada**: Búsqueda por contenido
- **Retención configurable**: Políticas de retención personalizables

### Integración
- **SIEM**: Integración con sistemas de seguridad
- **Logs centralizados**: Envío a sistemas de logging
- **Backup automático**: Respaldo automático de logs

## 📞 Soporte

Para problemas o consultas sobre el sistema de auditoría:

1. **Revisar logs** del sistema
2. **Verificar permisos** del usuario
3. **Comprobar conectividad** con la base de datos
4. **Contactar al equipo** de desarrollo

---

**Nota**: Este sistema de auditoría es fundamental para el cumplimiento normativo y la seguridad del CRM. Se recomienda revisar regularmente los logs y configurar alertas apropiadas. 