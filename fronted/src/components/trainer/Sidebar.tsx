import { NavLink } from 'react-router-dom';
import UserInfo from '@/components/UserInfo';

const modules = [
  { name: 'Dashboard', path: '/trainer' },
  { name: 'Rutinas', path: '/trainer/routines' },
  { name: 'Asignar Rutinas', path: '/trainer/assign' },
  { name: 'Usuarios', path: '/trainer/users' },
  { name: 'Historial Chat', path: '/trainer/chat-history' },
  { name: 'Progreso', path: '/trainer/progress' },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white/10 backdrop-blur-lg border-r border-white/20 flex flex-col py-8 px-4 shadow-2xl">
      <div className="mb-10 text-2xl font-bold text-orange-400 text-center tracking-wide select-none">
        ENTRENADOR
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition-colors text-white hover:bg-orange-500/30 ${isActive ? 'bg-orange-500/20 text-orange-300' : ''}`
            }
            end={mod.path === '/trainer'}
          >
            {mod.name}
          </NavLink>
        ))}
      </nav>
      
      {/* User Info and Logout */}
      <UserInfo />
    </aside>
  );
} 