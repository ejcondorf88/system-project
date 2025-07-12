import { useState, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  level: string;
  points: number;
  benefits: number;
  achievements: string;
  creacion: string;
  estado: boolean;
  is_superuser: boolean;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  search: string;
  level: string;
  status: string;
  limit: number;
  offset: number;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    level: '',
    status: '',
    limit: 50,
    offset: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.level) params.append('level', filters.level);
      if (filters.status) params.append('status', filters.status);
      params.append('limit', filters.limit.toString());
      params.append('offset', filters.offset.toString());

      const response = await fetch(`/api/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    try {
      setError(null);
      
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Error al crear usuario');
      }

      await fetchUsers(); // Recargar lista
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateUser = async (userId: number, userData: any) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      await fetchUsers(); // Recargar lista
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      await fetchUsers(); // Recargar lista
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const assignPoints = async (userId: number, amount: number, reason: string) => {
    try {
      setError(null);
      
      const response = await fetch('/api/users/assign-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ user_id: userId, amount, reason })
      });

      if (!response.ok) {
        throw new Error('Error al asignar puntos');
      }

      await fetchUsers(); // Recargar lista
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const changeUserLevel = async (userId: number, level: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/users/${userId}/level`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ level })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar nivel');
      }

      await fetchUsers(); // Recargar lista
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      level: '',
      status: '',
      limit: 50,
      offset: 0
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return {
    users,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    createUser,
    updateUser,
    deleteUser,
    assignPoints,
    changeUserLevel,
    fetchUsers
  };
}; 