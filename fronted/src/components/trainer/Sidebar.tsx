import { NavLink } from 'react-router-dom';

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
      <div className="mb-10 text-2xl font-bold text-green-400 text-center tracking-wide select-none">
        ENTRENADOR
      </div>
      <nav className="flex flex-col gap-2">
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition-colors text-white hover:bg-green-500/30 ${isActive ? 'bg-green-500/20 text-green-300' : ''}`
            }
            end={mod.path === '/trainer'}
          >
            {mod.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 