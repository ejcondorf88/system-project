import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

interface SuperuserRouteProps {
  children: ReactNode;
}

export const SuperuserRoute = ({ children }: SuperuserRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('SuperuserRoute:', { isAuthenticated, user, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_superuser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

interface TrainerRouteProps {
  children: ReactNode;
}

export const TrainerRoute = ({ children }: TrainerRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('TrainerRoute:', { isAuthenticated, user, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si es entrenador o superusuario
  const isTrainer = user?.is_trainer || user?.is_superuser;
  
  if (!isTrainer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Acceso Denegado</h1>
          <p className="text-white mb-4">Solo los entrenadores pueden acceder a esta sección.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}; 