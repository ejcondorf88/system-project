import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-backend-app.onrender.com/api'  // URL de producción en Render
  : 'http://localhost:8080/api'; // URL de desarrollo local

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiAdapter = {
  // Métodos para autenticación
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Métodos para usuarios
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Métodos para chat
  sendChatMessage: async (messageData: { message: string; user_id: number; timestamp: string }) => {
    console.log('=== apiAdapter.sendChatMessage ===');
    console.log('messageData:', messageData);
    console.log('URL:', `${API_URL}/chat/send`);
    
    try {
      const response = await api.post('/chat/send', messageData);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en sendChatMessage:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
      }
      throw error;
    }
  },

  // Métodos para historial de chat
  get: async (endpoint: string) => {
    const response = await api.get(endpoint);
    return response.data;
  },

  delete: async (endpoint: string) => {
    const response = await api.delete(endpoint);
    return response.data;
  },
};

export default apiAdapter; 