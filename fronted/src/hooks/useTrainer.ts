import { useState, useEffect } from 'react';
import trainerAdapter from '@/adapters/trainer.adapter';
import type { Routine, UserRoutine, User, ChatMessage } from '@/adapters/trainer.adapter';
import { toast } from 'sonner';

interface UseTrainerReturn {
  routines: Routine[];
  userRoutines: UserRoutine[];
  users: User[];
  chatHistory: ChatMessage[];
  stats: any;
  loading: boolean;
  error: string | null;
  getRoutines: () => Promise<void>;
  createRoutine: (routineData: Omit<Routine, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRoutine: (id: number, routineData: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: number) => Promise<void>;
  getUsers: () => Promise<void>;
  getUserChatHistory: (userId: number) => Promise<ChatMessage[]>;
  assignRoutineToUser: (userId: number, routineId: number) => Promise<void>;
  getUserRoutines: () => Promise<void>;
  completeUserRoutine: (userRoutineId: number) => Promise<void>;
  getStats: () => Promise<void>;
}

export const useTrainer = (): UseTrainerReturn => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [userRoutines, setUserRoutines] = useState<UserRoutine[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerAdapter.getRoutines();
      setRoutines(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener rutinas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createRoutine = async (routineData: Omit<Routine, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      await trainerAdapter.createRoutine(routineData);
      toast.success('Rutina creada exitosamente');
      await getRoutines(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear rutina';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateRoutine = async (id: number, routineData: Partial<Routine>) => {
    try {
      setLoading(true);
      setError(null);
      await trainerAdapter.updateRoutine(id, routineData);
      toast.success('Rutina actualizada exitosamente');
      await getRoutines(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar rutina';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoutine = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await trainerAdapter.deleteRoutine(id);
      toast.success('Rutina eliminada exitosamente');
      await getRoutines(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar rutina';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerAdapter.getAssignedUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener usuarios';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserChatHistory = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerAdapter.getUserChatHistory(userId);
      setChatHistory(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener historial de chat';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const assignRoutineToUser = async (userId: number, routineId: number) => {
    try {
      setLoading(true);
      setError(null);
      await trainerAdapter.assignRoutineToUser(userId, routineId);
      toast.success('Rutina asignada exitosamente');
      await getUserRoutines(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar rutina';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerAdapter.getUserRoutines();
      setUserRoutines(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener rutinas de usuarios';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const completeUserRoutine = async (userRoutineId: number) => {
    try {
      setLoading(true);
      setError(null);
      await trainerAdapter.completeUserRoutine(userRoutineId);
      toast.success('Rutina marcada como completada');
      await getUserRoutines(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar rutina como completada';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await trainerAdapter.getTrainerStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener estadísticas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    getRoutines();
    getUsers();
    getUserRoutines();
    getStats();
  }, []);

  return {
    routines,
    userRoutines,
    users,
    chatHistory,
    stats,
    loading,
    error,
    getRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    getUsers,
    getUserChatHistory,
    assignRoutineToUser,
    getUserRoutines,
    completeUserRoutine,
    getStats
  };
}; 