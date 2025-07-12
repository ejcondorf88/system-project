import { useState, useEffect } from 'react';
import { useTrainer } from '@/hooks/useTrainer';
import { Search, MessageCircle, Target, Calendar, CheckCircle } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import type { User, Routine, ChatMessage } from '@/adapters/trainer.adapter';

export default function AssignRoutines() {
  const { users, routines, userRoutines, chatHistory, getUserChatHistory, assignRoutineToUser, loading } = useTrainer();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setSelectedRoutine(null);
    setAnalysis('');
    
    try {
      const history = await getUserChatHistory(user.id);
      analyzeChatHistory(history);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  const analyzeChatHistory = (history: ChatMessage[]) => {
    if (history.length === 0) {
      setAnalysis('No hay historial de chat disponible para este usuario.');
      return;
    }

    // Análisis simple del historial de chat
    const messages = history.map(msg => msg.content.toLowerCase());
    const allText = messages.join(' ');
    
    let focus = '';
    let level = 'beginner';
    let recommendations = [];

    // Detectar enfoque basado en palabras clave
    if (allText.includes('fuerza') || allText.includes('peso') || allText.includes('musculo')) {
      focus = 'Fuerza';
      recommendations.push('Rutinas de fuerza con pesas');
    } else if (allText.includes('cardio') || allText.includes('correr') || allText.includes('bicicleta')) {
      focus = 'Cardio';
      recommendations.push('Rutinas cardiovasculares');
    } else if (allText.includes('flexibilidad') || allText.includes('estiramiento') || allText.includes('yoga')) {
      focus = 'Flexibilidad';
      recommendations.push('Rutinas de flexibilidad y estiramiento');
    } else if (allText.includes('resistencia') || allText.includes('endurance')) {
      focus = 'Resistencia';
      recommendations.push('Rutinas de resistencia');
    } else {
      focus = 'General';
      recommendations.push('Rutina general de fitness');
    }

    // Detectar nivel
    if (allText.includes('avanzado') || allText.includes('experto') || allText.includes('difícil')) {
      level = 'advanced';
    } else if (allText.includes('intermedio') || allText.includes('medio')) {
      level = 'intermediate';
    }

    // Detectar objetivos específicos
    if (allText.includes('perder peso') || allText.includes('adelgazar')) {
      recommendations.push('Enfoque en pérdida de peso');
    }
    if (allText.includes('ganar musculo') || allText.includes('hipertrofia')) {
      recommendations.push('Enfoque en ganancia muscular');
    }

    setAnalysis(`
      <strong>Análisis del Usuario:</strong><br/>
      • Enfoque recomendado: <span class="text-orange-400">${focus}</span><br/>
      • Nivel sugerido: <span class="text-orange-400">${level === 'beginner' ? 'Principiante' : level === 'intermediate' ? 'Intermedio' : 'Avanzado'}</span><br/>
      • Recomendaciones: ${recommendations.join(', ')}<br/>
      • Mensajes analizados: ${history.length}
    `);
  };

  const handleAssignRoutine = async () => {
    if (!selectedUser || !selectedRoutine) return;

    try {
      await assignRoutineToUser(selectedUser.id, selectedRoutine.id);
      setSelectedRoutine(null);
    } catch (error) {
      console.error('Error al asignar rutina:', error);
    }
  };

  const getUserRoutines = (userId: number) => {
    return userRoutines.filter(ur => ur.user_id === userId);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus.toLowerCase()) {
      case 'fuerza': return 'bg-blue-500/20 text-blue-400';
      case 'cardio': return 'bg-red-500/20 text-red-400';
      case 'flexibilidad': return 'bg-purple-500/20 text-purple-400';
      case 'resistencia': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-orange-400 mb-2">Asignar Rutinas</h1>
        <p className="text-white text-lg">Asigna rutinas personalizadas basadas en el historial de chat de los usuarios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Usuarios */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
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
                const userRoutinesList = getUserRoutines(user.id);
                const activeRoutines = userRoutinesList.filter(ur => ur.status === 1);
                
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'bg-orange-500/20 border border-orange-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white">{user.username}</h4>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">Nivel: {user.level || 'No especificado'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-orange-400 text-sm font-medium">
                          {activeRoutines.length} rutinas activas
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No se encontraron usuarios</p>
              </div>
            )}
          </div>
        </div>

        {/* User Details and Chat History */}
        <div className="lg:col-span-2 space-y-6">
          {selectedUser ? (
            <>
              {/* User Info */}
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedUser.username}</h2>
                    <p className="text-gray-400">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-gray-500 text-sm">Nivel: {selectedUser.level || 'No especificado'}</span>
                      <span className="text-gray-500 text-sm">Puntos: {selectedUser.points}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChatHistory(!showChatHistory)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    {showChatHistory ? 'Ocultar' : 'Ver'} Chat
                  </button>
                </div>

                {/* Chat History */}
                {showChatHistory && (
                  <div className="mt-6 p-4 bg-white/5 rounded-lg max-h-64 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <MessageCircle size={16} />
                      Historial de Chat ({chatHistory.length} mensajes)
                    </h4>
                    
                    {chatHistory.length > 0 ? (
                      <div className="space-y-3">
                        {chatHistory.slice(-10).map((message) => (
                          <div key={message.id} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-orange-400 text-sm font-medium">
                                {message.message_type === 'user' ? 'Usuario' : 'Sistema'}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {new Date(message.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-white text-sm">{message.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">No hay mensajes en el historial</p>
                    )}
                  </div>
                )}

                {/* Analysis */}
                {analysis && (
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                      <Target size={16} />
                      Análisis de Chat
                    </h4>
                    <div 
                      className="text-white text-sm"
                      dangerouslySetInnerHTML={{ __html: analysis }}
                    />
                  </div>
                )}
              </div>

              {/* Current Routines */}
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Rutinas Asignadas
                </h3>
                
                {getUserRoutines(selectedUser.id).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getUserRoutines(selectedUser.id).map((userRoutine) => (
                      <div key={userRoutine.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{userRoutine.routine.name}</h4>
                        <div className="flex gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs ${getFocusColor(userRoutine.routine.focus)}`}>
                            {userRoutine.routine.focus}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getLevelColor(userRoutine.routine.level)}`}>
                            {userRoutine.routine.level === 'beginner' ? 'Principiante' : 
                             userRoutine.routine.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">
                            Asignada: {new Date(userRoutine.assigned_at).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            userRoutine.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {userRoutine.status === 1 ? 'Activa' : 'Completada'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">No hay rutinas asignadas</p>
                )}
              </div>

              {/* Available Routines */}
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Rutinas Disponibles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {routines.filter(r => r.status === 1).map((routine) => (
                    <div
                      key={routine.id}
                      onClick={() => setSelectedRoutine(routine)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedRoutine?.id === routine.id
                          ? 'bg-orange-500/20 border border-orange-500/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <h4 className="font-semibold text-white mb-2">{routine.name}</h4>
                      <div className="flex gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs ${getFocusColor(routine.focus)}`}>
                          {routine.focus}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${getLevelColor(routine.level)}`}>
                          {routine.level === 'beginner' ? 'Principiante' : 
                           routine.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{routine.description}</p>
                    </div>
                  ))}
                </div>

                {selectedRoutine && (
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <h4 className="text-orange-400 font-semibold mb-2">Rutina Seleccionada</h4>
                    <p className="text-white mb-4">{selectedRoutine.name}</p>
                    <button
                      onClick={handleAssignRoutine}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Asignar Rutina
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white/10 rounded-2xl p-12 border border-white/20 text-center">
                           <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <UserIcon size={40} className="text-orange-400" />
             </div>
              <h3 className="text-xl font-bold text-white mb-2">Selecciona un Usuario</h3>
              <p className="text-gray-400">Elige un usuario de la lista para ver su historial y asignar rutinas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 