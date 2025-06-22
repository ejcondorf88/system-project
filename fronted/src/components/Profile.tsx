import React from 'react';
import { motion } from 'framer-motion';
import { FaMedal } from 'react-icons/fa';

const user = {
  name: 'Nombre de Usuario',
  level: 'Plata',
  avatarUrl: '',
  points: 1250,
  benefits: 3,
  achievements: ['10 Rutinas', 'Chat VIP', '1 Año'],
};

const levelColors: Record<string, string> = {
  Bronce: 'from-yellow-700 to-yellow-400',
  Plata: 'from-gray-400 to-gray-200',
  Oro: 'from-yellow-400 to-yellow-200',
};

export const Profile = () => {
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

      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center px-6 py-8 relative transition-transform hover:scale-[1.02]"
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-4xl text-white font-bold border-4 border-white/30 shadow-lg mb-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>👤</span>
            )}
          </div>

          {/* Nivel con medalla */}
          <div className={`flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r ${levelColors[user.level] || 'from-gray-400 to-gray-200'} border border-white/30 text-gray-900 text-lg font-semibold mb-2 shadow-sm animate-pulse`}>
            <FaMedal className="text-xl" />
            Nivel: {user.level}
          </div>

          <div className="text-center text-white text-sm mb-4 px-2">
            ¡Mientras tengas un nivel alto tendrás beneficios exclusivos y recompensas especiales!
          </div>

          {/* Nombre */}
          <div className="text-2xl font-bold text-white mb-2">{user.name}</div>

          {/* Puntos acumulados */}
          <div className="text-white text-sm mb-1">
            ⭐ Puntos acumulados: <span className="text-orange-300 font-semibold">{user.points}</span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full mt-2 mb-4">
            <div className="text-xs text-white mb-1">Progreso al siguiente nivel</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Beneficios activos */}
          <div className="mb-4 bg-white/10 px-4 py-2 rounded-xl border border-white/20 text-white text-sm shadow">
            🎁 Beneficios activos: <span className="text-orange-300 font-semibold">{user.benefits}</span>
          </div>

          {/* Logros */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {user.achievements.map((achieve, index) => (
              <span key={index} className="bg-yellow-300 text-xs px-2 py-1 rounded-full text-black font-semibold shadow">
                {achieve}
              </span>
            ))}
          </div>

          {/* Botón de compartir */}
          <button className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-400 transition text-sm">
            Compartir mi nivel
          </button>
        </motion.div>
      </main>

      {/* Barra de navegación inferior */}
      <nav className="w-full max-w-md grid grid-cols-3 gap-0 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/10 rounded-t-2xl border-t border-white/20 overflow-hidden shadow-lg z-30">
        <button className="py-3 text-white font-semibold text-base hover:bg-orange-500/30 transition-colors">Rutinas</button>
        <button className="py-3 text-white font-semibold text-base hover:bg-orange-500/30 transition-colors border-l border-r border-white/20">Chat</button>
        <button className="py-3 text-orange-400 font-semibold text-base bg-orange-500/20 transition-colors border-l border-white/20">Mi perfil</button>
      </nav>
    </div>
  );
};
