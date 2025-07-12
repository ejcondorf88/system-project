import React, { useState, useEffect } from 'react';
import { Activity, Database, Filter, RefreshCw, Eye, Shield, Calendar, Search } from 'lucide-react';

interface AuditLog {
  id: number;
  table_name: string;
  record_id: number;
  action: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  user_id?: number;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface AuditSummary {
  total_records: number;
  create_count: number;
  update_count: number;
  delete_count: number;
  most_active_user?: string;
  most_modified_table?: string;
  recent_activity: AuditLog[];
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    table_name: '',
    action: '',
    user_id: '',
    limit: 100,
    offset: 0
  });

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditSummary();
  }, [filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.table_name) params.append('table_name', filters.table_name);
      if (filters.action) params.append('action', filters.action);
      if (filters.user_id) params.append('user_id', filters.user_id);
      params.append('limit', filters.limit.toString());
      params.append('offset', filters.offset.toString());

      const response = await fetch(`/api/audit/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditSummary = async () => {
    try {
      const response = await fetch('/api/audit/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Error fetching audit summary:', error);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      table_name: '',
      action: '',
      user_id: '',
      limit: 100,
      offset: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Logs de Auditoría</h1>
              <p className="text-slate-600">Monitoreo completo de actividades del sistema</p>
            </div>
          </div>
          <button
            onClick={() => { fetchAuditLogs(); fetchAuditSummary(); }}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 font-medium">Actualizar</span>
          </button>
        </div>

        {/* Resumen */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Registros</p>
                  <p className="text-3xl font-bold text-slate-900">{summary.total_records}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Database className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Creaciones</p>
                  <p className="text-3xl font-bold text-emerald-600">{summary.create_count}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Actualizaciones</p>
                  <p className="text-3xl font-bold text-blue-600">{summary.update_count}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Eliminaciones</p>
                  <p className="text-3xl font-bold text-red-600">{summary.delete_count}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tabla</label>
              <input
                type="text"
                placeholder="Nombre de la tabla"
                value={filters.table_name}
                onChange={(e) => handleFilterChange('table_name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Acción</label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="CREATE">Crear</option>
                <option value="UPDATE">Actualizar</option>
                <option value="DELETE">Eliminar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Usuario ID</label>
              <input
                type="text"
                placeholder="ID del usuario"
                value={filters.user_id}
                onChange={(e) => handleFilterChange('user_id', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

        {/* Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Registros de Auditoría</h3>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Cargando logs...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="font-medium text-slate-900">{log.table_name}</span>
                        <span className="text-slate-500 text-sm">ID: {log.record_id}</span>
                      </div>
                      <span className="text-sm text-slate-500">
                        {formatDate(log.created_at)}
                      </span>
                    </div>

                    {log.field_name && (
                      <div className="text-sm text-slate-700 mb-2">
                        <span className="font-medium">Campo:</span> {log.field_name}
                      </div>
                    )}

                    {log.old_value && log.new_value && (
                      <div className="text-sm space-y-1 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-red-600">Anterior:</span>
                          <span className="text-slate-600">{truncateText(log.old_value)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-emerald-600">Nuevo:</span>
                          <span className="text-slate-600">{truncateText(log.new_value)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-4">
                        {log.user_id && (
                          <span>Usuario: {log.user_id}</span>
                        )}
                        {log.ip_address && (
                          <span>IP: {log.ip_address}</span>
                        )}
                      </div>
                      {log.user_agent && (
                        <span className="max-w-xs truncate" title={log.user_agent}>
                          {truncateText(log.user_agent, 30)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No se encontraron registros de auditoría</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs; 