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

      // Por ahora retornamos rutinas estáticas
      // En el futuro esto se conectaría con el backend
      const routines: Routine[] = [
        {
          id: 1,
          name: 'Full Body Principiantes',
          level: 'Gratis',
          duration: '45 min',
          focus: 'Cuerpo completo',
          exercises: [
            { name: 'Press pecho máquina', series: 3, reps: '12/15', rir: '2 - 3', tempo: '3 - 1', rest: '1\' - 1\'30"' },
            { name: 'Jalón en máquina', series: 3, reps: '12/15', rir: '2 - 3', tempo: '1 - 3', rest: '1\' - 1\'30"' },
            { name: 'Remo máquina', series: 3, reps: '12/15', rir: '2 - 3', tempo: '1 - 3', rest: '1\' - 1\'30"' },
            { name: 'Sentadilla (Goblet squat)', series: 3, reps: '12/15', rir: '2 - 3', tempo: '3 - 1', rest: '1\' - 1\'30"' },
            { name: 'Press hombro máquina', series: 3, reps: '12/15', rir: '2 - 3', tempo: '1 - 3', rest: '1\' - 1\'30"' },
            { name: 'Curl bíceps mancuerna', series: 3, reps: '12/15', rir: '2 - 3', tempo: '1 - 3', rest: '1\' - 1\'30"' },
            { name: 'Extensión tríceps polea', series: 3, reps: '12/15', rir: '2 - 3', tempo: '1 - 3', rest: '1\' - 1\'30"' },
          ]
        },
        {
          id: 2,
          name: 'Piernas y Glúteos',
          level: 'Gratis',
          duration: '60 min',
          focus: 'Piernas y glúteos',
          exercises: [
            { name: 'Sentadilla libre', series: 4, reps: '10/12', rir: '2 - 3', tempo: '3 - 1', rest: '1\' - 1\'30"' },
            { name: 'Prensa de piernas', series: 4, reps: '12/15', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Peso muerto rumano', series: 3, reps: '10/12', rir: '2 - 3', tempo: '3 - 1', rest: '1\' - 1\'30"' },
            { name: 'Hip thrust', series: 3, reps: '12/15', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Curl femoral máquina', series: 3, reps: '12/15', rir: '2 - 3', tempo: '1 - 3', rest: '1\' - 1\'30"' },
            { name: 'Extensión de cuádriceps', series: 3, reps: '12/15', rir: '2 - 3', tempo: '1 - 3', rest: '1\' - 1\'30"' },
            { name: 'Elevación de talones', series: 3, reps: '15/20', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
          ]
        },
        {
          id: 3,
          name: 'Cardio Intensivo HIIT',
          level: 'Gratis',
          duration: '30 min',
          focus: 'Quema de grasa',
          exercises: [
            { name: 'Jumping Jacks', series: 4, reps: '30 seg', rir: '-', tempo: '-', rest: '30 seg' },
            { name: 'Burpees', series: 4, reps: '12/15', rir: '-', tempo: '-', rest: '30 seg' },
            { name: 'Mountain Climbers', series: 4, reps: '30 seg', rir: '-', tempo: '-', rest: '30 seg' },
            { name: 'Sprint en sitio', series: 4, reps: '30 seg', rir: '-', tempo: '-', rest: '30 seg' },
            { name: 'Sentadillas rápidas', series: 4, reps: '15/20', rir: '-', tempo: '-', rest: '30 seg' },
            { name: 'Plancha', series: 4, reps: '30 seg', rir: '-', tempo: '-', rest: '30 seg' },
            { name: 'Descanso largo', series: 1, reps: '2 min', rir: '-', tempo: '-', rest: '-' },
          ]
        },
        {
          id: 4,
          name: 'Full Body - Resistencia',
          level: 'Plata',
          duration: '75 min',
          focus: 'Todo el cuerpo',
          exercises: [
            { name: 'Remo con barra', series: 4, reps: '10/12', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Press banca', series: 4, reps: '10/12', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Dominadas asistidas', series: 3, reps: '8/10', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Zancadas', series: 3, reps: '12/15', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Fondos en paralelas', series: 3, reps: '8/10', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Plancha abdominal', series: 3, reps: '45 seg', rir: '-', tempo: '-', rest: '1\'' },
            { name: 'Curl bíceps barra', series: 3, reps: '12/15', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
          ]
        },
        {
          id: 5,
          name: 'Yoga y Flexibilidad',
          level: 'Plata',
          duration: '45 min',
          focus: 'Recuperación, Flexibilidad',
          exercises: [
            { name: 'Saludos al sol', series: 3, reps: '8/10', rir: '-', tempo: '-', rest: '1\'' },
            { name: 'Perro boca abajo', series: 3, reps: '30 seg', rir: '-', tempo: '-', rest: '1\'' },
            { name: 'Guerrero I', series: 3, reps: '30 seg', rir: '-', tempo: '-', rest: '1\'' },
            { name: 'Postura del niño', series: 3, reps: '30 seg', rir: '-', tempo: '-', rest: '1\'' },
            { name: 'Torsión espinal', series: 3, reps: '30 seg', rir: '-', tempo: '-', rest: '1\'' },
            { name: 'Estiramiento de cuádriceps', series: 3, reps: '30 seg', rir: '-', tempo: '-', rest: '1\'' },
            { name: 'Respiración consciente', series: 3, reps: '1 min', rir: '-', tempo: '-', rest: '1\'' },
          ]
        },
        {
          id: 6,
          name: 'Entrenamiento Olímpico Avanzado',
          level: 'Oro',
          duration: '90 min',
          focus: 'Potencia, Técnica',
          exercises: [
            { name: 'Arranque', series: 5, reps: '3/5', rir: '2 - 3', tempo: '2 - 2', rest: '2\'' },
            { name: 'Envión', series: 5, reps: '3/5', rir: '2 - 3', tempo: '2 - 2', rest: '2\'' },
            { name: 'Sentadilla frontal', series: 4, reps: '6/8', rir: '2 - 3', tempo: '3 - 1', rest: '2\'' },
            { name: 'Peso muerto', series: 4, reps: '6/8', rir: '2 - 3', tempo: '3 - 1', rest: '2\'' },
            { name: 'Press militar', series: 4, reps: '8/10', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Remo con barra', series: 4, reps: '8/10', rir: '2 - 3', tempo: '2 - 2', rest: '1\' - 1\'30"' },
            { name: 'Abdominales', series: 4, reps: '15/20', rir: '-', tempo: '-', rest: '1\'' },
          ]
        },
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