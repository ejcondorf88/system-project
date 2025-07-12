import { useState } from 'react';
import { CreditCard, Users, Calendar, DollarSign, Clock, Plus, RefreshCw, Filter, Search } from 'lucide-react';
import { useMemberships, type Membership, type UserMembership } from '../../hooks/useMemberships';

export default function Memberships() {
  const {
    memberships,
    userMemberships,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    fetchMemberships,
    fetchUserMemberships
  } = useMemberships();

  const [activeTab, setActiveTab] = useState<'memberships' | 'user-memberships'>('memberships');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
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
              onClick={() => { fetchMemberships(); fetchUserMemberships(); }}
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
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestión de Membresías</h1>
              <p className="text-slate-600">Administra planes y suscripciones de usuarios</p>
            </div>
          </div>
          <button
            onClick={() => { fetchMemberships(); fetchUserMemberships(); }}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 font-medium">Actualizar</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('memberships')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'memberships' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Membresías Disponibles</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('user-memberships')}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'user-memberships' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Membresías de Usuarios</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'memberships' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Membresías Disponibles ({memberships.length})</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Cargando membresías...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memberships.map((membership) => (
                    <div key={membership.id} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-slate-900">{membership.name}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(membership.status)}`}>
                          {membership.status === 1 ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-4">{membership.description || 'Sin descripción'}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm text-slate-600">Precio:</span>
                          </div>
                          <span className="text-lg font-bold text-emerald-600">${membership.price || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-slate-600">Duración:</span>
                          </div>
                          <span className="text-sm font-medium text-blue-600">{membership.duration_days || 0} días</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {memberships.length === 0 && !loading && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No se encontraron membresías</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'user-memberships' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Membresías de Usuarios ({userMemberships.length})</h3>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Cargando membresías de usuarios...</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Membresía</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Inicio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {userMemberships.map((userMembership) => {
                      const endDate = userMembership.end_date ? new Date(userMembership.end_date) : null;
                      const isActive = endDate ? endDate > new Date() : false;
                      
                      return (
                        <tr key={userMembership.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">
                              {userMembership.user?.username || 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500">
                              {userMembership.user?.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-900">
                              {userMembership.membership?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500">
                              ${userMembership.membership?.price || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(userMembership.start_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(userMembership.end_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                              isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                              {isActive ? 'Activa' : 'Expirada'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {userMemberships.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No se encontraron membresías de usuarios</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 