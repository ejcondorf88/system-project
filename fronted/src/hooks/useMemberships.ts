import { useState, useEffect } from 'react';

export interface Membership {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration_days?: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface UserMembership {
  id: number;
  user_id: number;
  membership_id: number;
  start_date?: string;
  end_date?: string;
  status: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    email: string;
  };
  membership?: {
    name: string;
    price?: number;
  };
}

export interface MembershipFilters {
  search: string;
  status: string;
  limit: number;
  offset: number;
}

export const useMemberships = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [userMemberships, setUserMemberships] = useState<UserMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MembershipFilters>({
    search: '',
    status: '',
    limit: 50,
    offset: 0
  });

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      params.append('limit', filters.limit.toString());
      params.append('offset', filters.offset.toString());

      const response = await fetch(`http://localhost:8080/api/dashboard/memberships?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener membresías');
      }

      const data = await response.json();
      setMemberships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching memberships:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMemberships = async () => {
    try {
      setError(null);
      
      const response = await fetch('http://localhost:8080/api/dashboard/user-memberships', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener membresías de usuarios');
      }

      const data = await response.json();
      setUserMemberships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching user memberships:', err);
    }
  };

  const createMembership = async (membershipData: any) => {
    try {
      setError(null);
      
      const response = await fetch('http://localhost:8080/api/users/memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(membershipData)
      });

      if (!response.ok) {
        throw new Error('Error al crear membresía');
      }

      await fetchMemberships();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateMembership = async (membershipId: number, membershipData: any) => {
    try {
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/dashboard/memberships/${membershipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(membershipData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar membresía');
      }

      await fetchMemberships();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const deleteMembership = async (membershipId: number) => {
    try {
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/dashboard/memberships/${membershipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar membresía');
      }

      await fetchMemberships();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const assignMembershipToUser = async (userId: number, membershipId: number, startDate?: string, endDate?: string) => {
    try {
      setError(null);
      
      const response = await fetch('http://localhost:8080/api/dashboard/user-memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          user_id: userId,
          membership_id: membershipId,
          start_date: startDate,
          end_date: endDate
        })
      });

      if (!response.ok) {
        throw new Error('Error al asignar membresía');
      }

      await fetchUserMemberships();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const updateFilters = (newFilters: Partial<MembershipFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      limit: 50,
      offset: 0
    });
  };

  useEffect(() => {
    fetchMemberships();
    fetchUserMemberships();
  }, [filters]);

  return {
    memberships,
    userMemberships,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    createMembership,
    updateMembership,
    deleteMembership,
    assignMembershipToUser,
    fetchMemberships,
    fetchUserMemberships
  };
}; 