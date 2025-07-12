import { NavLink } from 'react-router-dom';

const modules = [
  { name: 'Dashboard', path: '/crm' },
  { name: 'Usuarios', path: '/crm/users' },
  { name: 'Membresías', path: '/crm/memberships' },
  { name: 'Rutinas', path: '/crm/routines' },
  { name: 'Premios', path: '/crm/prizes' },
  { name: 'Compras', path: '/crm/purchases' },
  { name: 'Clientes', path: '/crm/clients' },
  { name: 'Reportes', path: '/crm/reports' },
  { name: 'Auditoría', path: '/crm/audit' },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white/10 backdrop-blur-lg border-r border-white/20 flex flex-col py-8 px-4 shadow-2xl">
      <div className="mb-10 text-2xl font-bold text-orange-400 text-center tracking-wide select-none">
        CRM
      </div>
      <nav className="flex flex-col gap-2">
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold transition-colors text-white hover:bg-orange-500/30 ${isActive ? 'bg-orange-500/20 text-orange-300' : ''}`
            }
            end={mod.path === '/crm'}
          >
            {mod.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 