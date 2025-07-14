import { NavLink } from 'react-router-dom';
import UserInfo from '@/components/UserInfo';
import { 
  LayoutDashboard, 
  Dumbbell, 
  UserPlus, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const modules = [
  { 
    name: 'Dashboard', 
    path: '/trainer', 
    icon: LayoutDashboard,
    description: 'Vista general del entrenador'
  },
  { 
    name: 'Rutinas', 
    path: '/trainer/routines', 
    icon: Dumbbell,
    description: 'Crear y gestionar rutinas'
  },
  { 
    name: 'Asignar Rutinas', 
    path: '/trainer/assign', 
    icon: UserPlus,
    description: 'Asignar rutinas a usuarios'
  },
  { 
    name: 'Progreso', 
    path: '/trainer/progress', 
    icon: TrendingUp,
    description: 'Seguimiento de progreso'
  },
];

export function Sidebar() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const users = Array.isArray(res.data) ? res.data : [];
        setTotalUsers(users.length);
        setActiveUsers(users.filter(u => u.status === 1 || u.estado === 1).length);
        setInactiveUsers(users.filter(u => u.status === 0 || u.estado === 0).length);
      } catch {
        setTotalUsers(0);
        setActiveUsers(0);
        setInactiveUsers(0);
      }
    };
    fetchUsers();
  }, []);

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">ENTRENADOR</h1>
            <p className="text-xs text-slate-400">Panel de Entrenamiento</p>
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
              end={mod.path === '/trainer'}
            >
              <div className="p-2 rounded-lg transition-all duration-200 group-hover:bg-slate-600/50 bg-slate-700/50">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span>{mod.name}</span>
                </div>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  {mod.description}
                </p>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Stats - usuarios activos/inactivos */}
      <div className="p-4 border-t border-white/10">
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
      </div>

      {/* Activity Indicator */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-white">Estado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Activo - Disponible</span>
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