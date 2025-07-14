import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import { Target, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useRoutines } from '@/hooks/useRoutines';
import { useAuth } from '@/hooks/useAuth';
import userAdapter, { type UserRoutine } from '@/adapters/user.adapter';
import type { Routine } from '@/adapters/routines.adapter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const levelColors: Record<string, string> = {
  Gratis: 'bg-green-500/20 text-green-300',
  Plata: 'bg-gray-400/20 text-gray-200',
  Oro: 'bg-yellow-400/20 text-yellow-300',
};

// Define el tipo de ejercicio para rutinas
type RoutineExercise = {
  name: string;
  series: number | string;
  reps: number | string;
  rir: string;
  tempo: string;
  rest: string;
};

// Helper para saber si una rutina tiene ejercicios
function hasExercises(routine: any): routine is { exercises: RoutineExercise[] } {
  return routine && Array.isArray(routine.exercises);
}

export const Routines = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { routines, canAccessRoutine } = useRoutines();
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [myRoutines, setMyRoutines] = useState<UserRoutine[]>([]);
  const [loadingMyRoutines, setLoadingMyRoutines] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'assigned'>('assigned');
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [modalRoutine, setModalRoutine] = useState<UserRoutine | null>(null);
  const [aiExercises, setAiExercises] = useState<RoutineExercise[] | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Cargar rutinas asignadas
  useEffect(() => {
    const loadMyRoutines = async () => {
      try {
        setLoadingMyRoutines(true);
        const data = await userAdapter.getMyRoutines();
        setMyRoutines(data);
      } catch (error) {
        console.error('Error loading assigned routines:', error);
      } finally {
        setLoadingMyRoutines(false);
      }
    };

    loadMyRoutines();
  }, []);

  // Nueva función para marcar rutina como completada
  const marcarComoCompletada = async (userRoutineId: number) => {
    try {
      await userAdapter.completeUserRoutine(userRoutineId);
      toast.success('¡Rutina marcada como completada!');
      // Refrescar rutinas asignadas
      const data = await userAdapter.getMyRoutines();
      setMyRoutines(data);
    } catch (error) {
      toast.error('Error al marcar rutina como completada');
      console.error(error);
    }
  };

  const handleStartRoutine = async (userRoutine: UserRoutine) => {
    setModalRoutine(userRoutine);
    setAiExercises(null);
    setShowRoutineModal(true);
    // Si la rutina no tiene ejercicios, genera con IA
    if (!hasExercises(userRoutine.routine)) {
      setLoadingAI(true);
      try {
        const res = await userAdapter.generateRoutineWithAI({
          name: userRoutine.routine.name,
          level: userRoutine.routine.level,
          focus: userRoutine.routine.focus,
          description: userRoutine.routine.description || '',
        });
        setAiExercises(res.exercises);
      } catch (err: any) {
        toast.error(err.message || 'Error generando rutina con IA');
      } finally {
        setLoadingAI(false);
      }
    }
  };

  const getLevelColor = (level: string) => {
    const levelMap: Record<string, string> = {
      'beginner': 'bg-green-500/20 text-green-300',
      'intermediate': 'bg-yellow-500/20 text-yellow-300',
      'advanced': 'bg-red-500/20 text-red-300',
      'principiante': 'bg-green-500/20 text-green-300',
      'intermedio': 'bg-yellow-500/20 text-yellow-300',
      'avanzado': 'bg-red-500/20 text-red-300',
    };
    return levelMap[level.toLowerCase()] || 'bg-gray-500/20 text-gray-300';
  };

  const getFocusColor = (focus: string) => {
    const focusMap: Record<string, string> = {
      'fuerza': 'bg-blue-500/20 text-blue-300',
      'cardio': 'bg-red-500/20 text-red-300',
      'flexibilidad': 'bg-purple-500/20 text-purple-300',
      'resistencia': 'bg-orange-500/20 text-orange-300',
      'equilibrio': 'bg-indigo-500/20 text-indigo-300',
    };
    return focusMap[focus.toLowerCase()] || 'bg-gray-500/20 text-gray-300';
  };

  const getStatusText = (status: number, completedAt?: string) => {
    if (completedAt) return 'Completada';
    return status === 1 ? 'Activa' : 'Inactiva';
  };

  const getStatusColor = (status: number, completedAt?: string) => {
    if (completedAt) return 'bg-green-500/20 text-green-400';
    return status === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -inset-10 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      
      <main className="flex-1 w-full max-w-md mx-auto pt-8 pb-24 px-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Mis Rutinas</h1>
          <button 
            onClick={logout}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-400 transition"
          >
            <FaSignOutAlt className="text-xs" />
            Salir
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'assigned'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Target size={16} className="inline mr-2" />
            Asignadas
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              activeTab === 'available'
                ? 'bg-orange-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Disponibles
          </button>
        </div>

        {/* Contenido de rutinas asignadas */}
        {activeTab === 'assigned' && (
          <div className="space-y-4">
            {loadingMyRoutines ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Cargando rutinas asignadas...</p>
              </div>
            ) : myRoutines.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-orange-400" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No tienes rutinas asignadas</h2>
                <p className="text-gray-300 mb-4">
                  Tu entrenador aún no te ha asignado ninguna rutina personalizada.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Ver Rutinas Disponibles
                </button>
              </div>
            ) : (
              myRoutines.map((userRoutine, index) => (
                <motion.div
                  key={userRoutine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-white line-clamp-2">
                      {userRoutine.routine.name}
                    </h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(userRoutine.status, userRoutine.completed_at)}`}>
                      {getStatusText(userRoutine.status, userRoutine.completed_at)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {userRoutine.routine.description}
                  </p>

                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getFocusColor(userRoutine.routine.focus)}`}>
                      {userRoutine.routine.focus}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getLevelColor(userRoutine.routine.level)}`}>
                      {userRoutine.routine.level === 'beginner' ? 'Principiante' : 
                       userRoutine.routine.level === 'intermediate' ? 'Intermedio' : 
                       userRoutine.routine.level === 'advanced' ? 'Avanzado' : userRoutine.routine.level}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>Asignada: {new Date(userRoutine.assigned_at).toLocaleDateString()}</span>
                    </div>
                    
                    {userRoutine.completed_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={12} />
                        <span>Completada: {new Date(userRoutine.completed_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartRoutine(userRoutine)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors font-semibold text-sm"
                  >
                    {userRoutine.completed_at ? 'Ver Detalles' : 'Comenzar Rutina'}
                  </button>
                  {!userRoutine.completed_at && (
                    <button
                      onClick={() => marcarComoCompletada(userRoutine.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors font-semibold text-sm mt-2"
                    >
                      Marcar como completada
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Contenido de rutinas disponibles */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            {routines.map((routine, index) => {
              const canAccess = canAccessRoutine(routine.level);
              return (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg ${
                    !canAccess ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-white">{routine.name}</h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${levelColors[routine.level]}`}>
                      {routine.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{routine.focus}</p>
                  
                  {!canAccess && (
                    <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <p className="text-xs text-yellow-300">
                        🔒 Necesitas nivel {routine.level} o superior para acceder
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3 text-xs text-orange-300">
                    <span>Duración: {routine.duration}</span>
                    <button 
                      onClick={() => setSelectedRoutine(routine)}
                      disabled={!canAccess}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                        canAccess 
                          ? 'bg-orange-500 text-white hover:bg-orange-600' 
                          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {canAccess ? 'Ver detalles' : 'Bloqueado'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
      {/* Modal de detalles de rutina */}
      <Dialog open={!!selectedRoutine} onOpenChange={open => !open && setSelectedRoutine(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRoutine?.name}</DialogTitle>
            <DialogDescription>
              <div className="mt-2">
                <p><b>Nivel:</b> {selectedRoutine?.level}</p>
                <p><b>Duración:</b> {selectedRoutine?.duration}</p>
                <p><b>Enfoque:</b> {selectedRoutine?.focus}</p>
              </div>
              {selectedRoutine?.exercises && (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-xs text-white border border-white/20 rounded-lg">
                    <thead>
                      <tr className="bg-orange-500/80">
                        <th className="px-2 py-1">Ejercicio</th>
                        <th className="px-2 py-1">Series</th>
                        <th className="px-2 py-1">Repeticiones</th>
                        <th className="px-2 py-1">RIR</th>
                        <th className="px-2 py-1">Ritmo</th>
                        <th className="px-2 py-1">Descanso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRoutine.exercises.map((ex, idx) => (
                        <tr key={idx} className="bg-white/10">
                          <td className="px-2 py-1">{ex.name}</td>
                          <td className="px-2 py-1 text-center">{ex.series}</td>
                          <td className="px-2 py-1 text-center">{ex.reps}</td>
                          <td className="px-2 py-1 text-center">{ex.rir}</td>
                          <td className="px-2 py-1 text-center">{ex.tempo}</td>
                          <td className="px-2 py-1 text-center">{ex.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">Cerrar</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal de rutina tipo Full Body */}
      <Dialog open={showRoutineModal} onOpenChange={open => { setShowRoutineModal(open); if (!open) setModalRoutine(null); }}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-gray-900 to-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-400 mb-2">
              {modalRoutine?.routine.name || 'Rutina'}
            </DialogTitle>
            <DialogDescription>
              <div className="mb-4 text-white">
                <span className="font-semibold">Nivel:</span> {modalRoutine?.routine.level} &nbsp;|&nbsp;
                <span className="font-semibold">Enfoque:</span> {modalRoutine?.routine.focus}
              </div>
              {/* Tabla de ejercicios */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-white/20 rounded-lg">
                  <thead>
                    <tr className="bg-orange-500/80 text-white">
                      <th className="px-2 py-1">Ejercicio</th>
                      <th className="px-2 py-1">Series</th>
                      <th className="px-2 py-1">Repeticiones</th>
                      <th className="px-2 py-1">RIR</th>
                      <th className="px-2 py-1">Ritmo</th>
                      <th className="px-2 py-1">Descanso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingAI && (
                      <tr><td colSpan={6} className="text-center py-4 text-orange-300">Generando rutina con IA...</td></tr>
                    )}
                    {aiExercises && aiExercises.map((ex: RoutineExercise, idx: number) => (
                      <tr key={idx} className="bg-white/10 text-white">
                        <td className="px-2 py-1">{ex.name}</td>
                        <td className="px-2 py-1 text-center">{ex.series}</td>
                        <td className="px-2 py-1 text-center">{ex.reps}</td>
                        <td className="px-2 py-1 text-center">{ex.rir}</td>
                        <td className="px-2 py-1 text-center">{ex.tempo}</td>
                        <td className="px-2 py-1 text-center">{ex.rest}</td>
                      </tr>
                    ))}
                    {modalRoutine && hasExercises(modalRoutine.routine) &&
                      modalRoutine.routine.exercises.map((ex: RoutineExercise, idx: number) => (
                        <tr key={idx} className="bg-white/10 text-white">
                          <td className="px-2 py-1">{ex.name}</td>
                          <td className="px-2 py-1 text-center">{ex.series}</td>
                          <td className="px-2 py-1 text-center">{ex.reps}</td>
                          <td className="px-2 py-1 text-center">{ex.rir}</td>
                          <td className="px-2 py-1 text-center">{ex.tempo}</td>
                          <td className="px-2 py-1 text-center">{ex.rest}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowRoutineModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                {modalRoutine && !modalRoutine.completed_at && (
                  <button
                    onClick={() => { marcarComoCompletada(modalRoutine.id); setShowRoutineModal(false); }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Marcar como completada
                  </button>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Barra de navegación inferior fija */}
      <nav className="w-full max-w-md grid grid-cols-4 gap-0 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/10 rounded-t-2xl border-t border-white/20 overflow-hidden shadow-lg z-30">
        <button onClick={() => navigate('/routines')} className="py-3 text-orange-400 font-semibold text-sm bg-orange-500/20 transition-colors">Rutinas</button>
        <button onClick={() => navigate('/chat')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors border-l border-white/20">Chat</button>
        <button onClick={() => navigate('/store')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors border-l border-white/20">Tienda</button>
        <button onClick={() => navigate('/profile')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors border-l border-white/20">Perfil</button>
      </nav>
    </div>
  );
}; 