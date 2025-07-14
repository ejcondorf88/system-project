import axios from 'axios';

export interface Exercise {
  name: string;
  series: number;
  reps: string;
  rir: string;
  tempo: string;
  rest: string;
}

export interface Routine {
  id: number;
  name: string;
  level: string;
  duration: string;
  focus: string;
  exercises?: Exercise[];
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

      // Obtener rutinas del backend
      const response = await axios.get('http://localhost:8080/api/dashboard/routines/available', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transformar los datos del backend al formato esperado
      const backendRoutines = response.data;
      return backendRoutines.map((routine: any) => ({
        id: routine.id,
        name: routine.name,
        level: routine.level || 'Gratis',
        duration: '45 min', // Valor por defecto
        focus: routine.focus || 'Cuerpo completo',
        exercises: [] // Por ahora vacío, se puede expandir después
      }));
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