import { useState, useEffect } from 'react';
import axios from 'axios';

interface TrainerStats {
  totalRoutines: number;
  totalAssignments: number;
  completedRoutines: number;
  pendingRoutines: number;
  usersWithRoutines: number;
  completionRate: number;
  totalUsersWithChat?: number;
  totalChatMessages?: number;
  routineRelatedMessages?: number;
}

export default function TrainerDashboard() {
  const [stats, setStats] = useState<TrainerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainerStats();
  }, []);

  const fetchTrainerStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/trainer/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Datos de ejemplo para demostración
      setStats({
        totalRoutines: 25,
        totalAssignments: 180,
        completedRoutines: 120,
        pendingRoutines: 60,
        usersWithRoutines: 45,
        completionRate: 66.7,
        totalUsersWithChat: 38,
        totalChatMessages: 1250,
        routineRelatedMessages: 420
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
        <div className="text-white text-center">Cargando estadísticas...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl mx-auto mt-10 text-center">
        <h1 className="text-4xl font-bold text-green-400 mb-4">Bienvenido Entrenador</h1>
        <p className="text-lg text-white mb-2">Gestiona las rutinas y el progreso de tus usuarios.</p>
        <p className="text-gray-300">Selecciona un módulo para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-green-400 mb-2">Dashboard Entrenador</h1>
        <p className="text-white text-lg">Resumen de rutinas y progreso de usuarios</p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Rutinas</p>
              <p className="text-3xl font-bold text-white">{stats.totalRoutines}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xl">🏋️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              Rutinas creadas
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Asignaciones</p>
              <p className="text-3xl font-bold text-white">{stats.totalAssignments}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              {stats.usersWithRoutines} usuarios activos
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completadas</p>
              <p className="text-3xl font-bold text-white">{stats.completedRoutines}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xl">✅</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              {stats.completionRate}% tasa de éxito
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pendientes</p>
              <p className="text-3xl font-bold text-white">{stats.pendingRoutines}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-400 text-xl">⏳</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-orange-400 text-sm">
              Por completar
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usuarios Activos</p>
              <p className="text-3xl font-bold text-white">{stats.usersWithRoutines}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400 text-xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              Con rutinas asignadas
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tasa de Éxito</p>
              <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xl">📈</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              Rutinas completadas
            </span>
          </div>
        </div>

        {stats.totalUsersWithChat && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Usuarios con Chat</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsersWithChat}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 text-xl">💬</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-blue-400 text-sm">
                {stats.totalChatMessages} mensajes totales
              </span>
            </div>
          </div>
        )}

        {stats.routineRelatedMessages && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mensajes de Rutinas</p>
                <p className="text-3xl font-bold text-white">{stats.routineRelatedMessages}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 text-xl">🏋️</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-purple-400 text-sm">
                Consultas sobre ejercicios
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Gráfico de Progreso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Estado de Rutinas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Completadas</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.completedRoutines / stats.totalAssignments) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.completedRoutines}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Pendientes</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(stats.pendingRoutines / stats.totalAssignments) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.pendingRoutines}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition">
              ➕ Crear Nueva Rutina
            </button>
            <button className="w-full p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
              👥 Asignar Rutina
            </button>
            <button className="w-full p-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition">
              📊 Ver Progreso
            </button>
            <button className="w-full p-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition">
              📈 Reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 