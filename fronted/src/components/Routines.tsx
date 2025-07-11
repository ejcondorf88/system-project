import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import { useRoutines } from '@/hooks/useRoutines';
import { useAuth } from '@/hooks/useAuth';
import type { Routine } from '@/adapters/routines.adapter';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './ui/dialog';
import { useState } from 'react';

const levelColors: Record<string, string> = {
  Gratis: 'bg-green-500/20 text-green-300',
  Plata: 'bg-gray-400/20 text-gray-200',
  Oro: 'bg-yellow-400/20 text-yellow-300',
};

export const Routines = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { routines, loading, error, startRoutine, canAccessRoutine } = useRoutines();
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

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