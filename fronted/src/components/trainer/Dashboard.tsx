import { useTrainer } from '@/hooks/useTrainer';

export default function TrainerDashboard() {
  const { stats, loading } = useTrainer();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl mx-auto mt-10 text-center">
        <h1 className="text-4xl font-bold text-orange-400 mb-4">Bienvenido Entrenador</h1>
        <p className="text-lg text-white mb-2">Gestiona las rutinas y el progreso de tus usuarios.</p>
        <p className="text-gray-300">Selecciona un módulo para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-orange-400 mb-2">Dashboard Entrenador</h1>
        <p className="text-white text-lg">Resumen de rutinas y progreso de usuarios</p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Rutinas</p>
              <p className="text-3xl font-bold text-white">{stats.total_routines || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-400 text-xl">🏋️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-orange-400 text-sm">
              Rutinas creadas
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Asignaciones</p>
              <p className="text-3xl font-bold text-white">{stats.total_assignments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-400 text-xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-orange-400 text-sm">
              {stats.users_with_routines || 0} usuarios activos
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completadas</p>
              <p className="text-3xl font-bold text-white">{stats.completed_routines || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-xl">✅</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-400 text-sm">
              {stats.completion_rate || 0}% tasa de éxito
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pendientes</p>
              <p className="text-3xl font-bold text-white">{stats.pending_routines || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xl">⏳</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-400 text-sm">
              Por completar
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usuarios Activos</p>
              <p className="text-3xl font-bold text-white">{stats.users_with_routines || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-blue-400 text-sm">
              Con rutinas asignadas
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tasa de Éxito</p>
              <p className="text-3xl font-bold text-white">{stats.completion_rate || 0}%</p>
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

        {stats.total_users_with_chat && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Usuarios con Chat</p>
                <p className="text-3xl font-bold text-white">{stats.total_users_with_chat}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 text-xl">💬</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-purple-400 text-sm">
                {stats.total_chat_messages || 0} mensajes totales
              </span>
            </div>
          </div>
        )}

        {stats.routine_related_messages && (
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mensajes de Rutinas</p>
                <p className="text-3xl font-bold text-white">{stats.routine_related_messages}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-400 text-xl">🏋️</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-orange-400 text-sm">
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
                    style={{ width: `${(stats.completed_routines || 0) / (stats.total_assignments || 1) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.completed_routines || 0}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Pendientes</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(stats.pending_routines || 0) / (stats.total_assignments || 1) * 100}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm">{stats.pending_routines || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span className="text-white text-sm">Nueva rutina creada</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white text-sm">Rutina completada por usuario</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-white text-sm">Nuevo usuario asignado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-white text-sm">Consulta de chat sobre rutina</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
            Crear Nueva Rutina
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Asignar Rutinas
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
            Ver Progreso
          </button>
        </div>
      </div>
    </div>
  );
} 