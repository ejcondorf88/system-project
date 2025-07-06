import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // URL actualizada del backend

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  email: string;
  phone?: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

const authAdapter = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Crear FormData para enviar los datos en el formato que espera OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      const response = await axios.post(`${API_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Error al iniciar sesión';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log(`Los datos que se van a enviar al backendo son ${credentials}`)
      const response = await axios.post(`${API_URL}/auth/register`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al registrar usuario');
      }
      throw error;
    }
  }
};

export default authAdapter; 