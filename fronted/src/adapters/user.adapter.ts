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
  }
};

export default userAdapter; 