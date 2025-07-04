import { useState, useEffect } from 'react';
import { apiAdapter } from '../adapters/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    console.log('useAuth: ejecutando checkAuth');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('checkAuth: token en localStorage:', token);
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const user = await apiAdapter.getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      console.log('checkAuth: usuario cargado', user);
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Error al verificar la autenticación',
      });
      localStorage.removeItem('token');
      console.log('checkAuth: error, token eliminado');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await apiAdapter.login({ username, password });
      localStorage.setItem('token', response.token);
      await checkAuth();
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al iniciar sesión',
      }));
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await apiAdapter.register({ username, email, password });
      localStorage.setItem('token', response.token);
      await checkAuth();
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al registrar usuario',
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
}; 