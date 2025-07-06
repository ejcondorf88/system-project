import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAdapter from '@/adapters/auth.adapter';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (credentials: { username: string; email: string; phone?: string; password: string; confirmPassword: string }) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token) {
        // Primero establecer el usuario desde localStorage para evitar null temporal
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error al parsear datos del usuario:', error);
          }
        }
        
        try {
          // Intentar obtener datos actualizados del usuario
          const currentUser = await authAdapter.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          console.error('Error al obtener usuario actual:', error);
          // Si hay error, limpiar datos y redirigir al login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      setLoading(true);
      const response = await authAdapter.login(credentials);
      
      if (response.access_token || response.token) {
        const token = response.access_token || response.token || '';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsAuthenticated(true);
        setUser(response.user);
        navigate('/chat');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: { username: string; email: string; phone?: string; password: string; confirmPassword: string }) => {
    try {
      setLoading(true);
      const response = await authAdapter.register(credentials);
      
      if (response.access_token || response.token) {
        const token = response.access_token || response.token || '';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsAuthenticated(true);
        setUser(response.user);
        navigate('/chat');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpiar token y datos del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token'); // Por si acaso
    setIsAuthenticated(false);
    setUser(null);
    
    // Redirigir al login
    navigate('/login');
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register
  };
}; 