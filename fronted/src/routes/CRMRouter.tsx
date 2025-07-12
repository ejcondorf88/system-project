import { Routes, Route, Navigate } from 'react-router-dom';
import CRMLayout from '../components/crm/CRMLayout';
import Dashboard from '../components/crm/Dashboard';
import Users from '../components/crm/Users';
import Memberships from '../components/crm/Memberships';
import Routines from '../components/crm/Routines';
import Clients from '../components/crm/Clients';
import Reports from '../components/crm/Reports';

export default function CRMRouter() {
  // Aquí deberías validar si el usuario es superusuario (puedes usar un hook de auth)
  // Si no lo es, redirigir a login o mostrar acceso denegado
  // Por ahora, solo estructura de rutas
  return (
    <Routes>
      <Route path="/" element={<CRMLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="memberships" element={<Memberships />} />
        <Route path="routines" element={<Routines />} />
        <Route path="clients" element={<Clients />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 