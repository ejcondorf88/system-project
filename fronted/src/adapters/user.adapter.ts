import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface UserData {
  id: number;
  username: string;
  email: string;
  phone?: string;
  level: string;
  points: number;
  benefits: number;
  achievements: string[];
  creacion: string;
  estado: boolean;
  is_superuser: boolean;
}

export interface UserUpdateData {
  phone?: string;
  level?: string;
  points?: number;
  benefits?: number;
  achievements?: string;
}

export interface UserResponse {
  user: UserData;
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
  routine: {
    id: number;
    name: string;
    focus: string;
    level: string;
    description: string;
    status: number;
    created_at: string;
    updated_at: string;
  };
}

const userAdapter = {
  async getCurrentUser(): Promise<UserData> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener datos del usuario');
      }
      throw error;
    }
  },

  async updateUser(userData: UserUpdateData): Promise<UserData> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(`${API_URL}/users/me`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al actualizar datos del usuario');
      }
      throw error;
    }
  },

  async getUserPoints(): Promise<number> {
    try {
      const userData = await this.getCurrentUser();
      return userData.points;
    } catch (error) {
      console.error('Error getting user points:', error);
      return 0;
    }
  },

  async getMyRoutines(): Promise<UserRoutine[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/users/my-routines`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener rutinas asignadas');
      }
      throw error;
    }
  },

  async completeUserRoutine(userRoutineId: number): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.put(`http://localhost:8080/api/trainer/user-routines/${userRoutineId}/complete`, null, {
        headers: {
          Authorization: `Bearer ${token}`
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

  async generateRoutineWithAI({ name, level, focus, tipo = 'full body' }: { name: string; level: string; focus: string; tipo?: string }): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(
        `${API_URL}/trainer/routines/generate`,
        { name, level, focus, tipo },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al generar rutina con IA');
      }
      throw error;
    }
  }
};

export default userAdapter; 