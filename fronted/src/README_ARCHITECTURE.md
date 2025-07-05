# Arquitectura de Adapters y Hooks

## 🏗️ **Arquitectura Implementada**

La aplicación ahora sigue una arquitectura modular con **Adapters** y **Hooks personalizados** para mayor mantenibilidad y reutilización de código.

## 📁 **Estructura de Archivos**

```
src/
├── adapters/           # Capa de adaptación para APIs
│   ├── auth.adapter.ts
│   ├── user.adapter.ts
│   ├── chat.adapter.ts
│   └── routines.adapter.ts
├── hooks/             # Hooks personalizados para lógica de negocio
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useStore.ts
│   ├── useRoutines.ts
│   ├── useChat.ts
│   ├── useLoginForm.ts
│   └── useRegisterForm.ts
└── components/        # Componentes de UI (solo presentación)
    ├── Profile.tsx
    ├── Store.tsx
    ├── Routines.tsx
    └── ...
```

## 🔄 **Flujo de Datos**

```
Componente → Hook → Adapter → API → Backend
```

### **Ejemplo: Perfil de Usuario**

```typescript
// Componente (solo UI)
const Profile = () => {
  const { user, loading, error, refreshProfile } = useProfile();
  // Renderiza UI basado en el estado del hook
};

// Hook (lógica de negocio)
const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchUserData = async () => {
    const userData = await userAdapter.getCurrentUser();
    setUser(userData);
  };
  
  return { user, loading, error, refreshProfile };
};

// Adapter (comunicación con API)
const userAdapter = {
  async getCurrentUser() {
    const response = await axios.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
```

## 🎯 **Beneficios de la Arquitectura**

### **1. Separación de Responsabilidades**
- **Componentes**: Solo manejan la presentación y eventos de UI
- **Hooks**: Contienen la lógica de negocio y estado
- **Adapters**: Manejan la comunicación con APIs externas

### **2. Reutilización de Código**
- Los hooks pueden ser reutilizados en múltiples componentes
- Los adapters pueden ser compartidos entre diferentes hooks

### **3. Testabilidad**
- Cada capa puede ser testeada independientemente
- Los adapters pueden ser mockeados fácilmente

### **4. Mantenibilidad**
- Cambios en la API solo afectan a los adapters
- Lógica de negocio centralizada en hooks
- Componentes más simples y enfocados

## 📋 **Hooks Implementados**

### **useProfile**
```typescript
const { user, loading, error, refreshProfile, updateProfile } = useProfile();
```
- **Funcionalidad**: Maneja datos del perfil del usuario
- **Estados**: user, loading, error
- **Acciones**: refreshProfile, updateProfile

### **useStore**
```typescript
const { products, cart, userPoints, addToCart, removeFromCart } = useStore();
```
- **Funcionalidad**: Maneja la tienda y carrito de compras
- **Estados**: products, cart, userPoints, loading, error
- **Acciones**: addToCart, removeFromCart, clearCart, refreshUserPoints

### **useRoutines**
```typescript
const { routines, loading, error, startRoutine, refreshRoutines } = useRoutines();
```
- **Funcionalidad**: Maneja las rutinas de ejercicio
- **Estados**: routines, loading, error
- **Acciones**: startRoutine, refreshRoutines

## 🔌 **Adapters Implementados**

### **userAdapter**
```typescript
// Obtener datos del usuario actual
const user = await userAdapter.getCurrentUser();

// Actualizar datos del usuario
const updatedUser = await userAdapter.updateUser(userData);

// Obtener puntos del usuario
const points = await userAdapter.getUserPoints();
```

### **routinesAdapter**
```typescript
// Obtener todas las rutinas
const routines = await routinesAdapter.getRoutines();

// Iniciar una rutina
await routinesAdapter.startRoutine(routineId);
```

### **authAdapter**
```typescript
// Login
const response = await authAdapter.login(credentials);

// Registro
const response = await authAdapter.register(credentials);
```

## 🚀 **Patrones de Uso**

### **1. Crear un Nuevo Hook**
```typescript
// hooks/useNewFeature.ts
export const useNewFeature = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await newFeatureAdapter.getData();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, fetchData };
};
```

### **2. Crear un Nuevo Adapter**
```typescript
// adapters/newFeature.adapter.ts
const newFeatureAdapter = {
  async getData() {
    const response = await axios.get('/api/new-feature');
    return response.data;
  },
  
  async updateData(data) {
    const response = await axios.put('/api/new-feature', data);
    return response.data;
  }
};
```

### **3. Usar en un Componente**
```typescript
// components/NewFeature.tsx
const NewFeature = () => {
  const { data, loading, fetchData } = useNewFeature();
  
  return (
    <div>
      {loading ? <Spinner /> : <DataDisplay data={data} />}
    </div>
  );
};
```

## 🔧 **Configuración**

### **Variables de Entorno**
```env
VITE_API_URL=http://localhost:8080/api
```

### **Interceptores de Axios**
Los adapters manejan automáticamente:
- Tokens de autenticación
- Headers de autorización
- Manejo de errores
- Redirección en caso de token inválido

## 📝 **Convenciones**

### **Nomenclatura**
- **Hooks**: `use[FeatureName]` (ej: `useProfile`, `useStore`)
- **Adapters**: `[featureName].adapter.ts` (ej: `user.adapter.ts`)
- **Interfaces**: `[FeatureName]Data`, `[FeatureName]Response`

### **Estructura de Hooks**
```typescript
interface Use[Feature]Return {
  // Estados
  data: DataType;
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchData: () => Promise<void>;
  updateData: (data: DataType) => Promise<void>;
}
```

### **Estructura de Adapters**
```typescript
const [feature]Adapter = {
  async getData(): Promise<DataType> {
    // Implementación
  },
  
  async updateData(data: DataType): Promise<DataType> {
    // Implementación
  }
};
```

## 🎉 **Resultados**

Esta arquitectura proporciona:
- ✅ **Código más limpio y mantenible**
- ✅ **Reutilización de lógica**
- ✅ **Separación clara de responsabilidades**
- ✅ **Facilidad para testing**
- ✅ **Escalabilidad del proyecto** 