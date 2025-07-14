import React from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaUserShield, FaComments, FaStore, FaChartLine, FaMedal, FaUserFriends, FaCrown, FaLock, FaClipboardList } from 'react-icons/fa';

const features = [
  {
    icon: <FaDumbbell className="text-orange-400 text-3xl" />,
    title: 'Rutinas Inteligentes',
    desc: 'Entrenamientos personalizados y seguimiento de progreso con IA.'
  },
  {
    icon: <FaUserFriends className="text-yellow-300 text-3xl" />,
    title: 'Gestión de Membresías',
    desc: 'Planes flexibles, prueba gratuita y control de asistencia.'
  },
  {
    icon: <FaStore className="text-orange-300 text-3xl" />,
    title: 'Tienda y Recompensas',
    desc: 'Marketplace fitness, sistema de puntos y premios por logros.'
  },
  {
    icon: <FaComments className="text-pink-400 text-3xl" />,
    title: 'Chat con IA',
    desc: 'Asistente virtual, soporte y motivación en tiempo real.'
  },
  {
    icon: <FaChartLine className="text-yellow-400 text-3xl" />,
    title: 'Reportes y Analítica',
    desc: 'Estadísticas, gráficos y métricas de rendimiento.'
  },
  {
    icon: <FaClipboardList className="text-orange-200 text-3xl" />,
    title: 'Auditoría y Seguridad',
    desc: 'Registro de actividades, roles y control de acceso.'
  },
  {
    icon: <FaCrown className="text-yellow-300 text-3xl" />,
    title: 'Roles y Permisos',
    desc: 'Paneles diferenciados para admins, entrenadores y usuarios.'
  },
  {
    icon: <FaMedal className="text-orange-400 text-3xl" />,
    title: 'Logros y Gamificación',
    desc: 'Desbloquea logros, sube de nivel y gana recompensas.'
  },
  {
    icon: <FaLock className="text-pink-400 text-3xl" />,
    title: 'Seguridad Avanzada',
    desc: 'Autenticación JWT, cifrado y protección de datos.'
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Fondo animado igual que login */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-xl px-6 py-16 bg-black/40 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-lg mt-16 mb-8">
        <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-600 drop-shadow-lg mb-6 text-center tracking-tight select-none">
          MF-Lifting
        </h1>
        <p className="text-lg md:text-2xl text-orange-100 mb-10 text-center max-w-lg">
          La plataforma fitness más completa: IA, rutinas, membresías, tienda, reportes y mucho más.<br />
          <span className="text-yellow-300 font-bold">¡Transforma tu gimnasio y tu entrenamiento!</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-2">
          <Link
            to="/login"
            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-50 transition-colors duration-300 shadow-lg hover:shadow-xl text-center"
          >
            Probar Ahora
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-colors duration-300 text-center"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
      {/* Funcionalidades */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">¿Por qué elegir MF-Lifting?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg hover:scale-105 transition-transform">
              <div className="mb-4">{f.icon}</div>
              <div className="text-xl font-semibold text-orange-200 mb-2 text-center">{f.title}</div>
              <div className="text-sm text-gray-200 text-center">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 