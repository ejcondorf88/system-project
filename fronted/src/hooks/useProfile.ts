import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userAdapter, { type UserData, type UserUpdateData } from '@/adapters/user.adapter';

interface UseProfileReturn {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (userData: UserUpdateData) => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const userData = await userAdapter.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error al cargar los datos del usuario');
      if (error instanceof Error && error.message === 'No token found') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    setLoading(true);
    await fetchUserData();
  };

  const updateProfile = async (userData: UserUpdateData) => {
    try {
      const updatedUser = await userAdapter.updateUser(userData);
      setUser(updatedUser);
      setError(null);
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Error al actualizar los datos del usuario');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  return {
    user,
    loading,
    error,
    refreshProfile,
    updateProfile
  };
}; 