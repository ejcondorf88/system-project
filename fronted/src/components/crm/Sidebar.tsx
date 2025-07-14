import { NavLink } from 'react-router-dom';
import UserInfo from '@/components/UserInfo';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Dumbbell, 
  Gift, 
  ShoppingCart, 
  UserCheck, 
  BarChart3, 
  Shield,
  Settings,
  Zap
} from 'lucide-react';

const modules = [
  { 
    name: 'Dashboard', 
    path: '/crm', 
    icon: LayoutDashboard,
    description: 'Vista general del sistema'
  },
  { 
    name: 'Usuarios', 
    path: '/crm/users', 
    icon: Users,
    description: 'Gestión de usuarios y perfiles'
  },
  { 
    name: 'Membresías', 
    path: '/crm/memberships', 
    icon: CreditCard,
    description: 'Planes y suscripciones',
    badge: 'DEV'
  },
  { 
    name: 'Rutinas', 
    path: '/crm/routines', 
    icon: Dumbbell,
    description: 'Rutinas de entrenamiento'
  },
  { 
    name: 'Premios', 
    path: '/crm/prizes', 
    icon: Gift,
    description: 'Catálogo de premios'
  },
  { 
    name: 'Compras', 
    path: '/crm/purchases', 
    icon: ShoppingCart,
    description: 'Gestión de compras'
  },
  // { 
  //   name: 'Clientes', 
  //   path: '/crm/clients', 
  //   icon: UserCheck,
  //   description: 'Gestión de clientes'
  // },
  // { 
  //   name: 'Reportes', 
  //   path: '/crm/reports', 
  //   icon: BarChart3,
  //   description: 'Analytics y reportes'
  // },
  { 
    name: 'Auditoría', 
    path: '/crm/audit', 
    icon: Shield,
    description: 'Logs de auditoría'
  },
];

export function Sidebar() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        // Obtener stats generales
        const statsRes = await axios.get('http://localhost:8080/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setTotalUsers(statsRes.data.totalUsers);
        setActiveUsers(statsRes.data.activeUsers);

        // Obtener usuarios y contar inactivos (status 0)
        const usersRes = await axios.get('http://localhost:8080/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const inactivos = Array.isArray(usersRes.data)
          ? usersRes.data.filter(u => u.status === 0 || u.estado === 0).length
          : 0;
        setInactiveUsers(inactivos);
      } catch (error) {
        setTotalUsers(0);
        setActiveUsers(0);
        setInactiveUsers(0);
      }
    };
    fetchStats();
  }, []);

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">Panel Administrativo</h1>
            <p className="text-xs text-slate-400">Panel Administrativo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <NavLink
              key={mod.path}
              to={mod.path}
              className={({ isActive }) =>
                `group relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-500/30 shadow-lg' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
              end={mod.path === '/crm'}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                'group-hover:bg-slate-600/50 bg-slate-700/50'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span>{mod.name}</span>
                  {mod.badge && (
                    <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">
                      {mod.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  {mod.description}
                </p>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3">Resumen Rápido</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-400">{totalUsers}</div>
            <div className="text-xs text-slate-400">Usuarios</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{activeUsers}</div>
            <div className="text-xs text-slate-400">Activos</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">{inactiveUsers}</div>
            <div className="text-xs text-slate-400">Inactivos</div>
          </div>
        </div>
      </div>
      
      {/* User Info and Logout */}
      <div className="p-4 border-t border-white/10">
        <UserInfo />
      </div>
    </aside>
  );
} 