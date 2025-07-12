import { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalMemberships: number;
  activeMemberships: number;
  totalRoutines: number;
  completedRoutines: number;
  totalPoints: number;
  averagePointsPerUser: number;
  levelDistribution: {
    bronce: number;
    plata: number;
    oro: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Datos de ejemplo para demostración
      setStats({
        totalUsers: 150,
        activeUsers: 120,
        totalMemberships: 45,
        activeMemberships: 38,
        totalRoutines: 25,
        completedRoutines: 180,
        totalPoints: 12500,
        averagePointsPerUser: 83,
        levelDistribution: {
          bronce: 80,
          plata: 45,
          oro: 25
        },
        recentActivity: [
          {
            id: 1,
            type: 'points',
            description: 'Juan Pérez completó rutina de fuerza',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: 'membership',
            description: 'María García renovó membresía Premium',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 3,
            type: 'routine',
            description: 'Carlos López asignó nueva rutina',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ]
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
        <h1 className="text-4xl font-bold text-orange-400 mb-4">Bienvenido al CRM</h1>
        <p className="text-lg text-white mb-2">Gestiona tus módulos y opciones desde el menú lateral.</p>
        <p className="text-gray-300">Selecciona un módulo para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-orange-400 mb-2">Dashboard CRM</h1>
        <p className="text-white text-lg">Resumen general del sistema</p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Usuarios</p>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              {stats.activeUsers} activos
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Membresías</p>
              <p className="text-3xl font-bold text-white">{stats.totalMemberships}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xl">💎</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              {stats.activeMemberships} activas
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rutinas</p>
              <p className="text-3xl font-bold text-white">{stats.totalRoutines}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-purple-400 text-xl">🏋️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              {stats.completedRoutines} completadas
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Puntos Totales</p>
              <p className="text-3xl font-bold text-white">{stats.totalPoints.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xl">⭐</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              Promedio: {stats.averagePointsPerUser}
            </span>
          </div>
        </div>
      </div>

      {/* Distribución de Niveles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Distribución de Niveles</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Bronce</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${(stats.levelDistribution.bronce / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.levelDistribution.bronce}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Plata</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gray-400 h-2 rounded-full" 
                    style={{ width: `${(stats.levelDistribution.plata / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.levelDistribution.plata}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Oro</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: `${(stats.levelDistribution.oro / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.levelDistribution.oro}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 