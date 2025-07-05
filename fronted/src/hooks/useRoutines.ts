import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routinesAdapter, { type Routine } from '@/adapters/routines.adapter';

interface UseRoutinesReturn {
  routines: Routine[];
  loading: boolean;
  error: string | null;
  startRoutine: (routineId: number) => Promise<void>;
  refreshRoutines: () => Promise<void>;
}

export const useRoutines = (): UseRoutinesReturn => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const startRoutine = async (routineId: number) => {
    try {
      await routinesAdapter.startRoutine(routineId);
      // Por ahora navegamos al chat después de iniciar la rutina
      navigate('/chat');
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
    refreshRoutines
  };
}; 