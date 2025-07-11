import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  level: string;
  points: number;
  benefits: number;
  is_superuser: boolean;
  estado: boolean;
  creacion: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  type: 'points' | 'level';
}

const AssignPointsModal = ({ isOpen, onClose, user, type }: ModalProps) => {
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:8080/api/users/assign-points', {
        user_id: user.id,
        amount: parseInt(points),
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Puntos asignados:', response.data);
      alert('Puntos asignados correctamente');
      onClose();
      window.location.reload(); // Recargar para ver los cambios
    } catch (error) {
      console.error('Error al asignar puntos:', error);
      alert('Error al asignar puntos');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">
          Asignar Puntos a {user.username}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-2">Cantidad de puntos:</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              placeholder="Ej: 100"
              required
            />
          </div>
          
          <div>
            <label className="block text-white text-sm mb-2">Razón:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              placeholder="Ej: Completó rutina"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition disabled:opacity-50"
            >
              {loading ? 'Asignando...' : 'Asignar Puntos'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChangeLevelModal = ({ isOpen, onClose, user, type }: ModalProps) => {
  const [newLevel, setNewLevel] = useState(user?.level || '');
  const [loading, setLoading] = useState(false);

  const levels = ['Bronce', 'Plata', 'Oro'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(`http://localhost:8080/api/users/${user.id}/level`, {
        level: newLevel
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Nivel actualizado:', response.data);
      alert('Nivel actualizado correctamente');
      onClose();
      window.location.reload(); // Recargar para ver los cambios
    } catch (error) {
      console.error('Error al cambiar nivel:', error);
      alert('Error al cambiar nivel');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">
          Cambiar Nivel de {user.username}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-2">Nuevo nivel:</label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              required
            >
              {levels.map(level => (
                <option key={level} value={level} className="bg-gray-800">
                  {level}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Cambiar Nivel'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'points' | 'level'>('points');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get('http://localhost:8080/api/users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Usuarios obtenidos:', response.data);
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user: User, type: 'points' | 'level') => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-orange-400">Gestión de Usuarios</h2>
          <div className="text-white text-sm">
            Total: {users.length} usuarios
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-semibold">ID</th>
                <th className="text-left py-3 px-4 font-semibold">Usuario</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Teléfono</th>
                <th className="text-left py-3 px-4 font-semibold">Nivel</th>
                <th className="text-left py-3 px-4 font-semibold">Puntos</th>
                <th className="text-left py-3 px-4 font-semibold">Beneficios</th>
                <th className="text-left py-3 px-4 font-semibold">Superuser</th>
                <th className="text-left py-3 px-4 font-semibold">Estado</th>
                <th className="text-left py-3 px-4 font-semibold">Registro</th>
                <th className="text-left py-3 px-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.level === 'Oro' ? 'bg-yellow-500/20 text-yellow-300' :
                      user.level === 'Plata' ? 'bg-gray-500/20 text-gray-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {user.level}
                    </span>
                  </td>
                  <td className="py-3 px-4">{user.points}</td>
                  <td className="py-3 px-4">{user.benefits}</td>
                  <td className="py-3 px-4">
                    {user.is_superuser ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.estado ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{formatDate(user.creacion)}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 flex-wrap">
                      <button 
                        onClick={() => openModal(user, 'points')}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-400 transition"
                      >
                        + Puntos
                      </button>
                      <button 
                        onClick={() => openModal(user, 'level')}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-400 transition"
                      >
                        Nivel
                      </button>
                      <button className="px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-400 transition">
                        Editar
                      </button>
                      <button className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-400 transition">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No hay usuarios registrados
          </div>
        )}
      </div>

      {/* Modales */}
      {modalType === 'points' && (
        <AssignPointsModal 
          isOpen={showModal} 
          onClose={closeModal} 
          user={selectedUser} 
          type={modalType} 
        />
      )}
      
      {modalType === 'level' && (
        <ChangeLevelModal 
          isOpen={showModal} 
          onClose={closeModal} 
          user={selectedUser} 
          type={modalType} 
        />
      )}
    </>
  );
} 