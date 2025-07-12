import { useState, useEffect } from 'react';

export interface AuditLog {
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

export interface AuditSummary {
  total_records: number;
  create_count: number;
  update_count: number;
  delete_count: number;
  most_active_user?: string;
  most_modified_table?: string;
  recent_activity: AuditLog[];
}

export interface AuditFilters {
  table_name: string;
  action: string;
  user_id: string;
  start_date: string;
  end_date: string;
  limit: number;
  offset: number;
}

export const useAudit = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AuditFilters>({
    table_name: '',
    action: '',
    user_id: '',
    start_date: '',
    end_date: '',
    limit: 100,
    offset: 0
  });

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (filters.table_name) params.append('table_name', filters.table_name);
      if (filters.action) params.append('action', filters.action);
      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      params.append('limit', filters.limit.toString());
      params.append('offset', filters.offset.toString());

      const response = await fetch(`/api/audit/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener logs de auditoría');
      }

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditSummary = async () => {
    try {
      setError(null);
      
      const response = await fetch('/api/audit/summary', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener resumen de auditoría');
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching audit summary:', err);
    }
  };

  const updateFilters = (newFilters: Partial<AuditFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      table_name: '',
      action: '',
      user_id: '',
      start_date: '',
      end_date: '',
      limit: 100,
      offset: 0
    });
  };

  const refreshData = () => {
    fetchAuditLogs();
    fetchAuditSummary();
  };

  useEffect(() => {
    fetchAuditLogs();
    fetchAuditSummary();
  }, [filters]);

  return {
    logs,
    summary,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshData,
    fetchAuditLogs,
    fetchAuditSummary
  };
}; 