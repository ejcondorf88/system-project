import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const routines = [
  { id: 1, name: 'Tren Superior - Fuerza', level: 'Gratis', duration: '45 min', focus: 'Pecho, Espalda, Hombros' },
  { id: 2, name: 'Piernas y Glúteos', level: 'Gratis', duration: '60 min', focus: 'Cuádriceps, Isquiotibiales, Glúteos' },
  { id: 3, name: 'Cardio Intensivo HIIT', level: 'Gratis', duration: '30 min', focus: 'Quema de grasa' },
  { id: 4, name: 'Full Body - Resistencia', level: 'Plata', duration: '75 min', focus: 'Todo el cuerpo' },
  { id: 5, name: 'Yoga y Flexibilidad', level: 'Plata', duration: '45 min', focus: 'Recuperación, Flexibilidad' },
  { id: 6, name: 'Entrenamiento Olímpico Avanzado', level: 'Oro', duration: '90 min', focus: 'Potencia, Técnica' },
];

const levelColors: Record<string, string> = {
  Gratis: 'bg-green-500/20 text-green-300',
  Plata: 'bg-gray-400/20 text-gray-200',
  Oro: 'bg-yellow-400/20 text-yellow-300',
};

export const Routines = () => {
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold text-white text-center mb-6">Mis Rutinas</h1>
        <div className="space-y-4">
          {routines.map((routine, index) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-white">{routine.name}</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${levelColors[routine.level]}`}>
                  {routine.level}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-1">{routine.focus}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-orange-300">
                <span>Duración: {routine.duration}</span>
                <button className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
                  Empezar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Barra de navegación inferior fija */}
      <nav className="w-full max-w-md grid grid-cols-3 gap-0 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/10 rounded-t-2xl border-t border-white/20 overflow-hidden shadow-lg z-30">
        <button onClick={() => navigate('/routines')} className="py-3 text-orange-400 font-semibold text-base bg-orange-500/20 transition-colors">Rutinas</button>
        <button onClick={() => navigate('/chat')} className="py-3 text-white font-semibold text-base hover:bg-orange-500/30 transition-colors border-l border-r border-white/20">Chat</button>
        <button onClick={() => navigate('/profile')} className="py-3 text-white font-semibold text-base hover:bg-orange-500/30 transition-colors">Mi perfil</button>
      </nav>
    </div>
  );
}; 