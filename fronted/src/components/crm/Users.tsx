import { useState } from 'react';
import { Users as UsersIcon, Search, Filter, Plus, Edit, Trash2, Award, Crown, UserPlus, RefreshCw, Mail, Phone, Calendar } from 'lucide-react';
import { useUsers, type User } from '../../hooks/useUsers';

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
  const { assignPoints } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await assignPoints(user.id, parseInt(points), reason);
      alert('Puntos asignados correctamente');
      onClose();
      setPoints('');
      setReason('');
    } catch (error) {
      alert('Error al asignar puntos');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Award className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Asignar Puntos a {user.username}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cantidad de puntos:</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: 100"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Razón:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ej: Completó rutina"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Asignando...' : 'Asignar Puntos'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
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
  const { changeUserLevel } = useUsers();

  const levels = ['Bronce', 'Plata', 'Oro'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await changeUserLevel(user.id, newLevel);
      alert('Nivel actualizado correctamente');
      onClose();
      setNewLevel('');
    } catch (error) {
      alert('Error al cambiar nivel');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Crown className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Cambiar Nivel de {user.username}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nuevo nivel:</label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Actualizando...' : 'Cambiar Nivel'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
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
  const {
    users,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    assignPoints,
    changeUserLevel,
    fetchUsers
  } = useUsers();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    user: User | null;
    type: 'points' | 'level';
  }>({
    isOpen: false,
    user: null,
    type: 'points'
  });

  const openModal = (user: User, type: 'points' | 'level') => {
    setModalState({ isOpen: true, user, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, user: null, type: 'points' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronce': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Plata': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Oro': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: number) => {
    return status === 1 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
              <UsersIcon className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestión de Usuarios</h1>
              <p className="text-slate-600">Administra usuarios, puntos y niveles</p>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 font-medium">Actualizar</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nombre o email"
                  value={filters.search}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nivel</label>
              <select
                value={filters.level}
                onChange={(e) => updateFilters({ level: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="Bronce">Bronce</option>
                <option value="Plata">Plata</option>
                <option value="Oro">Oro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
              <select
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Usuarios ({users.length})</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500">
                  {loading ? 'Cargando...' : `${users.length} usuarios encontrados`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Cargando usuarios...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contacto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nivel</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Puntos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{user.username}</div>
                            <div className="text-sm text-slate-500">
                              {user.is_superuser ? 'Superusuario' : 'Usuario'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Phone className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-500">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getLevelColor(user.level)}`}>
                          {user.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 font-medium">{user.points}</div>
                        <div className="text-xs text-slate-500">Beneficios: {user.benefits}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                          {user.status === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(user.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal(user, 'points')}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                            title="Asignar puntos"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal(user, 'level')}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Cambiar nivel"
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <AssignPointsModal
        isOpen={modalState.isOpen && modalState.type === 'points'}
        onClose={closeModal}
        user={modalState.user}
        type="points"
      />
      <ChangeLevelModal
        isOpen={modalState.isOpen && modalState.type === 'level'}
        onClose={closeModal}
        user={modalState.user}
        type="level"
      />
    </div>
  );
} 