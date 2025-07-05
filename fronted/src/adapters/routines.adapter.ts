import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Routine {
  id: number;
  name: string;
  level: string;
  duration: string;
  focus: string;
}

export interface RoutineResponse {
  routines: Routine[];
}

const routinesAdapter = {
  async getRoutines(): Promise<Routine[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Por ahora retornamos rutinas estáticas
      // En el futuro esto se conectaría con el backend
      const routines: Routine[] = [
        { id: 1, name: 'Tren Superior - Fuerza', level: 'Gratis', duration: '45 min', focus: 'Pecho, Espalda, Hombros' },
        { id: 2, name: 'Piernas y Glúteos', level: 'Gratis', duration: '60 min', focus: 'Cuádriceps, Isquiotibiales, Glúteos' },
        { id: 3, name: 'Cardio Intensivo HIIT', level: 'Gratis', duration: '30 min', focus: 'Quema de grasa' },
        { id: 4, name: 'Full Body - Resistencia', level: 'Plata', duration: '75 min', focus: 'Todo el cuerpo' },
        { id: 5, name: 'Yoga y Flexibilidad', level: 'Plata', duration: '45 min', focus: 'Recuperación, Flexibilidad' },
        { id: 6, name: 'Entrenamiento Olímpico Avanzado', level: 'Oro', duration: '90 min', focus: 'Potencia, Técnica' },
      ];

      return routines;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al obtener las rutinas');
      }
      throw error;
    }
  },

  async startRoutine(routineId: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Aquí se implementaría la lógica para iniciar una rutina
      // Por ahora solo logueamos
      console.log(`Iniciando rutina ${routineId}`);
      
      // En el futuro esto haría una llamada al backend
      // const response = await axios.post(`${API_URL}/routines/${routineId}/start`, {}, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al iniciar la rutina');
      }
      throw error;
    }
  }
};

export default routinesAdapter; 