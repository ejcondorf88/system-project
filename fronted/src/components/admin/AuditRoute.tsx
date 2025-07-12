import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AuditRouteProps {
  children: React.ReactNode;
}

const AuditRoute: React.FC<AuditRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Verificar si el usuario es superusuario o tiene rol de administrador
  if (!user || (!user.is_superuser && user.role_id !== 1)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuditRoute; 