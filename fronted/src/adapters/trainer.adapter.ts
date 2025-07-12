import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Routine {
  id: number;
  name: string;
  focus: string;
  level: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface UserRoutine {
  id: number;
  user_id: number;
  routine_id: number;
  assigned_at: string;
  completed_at?: string;
  status: number;
  created_at: string;
  updated_at: string;
  routine: Routine;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface ChatMessage {
  id: number;
  user_id: number;
  message_type: string;
  content: string;
  session_id?: string;
  timestamp: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  level: string;
  points: number;
  is_trainer: boolean;
  is_superuser: boolean;
}

const trainerAdapter = {
  // Obtener todas las rutinas
  async getRoutines(): Promise<Routine[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(`${API_URL}/trainer/routines`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener rutinas');
      }
      throw error;
    }
  },

  // Crear nueva rutina
  async createRoutine(routineData: Omit<Routine, 'id' | 'created_at' | 'updated_at'>): Promise<Routine> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.post(`${API_URL}/trainer/routines`, routineData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al crear rutina');
      }
      throw error;
    }
  },

  // Actualizar rutina
  async updateRoutine(id: number, routineData: Partial<Routine>): Promise<Routine> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.put(`${API_URL}/trainer/routines/${id}`, routineData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al actualizar rutina');
      }
      throw error;
    }
  },

  // Eliminar rutina (cambiar status a 0)
  async deleteRoutine(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      await axios.delete(`${API_URL}/trainer/routines/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al eliminar rutina');
      }
      throw error;
    }
  },

  // Obtener usuarios asignados
  async getAssignedUsers(): Promise<User[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(`${API_URL}/trainer/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener usuarios');
      }
      throw error;
    }
  },

  // Obtener historial de chat de un usuario
  async getUserChatHistory(userId: number): Promise<ChatMessage[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(`${API_URL}/trainer/users/${userId}/chat-history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener historial de chat');
      }
      throw error;
    }
  },

  // Asignar rutina a usuario
  async assignRoutineToUser(userId: number, routineId: number): Promise<UserRoutine> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.post(`${API_URL}/trainer/assign-routine`, {
        user_id: userId,
        routine_id: routineId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al asignar rutina');
      }
      throw error;
    }
  },

  // Obtener rutinas asignadas a usuarios
  async getUserRoutines(): Promise<UserRoutine[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(`${API_URL}/trainer/user-routines`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener rutinas de usuarios');
      }
      throw error;
    }
  },

  // Marcar rutina como completada
  async completeUserRoutine(userRoutineId: number): Promise<UserRoutine> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.put(`${API_URL}/trainer/user-routines/${userRoutineId}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al marcar rutina como completada');
      }
      throw error;
    }
  },

  // Obtener estadísticas del trainer
  async getTrainerStats(): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(`${API_URL}/trainer/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener estadísticas');
      }
      throw error;
    }
  }
};

export default trainerAdapter; 