import { useState, useEffect } from 'react';
import axios from 'axios';

interface Routine {
  id: number;
  name: string;
  focus: string;
  level: string;
  description: string;
}

interface CreateRoutineForm {
  name: string;
  focus: string;
  level: string;
  description: string;
}

export default function TrainerRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [formData, setFormData] = useState<CreateRoutineForm>({
    name: '',
    focus: '',
    level: '',
    description: ''
  });

  const focusOptions = ['Fuerza', 'Cardio', 'Flexibilidad', 'Equilibrio', 'Resistencia'];
  const levelOptions = ['Principiante', 'Intermedio', 'Avanzado'];

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/trainer/routines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setRoutines(response.data);
    } catch (error) {
      console.error('Error al cargar rutinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:8080/api/trainer/routines', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert('Rutina creada exitosamente');
      setShowCreateForm(false);
      setFormData({ name: '', focus: '', level: '', description: '' });
      fetchRoutines();
    } catch (error) {
      console.error('Error al crear rutina:', error);
      alert('Error al crear rutina');
    }
  };

  const handleUpdateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoutine) return;
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:8080/api/trainer/routines/${editingRoutine.id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert('Rutina actualizada exitosamente');
      setEditingRoutine(null);
      setFormData({ name: '', focus: '', level: '', description: '' });
      fetchRoutines();
    } catch (error) {
      console.error('Error al actualizar rutina:', error);
      alert('Error al actualizar rutina');
    }
  };

  const handleDeleteRoutine = async (routineId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta rutina?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:8080/api/trainer/routines/${routineId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert('Rutina eliminada exitosamente');
      fetchRoutines();
    } catch (error) {
      console.error('Error al eliminar rutina:', error);
      alert('Error al eliminar rutina');
    }
  };

  const startEditing = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormData({
      name: routine.name,
      focus: routine.focus,
      level: routine.level,
      description: routine.description
    });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'principiante': return 'text-green-400';
      case 'intermedio': return 'text-yellow-400';
      case 'avanzado': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus.toLowerCase()) {
      case 'fuerza': return 'text-red-400';
      case 'cardio': return 'text-green-400';
      case 'flexibilidad': return 'text-blue-400';
      case 'equilibrio': return 'text-purple-400';
      case 'resistencia': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-6xl mx-auto mt-10">
        <div className="text-white text-center">Cargando rutinas...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">Gestión de Rutinas</h1>
            <p className="text-white text-lg">Crea y gestiona las rutinas de entrenamiento</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
          >
            ➕ Nueva Rutina
          </button>
        </div>
      </div>

      {/* Formulario de Creación/Edición */}
      {(showCreateForm || editingRoutine) && (
        <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}
          </h2>
          
          <form onSubmit={editingRoutine ? handleUpdateRoutine : handleCreateRoutine} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm mb-2">Nombre de la Rutina</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Ej: Rutina de Fuerza Superior"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white text-sm mb-2">Enfoque</label>
                <select
                  value={formData.focus}
                  onChange={(e) => setFormData({...formData, focus: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                >
                  <option value="">Seleccionar enfoque</option>
                  {focusOptions.map(option => (
                    <option key={option} value={option} className="bg-gray-800">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm mb-2">Nivel</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                >
                  <option value="">Seleccionar nivel</option>
                  {levelOptions.map(option => (
                    <option key={option} value={option} className="bg-gray-800">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                  placeholder="Descripción detallada de la rutina..."
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
              >
                {editingRoutine ? 'Actualizar Rutina' : 'Crear Rutina'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingRoutine(null);
                  setFormData({ name: '', focus: '', level: '', description: '' });
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Rutinas */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Rutinas Disponibles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <div key={routine.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-green-400">{routine.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(routine)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteRoutine(routine.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 text-sm">{routine.description}</p>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm font-semibold ${getFocusColor(routine.focus)}`}>
                  {routine.focus}
                </span>
                <span className={`text-sm font-semibold ${getLevelColor(routine.level)}`}>
                  {routine.level}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {routines.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay rutinas creadas aún</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
            >
              Crear Primera Rutina
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 