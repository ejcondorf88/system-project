import { useState } from 'react';
import { useTrainer } from '@/hooks/useTrainer';
import { TrendingUp, Calendar, Target, Award, BarChart3, Users, Activity, Trophy } from 'lucide-react';
import type { UserRoutine } from '@/adapters/trainer.adapter';

export default function TrainerProgress() {
  const { userRoutines, users, loading } = useTrainer();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('completion');

  // Calcular estadísticas de progreso
  const getProgressStats = () => {
    const totalRoutines = userRoutines.length;
    const completedRoutines = userRoutines.filter(ur => ur.status === 0).length;
    const activeRoutines = userRoutines.filter(ur => ur.status === 1).length;
    const completionRate = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;
    
    // Usuarios con progreso
    const usersWithProgress = new Set(userRoutines.map(ur => ur.user_id)).size;
    const totalUsers = users.length;
    const userEngagementRate = totalUsers > 0 ? Math.round((usersWithProgress / totalUsers) * 100) : 0;

    return {
      totalRoutines,
      completedRoutines,
      activeRoutines,
      completionRate,
      usersWithProgress,
      totalUsers,
      userEngagementRate
    };
  };

  // Obtener datos para gráficos
  const getChartData = () => {
    const stats = getProgressStats();
    
    if (selectedMetric === 'completion') {
      return [
        { name: 'Completadas', value: stats.completedRoutines, color: 'bg-green-500' },
        { name: 'Activas', value: stats.activeRoutines, color: 'bg-orange-500' }
      ];
    } else if (selectedMetric === 'engagement') {
      return [
        { name: 'Usuarios Activos', value: stats.usersWithProgress, color: 'bg-blue-500' },
        { name: 'Usuarios Inactivos', value: stats.totalUsers - stats.usersWithProgress, color: 'bg-gray-500' }
      ];
    }
    
    return [];
  };

  // Obtener progreso por nivel
  const getProgressByLevel = () => {
    const levelStats: Record<string, { total: number; completed: number }> = {};
    
    userRoutines.forEach(ur => {
      const level = ur.routine.level;
      if (!levelStats[level]) {
        levelStats[level] = { total: 0, completed: 0 };
      }
      levelStats[level].total++;
      if (ur.status === 0) {
        levelStats[level].completed++;
      }
    });

    return Object.entries(levelStats).map(([level, stats]) => ({
      level: level === 'beginner' ? 'Principiante' : 
             level === 'intermediate' ? 'Intermedio' : 'Avanzado',
      total: stats.total,
      completed: stats.completed,
      rate: Math.round((stats.completed / stats.total) * 100)
    }));
  };

  // Obtener progreso por enfoque
  const getProgressByFocus = () => {
    const focusStats = {};
    
    userRoutines.forEach(ur => {
      const focus = ur.routine.focus;
      if (!focusStats[focus]) {
        focusStats[focus] = { total: 0, completed: 0 };
      }
      focusStats[focus].total++;
      if (ur.status === 0) {
        focusStats[focus].completed++;
      }
    });

    return Object.entries(focusStats).map(([focus, stats]: [string, any]) => ({
      focus,
      total: stats.total,
      completed: stats.completed,
      rate: Math.round((stats.completed / stats.total) * 100)
    }));
  };

  // Obtener top usuarios
  const getTopUsers = () => {
    const userStats = {};
    
    userRoutines.forEach(ur => {
      if (!userStats[ur.user_id]) {
        userStats[ur.user_id] = { 
          username: ur.user.username, 
          total: 0, 
          completed: 0,
          points: ur.user.points 
        };
      }
      userStats[ur.user_id].total++;
      if (ur.status === 0) {
        userStats[ur.user_id].completed++;
      }
    });

    return Object.values(userStats)
      .map((stats: any) => ({
        ...stats,
        rate: Math.round((stats.completed / stats.total) * 100)
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
  };

  const stats = getProgressStats();
  const chartData = getChartData();
  const progressByLevel = getProgressByLevel();
  const progressByFocus = getProgressByFocus();
  const topUsers = getTopUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-orange-400 mb-2">Análisis de Progreso</h1>
        <p className="text-white text-lg">Monitorea el progreso y rendimiento de tus usuarios</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tasa Completación</p>
              <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Engagement Usuarios</p>
              <p className="text-3xl font-bold text-white">{stats.userEngagementRate}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Users className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.userEngagementRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rutinas Completadas</p>
              <p className="text-3xl font-bold text-white">{stats.completedRoutines}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Target className="text-orange-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-orange-400 text-sm">
              de {stats.totalRoutines} total
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usuarios Activos</p>
              <p className="text-3xl font-bold text-white">{stats.usersWithProgress}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Activity className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-purple-400 text-sm">
              de {stats.totalUsers} usuarios
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-white text-sm mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mes</option>
              <option value="quarter">Último Trimestre</option>
              <option value="year">Último Año</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm mb-2">Métrica</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="completion">Tasa de Completación</option>
              <option value="engagement">Engagement de Usuarios</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Distribución de Progreso
          </h3>
          
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div 
                      className={`${item.color} h-3 rounded-full transition-all duration-500`}
                      style={{ 
                        width: `${stats.totalRoutines > 0 ? (item.value / stats.totalRoutines) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy size={20} />
            Top 5 Usuarios
          </h3>
          
          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <span className="text-orange-400 font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{user.username}</h4>
                  <p className="text-gray-400 text-sm">{user.completed}/{user.total} rutinas completadas</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-bold">{user.rate}%</span>
                  <p className="text-gray-400 text-xs">{user.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress by Level */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target size={20} />
          Progreso por Nivel
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {progressByLevel.map((level, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{level.level}</h4>
                <span className="text-orange-400 font-bold">{level.rate}%</span>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${level.rate}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{level.completed} completadas</span>
                <span className="text-gray-400">{level.total} total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress by Focus */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Award size={20} />
          Progreso por Enfoque
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressByFocus.map((focus, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{focus.focus}</h4>
                <span className="text-blue-400 font-bold">{focus.rate}%</span>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${focus.rate}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{focus.completed} completadas</span>
                <span className="text-gray-400">{focus.total} total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Actividad Reciente
        </h3>
        
        <div className="space-y-3">
          {userRoutines.slice(0, 5).map((userRoutine, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                userRoutine.status === 0 ? 'bg-green-400' : 'bg-orange-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  {userRoutine.user.username} {userRoutine.status === 0 ? 'completó' : 'inició'} "{userRoutine.routine.name}"
                </p>
                <p className="text-gray-400 text-sm">
                  {new Date(userRoutine.updated_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                userRoutine.status === 0 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {userRoutine.status === 0 ? 'Completada' : 'En Progreso'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 