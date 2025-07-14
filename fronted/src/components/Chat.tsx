import { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { useChat } from '../hooks/useChat';
import { useLogout } from '@/hooks/useLogout';

export const Chat = () => {
  const { messages, input, setInput, sendMessage, isLoading, isLoadingHistory, clearHistory } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const location = useLocation();
  
  // Obtener información de la rutina seleccionada
  const selectedRoutine = location.state?.selectedRoutine;
  const routineStarted = location.state?.routineStarted;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensaje automático cuando se inicia una rutina
  useEffect(() => {
    if (routineStarted && selectedRoutine && messages.length === 0) {
      const routineMessage = `¡Hola! Has iniciado la rutina "${selectedRoutine.name}". Esta rutina se enfoca en: ${selectedRoutine.focus} y tiene una duración de ${selectedRoutine.duration}. ¿Te gustaría que te guíe durante el entrenamiento?`;
      
      // Enviar mensaje automático después de un breve delay
      setTimeout(() => {
        sendMessage(routineMessage);
      }, 1000);
    }
  }, [routineStarted, selectedRoutine, messages.length]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -inset-10 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Cabecera fija */}
      <header className="w-full max-w-md flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-lg border-b border-white/20 fixed top-0 left-1/2 -translate-x-1/2 z-20 rounded-b-2xl">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-lg font-bold border-4 border-white/30 shadow-lg">ia</div>
        <div className="flex-1">
          {routineStarted && selectedRoutine ? (
            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-green-500/30 to-blue-500/30 border border-green-500/30 text-white text-sm font-semibold text-center shadow-sm">
              🏋️ {selectedRoutine.name}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500/30 to-yellow-500/30 border border-orange-500/30 text-white text-base font-semibold text-center shadow-sm">
              Bienvenido al sistemas
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearHistory}
            className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-400 transition"
            title="Limpiar historial"
          >
            🗑️
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-400 transition"
          >
            <FaSignOutAlt className="text-xs" />
            Salir
          </button>
        </div>
      </header>

      {/* Área de mensajes, con espacio para header y footer */}
      <main className="flex-1 w-full max-w-md mx-auto pt-20 pb-28 px-2 flex flex-col overflow-y-auto">
        {routineStarted && selectedRoutine && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <span>🏋️</span>
              <span className="font-semibold">Rutina Activa:</span>
              <span>{selectedRoutine.name}</span>
            </div>
            <div className="text-xs text-green-400 mt-1">
              Duración: {selectedRoutine.duration} | Enfoque: {selectedRoutine.focus}
            </div>
          </div>
        )}
        <div className="flex-1 space-y-2">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-white text-sm">Cargando historial...</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-sm font-medium break-words ${msg.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-br-none'
                    : 'bg-white/80 text-gray-900 rounded-bl-none border border-orange-200'}
                  `}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input fijo en la parte inferior */}
      <form
        className="w-full max-w-md fixed bottom-16 left-1/2 -translate-x-1/2 px-2 flex items-center gap-2 z-20"
        onSubmit={e => {
          e.preventDefault();
          console.log("Submit presionado");
          sendMessage();
        }}
      >
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-2xl border border-white/20 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 transition-all duration-300 bg-white/20 backdrop-blur-sm placeholder-gray-400 text-white"
          placeholder="Escribe aquí tu consulta"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`px-5 py-3 rounded-2xl font-bold text-white transition-all duration-300 ${isLoading || !input.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 hover:scale-105 shadow-lg'}`}
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </form>

      {/* Barra de navegación inferior fija */}
      <nav className="w-full max-w-md grid grid-cols-4 gap-0 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/10 rounded-t-2xl border-t border-white/20 overflow-hidden shadow-lg z-30">
        <button onClick={() => navigate('/routines')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors">Rutinas</button>
        <button onClick={() => navigate('/chat')} className="py-3 text-orange-400 font-semibold text-sm bg-orange-500/20 transition-colors border-l border-white/20">Chat</button>
        <button onClick={() => navigate('/store')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors border-l border-white/20">Tienda</button>
        <button onClick={() => navigate('/profile')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors border-l border-white/20">Perfil</button>
      </nav>
    </div>
  );
};