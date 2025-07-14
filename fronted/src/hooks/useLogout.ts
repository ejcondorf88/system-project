import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Llamar al endpoint de logout del backend
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post(
            process.env.NODE_ENV === 'production'
              ? 'https://tu-backend-app.onrender.com/api/auth/logout'
              : 'http://localhost:8080/api/auth/logout',
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } catch (err) {
          // Si falla, igual seguimos con el logout local
          console.warn('Error al llamar al logout backend:', err);
        }
      }
      // Borrar todos los datos de autenticación del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('access_token'); // Por si acaso
      // Limpiar cualquier otro dato relacionado con la sesión
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('access_token');
      sessionStorage.clear();
      // Intentar borrar cookies de token si existieran (para SSR o cookies httpOnly)
      document.cookie = 'access_token=; Max-Age=0; path=/;';
      document.cookie = 'refreshToken=; Max-Age=0; path=/;';
      // Mostrar mensaje de éxito
      toast.success('Sesión cerrada exitosamente');
      // Redirigir al login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error durante el logout:', error);
      toast.error('Error al cerrar sesión');
      // Aún así, intentar redirigir al login
      navigate('/login', { replace: true });
    }
  };

  return { logout };
}; 