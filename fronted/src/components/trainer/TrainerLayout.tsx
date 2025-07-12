import  {Sidebar}  from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function TrainerLayout() {
  console.log('Renderizando TrainerLayout');
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div style={{color: 'white', fontWeight: 'bold'}}>TrainerLayout Renderizado</div>
        <Outlet />
      </main>
    </div>
  );
} 