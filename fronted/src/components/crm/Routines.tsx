import { useState, useEffect } from 'react';
import axios from 'axios';

interface Routine {
  id: number;
  name: string;
  focus: string;
  level: string;
  description: string;
}

interface UserRoutine {
  id: number;
  user_id: number;
  routine_id: number;
  assigned_at: string;
  completed_at: string | null;
  user: {
    username: string;
    email: string;
  };
  routine: {
    name: string;
    focus: string;
    level: string;
  };
}

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [userRoutines, setUserRoutines] = useState<UserRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'routines' | 'user-routines'>('routines');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Obtener rutinas disponibles
      const routinesResponse = await axios.get('http://localhost:8080/api/dashboard/routines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRoutines(routinesResponse.data);

      // Obtener rutinas asignadas a usuarios
      const userRoutinesResponse = await axios.get('http://localhost:8080/api/dashboard/user-routines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserRoutines(userRoutinesResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'principiante': return 'text-green-400';
      case 'intermedio': return 'text-yellow-400';
      case 'avanzado': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus.toLowerCase()) {
      case 'fuerza': return 'text-red-400';
      case 'cardio': return 'text-green-400';
      case 'flexibilidad': return 'text-blue-400';
      case 'equilibrio': return 'text-purple-400';
      default: return 'text-orange-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-4xl mx-auto mt-10">
        <div className="text-white text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-orange-400 mb-6">Gestión de Rutinas</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('routines')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'routines' 
              ? 'bg-orange-500 text-white' 
              : 'bg-white/10 text-white hover:bg-orange-500/30'
          }`}
        >
          Rutinas Disponibles
        </button>
        <button
          onClick={() => setActiveTab('user-routines')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'user-routines' 
              ? 'bg-orange-500 text-white' 
              : 'bg-white/10 text-white hover:bg-orange-500/30'
          }`}
        >
          Rutinas Asignadas
        </button>
      </div>

      {activeTab === 'routines' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Rutinas Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routines.map((routine) => (
              <div key={routine.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-lg font-bold text-orange-400 mb-2">{routine.name}</h4>
                <p className="text-gray-300 mb-3 text-sm">{routine.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${getFocusColor(routine.focus)}`}>
                    {routine.focus}
                  </span>
                  <span className={`text-sm font-semibold ${getLevelColor(routine.level)}`}>
                    {routine.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'user-routines' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Rutinas Asignadas a Usuarios</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2">Usuario</th>
                  <th className="text-left py-2">Rutina</th>
                  <th className="text-left py-2">Enfoque</th>
                  <th className="text-left py-2">Nivel</th>
                  <th className="text-left py-2">Asignada</th>
                  <th className="text-left py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {userRoutines.map((userRoutine) => {
                  const isCompleted = userRoutine.completed_at !== null;
                  
                  return (
                    <tr key={userRoutine.id} className="border-b border-white/10">
                      <td className="py-2">{userRoutine.user.username}</td>
                      <td className="py-2">{userRoutine.routine.name}</td>
                      <td className="py-2">
                        <span className={`text-sm ${getFocusColor(userRoutine.routine.focus)}`}>
                          {userRoutine.routine.focus}
                        </span>
                      </td>
                      <td className="py-2">
                        <span className={`text-sm ${getLevelColor(userRoutine.routine.level)}`}>
                          {userRoutine.routine.level}
                        </span>
                      </td>
                      <td className="py-2">
                        {new Date(userRoutine.assigned_at).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          isCompleted 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {isCompleted ? 'Completada' : 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 