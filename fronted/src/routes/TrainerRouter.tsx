import { Routes, Route, Navigate } from 'react-router-dom';
import TrainerLayout from '../components/trainer/TrainerLayout';
import TrainerDashboard from '../components/trainer/Dashboard';
import TrainerRoutines from '../components/trainer/Routines';
import AssignRoutines from '../components/trainer/AssignRoutines';
import UserChatHistory from '../components/trainer/UserChatHistory';

export default function TrainerRouter() {
  // Aquí deberías validar si el usuario es entrenador
  // Si no lo es, redirigir a login o mostrar acceso denegado
  return (
    <Routes>
      <Route path="/" element={<TrainerLayout />}>
        <Route index element={<TrainerDashboard />} />
        <Route path="routines" element={<TrainerRoutines />} />
        <Route path="assign" element={<AssignRoutines />} />
        <Route path="users" element={<div className="text-white">Usuarios - En desarrollo</div>} />
        <Route path="chat-history" element={<UserChatHistory />} />
        <Route path="progress" element={<div className="text-white">Progreso - En desarrollo</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 