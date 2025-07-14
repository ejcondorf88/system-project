import { Sidebar } from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function CRMLayout() {
  // Estado global temporal para stats de usuarios
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeUsers: 0 });
  const location = useLocation();

  // Si la ruta es dashboard, interceptamos el renderizado del Dashboard para inyectar setUserStats
  const isDashboard = location.pathname === '/crm';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Sidebar totalUsers={userStats.totalUsers} activeUsers={userStats.activeUsers} />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Inyectar setUserStats en Dashboard usando React.cloneElement si es la ruta dashboard */}
        {isDashboard ? (
          <Outlet context={{ setUserStats }} />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
} 