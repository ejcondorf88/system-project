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
    name: 'Usuarios', 
    path: '/trainer/users', 
    icon: Users,
    description: 'Gestionar usuarios asignados'
  },
  { 
    name: 'Historial Chat', 
    path: '/trainer/chat-history', 
    icon: MessageSquare,
    description: 'Conversaciones con usuarios'
  },
  { 
    name: 'Progreso', 
    path: '/trainer/progress', 
    icon: TrendingUp,
    description: 'Seguimiento de progreso'
  },
];

export function Sidebar() {
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

      {/* Quick Stats */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">Resumen Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-400">45</div>
              <div className="text-xs text-slate-400">Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">12</div>
              <div className="text-xs text-slate-400">Rutinas</div>
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