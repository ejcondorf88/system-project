import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // URL actualizada del backend con prefijo /api

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
};

export default apiAdapter; 