import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  level: string;
}

interface ChatMessage {
  id: number;
  user_id: number;
  message_type: string;
  content: string;
  timestamp: string;
  session_id?: string;
}

interface ChatSession {
  session_id: string;
  message_count: number;
  first_message: string;
  last_message_time: string;
  created_at: string;
  has_routine_content: boolean;
}

interface ChatAnalytics {
  user: User;
  total_messages: number;
  total_sessions: number;
  routine_related_messages: number;
  last_activity: string | null;
}

export default function UserChatHistory() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userChatHistory, setUserChatHistory] = useState<ChatMessage[]>([]);
  const [userSessions, setUserSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [analytics, setAnalytics] = useState<ChatAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'history' | 'sessions' | 'analytics'>('users');

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/trainer/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/trainer/chat-analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    }
  };

  const fetchUserChatHistory = async (userId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:8080/api/trainer/users/${userId}/chat-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setUserChatHistory(response.data.messages);
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSessions = async (userId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:8080/api/trainer/users/${userId}/chat-sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setUserSessions(response.data.sessions);
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error('Error al cargar sesiones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetail = async (userId: number, sessionId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:8080/api/trainer/users/${userId}/chat-sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSessionMessages(response.data.messages);
      setSelectedSession(sessionId);
    } catch (error) {
      console.error('Error al cargar detalles de sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const getMessageTypeColor = (messageType: string) => {
    return messageType === 'user' ? 'text-blue-400' : 'text-green-400';
  };

  const getRoutineContentColor = (hasRoutineContent: boolean) => {
    return hasRoutineContent ? 'text-green-400' : 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
        <div className="text-white text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-4xl font-bold text-green-400 mb-2">Historial de Chat de Usuarios</h1>
        <p className="text-white text-lg">Monitorea las conversaciones de los usuarios sobre rutinas</p>
      </div>

      {/* Tabs */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'users' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white hover:bg-green-500/30'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'analytics' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white hover:bg-green-500/30'
            }`}
          >
            Analytics
          </button>
          {selectedUser && (
            <>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white hover:bg-green-500/30'
                }`}
              >
                Historial de {selectedUser.username}
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === 'sessions' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white hover:bg-green-500/30'
                }`}
              >
                Sesiones de {selectedUser.username}
              </button>
            </>
          )}
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Usuarios del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-green-400 mb-2">{user.username}</h3>
                  <p className="text-gray-300 text-sm mb-2">{user.email}</p>
                  <span className={`text-sm font-semibold ${
                    user.level === 'Oro' ? 'text-yellow-400' : 
                    user.level === 'Plata' ? 'text-gray-400' : 'text-yellow-600'
                  }`}>
                    {user.level}
                  </span>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        fetchUserChatHistory(user.id);
                        setActiveTab('history');
                      }}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition"
                    >
                      Ver Historial
                    </button>
                    <button
                      onClick={() => {
                        fetchUserSessions(user.id);
                        setActiveTab('sessions');
                      }}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition"
                    >
                      Ver Sesiones
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Analytics de Chat</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2">Usuario</th>
                    <th className="text-left py-2">Nivel</th>
                    <th className="text-left py-2">Total Mensajes</th>
                    <th className="text-left py-2">Sesiones</th>
                    <th className="text-left py-2">Mensajes de Rutinas</th>
                    <th className="text-left py-2">Última Actividad</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((analytic) => (
                    <tr key={analytic.user.id} className="border-b border-white/10">
                      <td className="py-2">{analytic.user.username}</td>
                      <td className="py-2">
                        <span className={`text-sm ${
                          analytic.user.level === 'Oro' ? 'text-yellow-400' : 
                          analytic.user.level === 'Plata' ? 'text-gray-400' : 'text-yellow-600'
                        }`}>
                          {analytic.user.level}
                        </span>
                      </td>
                      <td className="py-2">{analytic.total_messages}</td>
                      <td className="py-2">{analytic.total_sessions}</td>
                      <td className="py-2">
                        <span className={`text-sm ${analytic.routine_related_messages > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                          {analytic.routine_related_messages}
                        </span>
                      </td>
                      <td className="py-2 text-sm">
                        {analytic.last_activity ? formatDate(analytic.last_activity) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && selectedUser && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Historial de Chat - {selectedUser.username}
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userChatHistory.map((message) => (
                <div key={message.id} className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-sm font-medium break-words ${
                    message.message_type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                      : 'bg-white/80 text-gray-900 rounded-bl-none border border-green-200'
                  }`}>
                    <div className="mb-1">
                      <span className={`text-xs ${getMessageTypeColor(message.message_type)}`}>
                        {message.message_type === 'user' ? 'Usuario' : 'IA'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && selectedUser && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Sesiones de Chat - {selectedUser.username}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSessions.map((session) => (
                <div key={session.session_id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">Sesión</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      session.has_routine_content ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {session.has_routine_content ? 'Rutinas' : 'General'}
                    </span>
                  </div>
                  <p className="text-white text-sm mb-2">{session.first_message}</p>
                  <div className="text-xs text-gray-400 mb-3">
                    <div>Mensajes: {session.message_count}</div>
                    <div>Inicio: {formatDate(session.created_at)}</div>
                  </div>
                  <button
                    onClick={() => fetchSessionDetail(selectedUser.id, session.session_id)}
                    className="w-full px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition"
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>

            {/* Detalles de sesión seleccionada */}
            {selectedSession && sessionMessages.length > 0 && (
              <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">
                  Detalles de Sesión - {selectedSession}
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {sessionMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-sm font-medium break-words ${
                        message.message_type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                          : 'bg-white/80 text-gray-900 rounded-bl-none border border-green-200'
                      }`}>
                        <div className="mb-1">
                          <span className={`text-xs ${getMessageTypeColor(message.message_type)}`}>
                            {message.message_type === 'user' ? 'Usuario' : 'IA'}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 