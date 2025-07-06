import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routinesAdapter, { type Routine } from '@/adapters/routines.adapter';
import userAdapter from '@/adapters/user.adapter';

interface UseRoutinesReturn {
  routines: Routine[];
  loading: boolean;
  error: string | null;
  startRoutine: (routineId: number) => Promise<void>;
  refreshRoutines: () => Promise<void>;
  canAccessRoutine: (routineLevel: string) => boolean;
}

export const useRoutines = (): UseRoutinesReturn => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<string>('Bronce');
  const navigate = useNavigate();

  // Obtener el nivel del usuario
  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const userData = await userAdapter.getCurrentUser();
        setUserLevel(userData.level);
      } catch (error) {
        console.error('Error fetching user level:', error);
      }
    };
    fetchUserLevel();
  }, []);

  const canAccessRoutine = (routineLevel: string): boolean => {
    const levelHierarchy = {
      'Gratis': 0,
      'Bronce': 1,
      'Plata': 2,
      'Oro': 3
    };
    
    const userLevelValue = levelHierarchy[userLevel as keyof typeof levelHierarchy] || 0;
    const routineLevelValue = levelHierarchy[routineLevel as keyof typeof levelHierarchy] || 0;
    
    return userLevelValue >= routineLevelValue;
  };

  const startRoutine = async (routineId: number) => {
    try {
      const routine = routines.find(r => r.id === routineId);
      if (!routine) {
        setError('Rutina no encontrada');
        return;
      }

      // Verificar acceso según el nivel
      if (!canAccessRoutine(routine.level)) {
        setError(`Necesitas nivel ${routine.level} o superior para acceder a esta rutina`);
        return;
      }

      await routinesAdapter.startRoutine(routineId);
      
      // Navegar al chat con información de la rutina
      navigate('/chat', { 
        state: { 
          selectedRoutine: routine,
          routineStarted: true 
        } 
      });
    } catch (error) {
      console.error('Error starting routine:', error);
      setError('Error al iniciar la rutina');
    }
  };

  const refreshRoutines = async () => {
    setLoading(true);
    try {
      const routinesData = await routinesAdapter.getRoutines();
      setRoutines(routinesData);
      setError(null);
    } catch (error) {
      console.error('Error refreshing routines:', error);
      setError('Error al cargar las rutinas');
      if (error instanceof Error && error.message === 'No token found') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRoutines();
  }, [navigate]);

  return {
    routines,
    loading,
    error,
    startRoutine,
    refreshRoutines,
    canAccessRoutine
  };
}; 