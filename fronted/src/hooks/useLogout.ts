import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    try {
      // Borrar todos los datos de autenticación del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Limpiar cualquier otro dato relacionado con la sesión
      sessionStorage.clear();
      
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