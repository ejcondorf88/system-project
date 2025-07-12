import { useState } from 'react';
import { useTrainer } from '@/hooks/useTrainer';
import { Search, Mail, Target, TrendingUp, Calendar, Award, MessageCircle, Activity } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import type { User } from '@/adapters/trainer.adapter';

export default function TrainerUsers() {
  const { users, userRoutines, loading } = useTrainer();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterLevel, setFilterLevel] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || user.level?.toLowerCase() === filterLevel.toLowerCase();
    return matchesSearch && matchesLevel;
  });

  const getUserStats = (userId: number) => {
    const userRoutinesList = userRoutines.filter(ur => ur.user_id === userId);
    const activeRoutines = userRoutinesList.filter(ur => ur.status === 1);
    const completedRoutines = userRoutinesList.filter(ur => ur.status === 0);
    
    return {
      totalRoutines: userRoutinesList.length,
      activeRoutines: activeRoutines.length,
      completedRoutines: completedRoutines.length,
      completionRate: userRoutinesList.length > 0 ? Math.round((completedRoutines.length / userRoutinesList.length) * 100) : 0
    };
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'bronce': return 'bg-amber-500/20 text-amber-400';
      case 'plata': return 'bg-gray-400/20 text-gray-300';
      case 'oro': return 'bg-yellow-500/20 text-yellow-400';
      case 'platino': return 'bg-purple-500/20 text-purple-400';
      case 'diamante': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'bronce': return '🥉';
      case 'plata': return '🥈';
      case 'oro': return '🥇';
      case 'platino': return '💎';
      case 'diamante': return '💠';
      default: return '⭐';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-orange-400 mb-2">Gestión de Usuarios</h1>
        <p className="text-white text-lg">Administra y monitorea el progreso de tus usuarios</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Usuarios</p>
              <p className="text-3xl font-bold text-white">{users.length}</p>
            </div>
                         <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
               <UserIcon className="text-orange-400" size={24} />
             </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Usuarios Activos</p>
              <p className="text-3xl font-bold text-white">
                {users.filter(u => getUserStats(u.id).activeRoutines > 0).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Activity className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Promedio Puntos</p>
              <p className="text-3xl font-bold text-white">
                {Math.round(users.reduce((acc, u) => acc + u.points, 0) / users.length) || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Award className="text-yellow-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tasa Completación</p>
              <p className="text-3xl font-bold text-white">
                {Math.round(users.reduce((acc, u) => acc + getUserStats(u.id).completionRate, 0) / users.length) || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <TrendingUp className="text-blue-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and Search */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-white text-sm mb-2">Filtrar por Nivel</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">Todos los niveles</option>
                <option value="bronce">Bronce</option>
                <option value="plata">Plata</option>
                <option value="oro">Oro</option>
                <option value="platino">Platino</option>
                <option value="diamante">Diamante</option>
              </select>
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20 max-h-96 overflow-y-auto">
                         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
               <UserIcon size={20} />
               Usuarios ({filteredUsers.length})
             </h3>
            
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const stats = getUserStats(user.id);
                
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-orange-500/20 border border-orange-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <span className="text-orange-400 font-bold">{user.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{user.username}</h4>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs ${getLevelColor(user.level)}`}>
                            {getLevelIcon(user.level)} {user.level || 'Sin nivel'}
                          </span>
                          <span className="text-orange-400 text-xs font-medium">
                            {stats.activeRoutines} rutinas activas
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                                 <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                   <UserIcon className="text-orange-400" size={24} />
                 </div>
                <p className="text-gray-400">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="space-y-6">
              {/* User Profile */}
              <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <span className="text-orange-400 text-2xl font-bold">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedUser.username}</h2>
                      <p className="text-gray-400 text-lg">{selectedUser.email}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedUser.level)}`}>
                          {getLevelIcon(selectedUser.level)} {selectedUser.level || 'Sin nivel'}
                        </span>
                        <span className="text-yellow-400 text-sm font-medium flex items-center gap-1">
                          <Award size={16} />
                          {selectedUser.points} puntos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Miembro desde</p>
                    <p className="text-white font-medium">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const stats = getUserStats(selectedUser.id);
                    return (
                      <>
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-white">{stats.totalRoutines}</p>
                          <p className="text-gray-400 text-sm">Total Rutinas</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-green-400">{stats.activeRoutines}</p>
                          <p className="text-gray-400 text-sm">Activas</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-blue-400">{stats.completedRoutines}</p>
                          <p className="text-gray-400 text-sm">Completadas</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-orange-400">{stats.completionRate}%</p>
                          <p className="text-gray-400 text-sm">Tasa Éxito</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* User Routines */}
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target size={20} />
                  Rutinas Asignadas
                </h3>
                
                {(() => {
                  const userRoutinesList = userRoutines.filter(ur => ur.user_id === selectedUser.id);
                  
                  if (userRoutinesList.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Target className="text-orange-400" size={24} />
                        </div>
                        <p className="text-gray-400 mb-4">No hay rutinas asignadas</p>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                          Asignar Primera Rutina
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userRoutinesList.map((userRoutine) => (
                        <div key={userRoutine.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-white">{userRoutine.routine.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs ${
                              userRoutine.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {userRoutine.status === 1 ? 'Activa' : 'Completada'}
                            </span>
                          </div>
                          
                          <div className="flex gap-2 mb-3">
                            <span className={`px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400`}>
                              {userRoutine.routine.focus}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400`}>
                              {userRoutine.routine.level === 'beginner' ? 'Principiante' : 
                               userRoutine.routine.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">
                              Asignada: {new Date(userRoutine.assigned_at).toLocaleDateString()}
                            </span>
                            {userRoutine.completed_at && (
                              <span className="text-green-400">
                                Completada: {new Date(userRoutine.completed_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Quick Actions */}
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Target size={16} />
                    Asignar Rutina
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <MessageCircle size={16} />
                    Ver Chat
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <TrendingUp size={16} />
                    Ver Progreso
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                             <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                 <UserIcon className="text-orange-400" size={40} />
               </div>
              <h3 className="text-xl font-bold text-white mb-2">Selecciona un Usuario</h3>
              <p className="text-gray-400">Elige un usuario de la lista para ver sus detalles y gestionar sus rutinas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 