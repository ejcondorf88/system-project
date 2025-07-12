import { useState } from 'react';
import { useTrainer } from '@/hooks/useTrainer';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import type { Routine } from '@/adapters/trainer.adapter';

export default function TrainerRoutines() {
  const { routines, loading, createRoutine, updateRoutine, deleteRoutine } = useTrainer();
  const [showForm, setShowForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    focus: '',
    level: 'beginner',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoutine) {
      await updateRoutine(editingRoutine.id, formData);
      setEditingRoutine(null);
    } else {
      await createRoutine({
        ...formData,
        status: 1
      });
    }
    
    setFormData({ name: '', focus: '', level: 'beginner', description: '' });
    setShowForm(false);
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormData({
      name: routine.name,
      focus: routine.focus,
      level: routine.level,
      description: routine.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      await deleteRoutine(id);
    }
  };

  const filteredRoutines = routines.filter(routine =>
    routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    routine.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    routine.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus.toLowerCase()) {
      case 'fuerza': return 'bg-blue-500/20 text-blue-400';
      case 'cardio': return 'bg-red-500/20 text-red-400';
      case 'flexibilidad': return 'bg-purple-500/20 text-purple-400';
      case 'resistencia': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <div className="bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-orange-400 mb-2">Gestión de Rutinas</h1>
            <p className="text-white text-lg">Crea y gestiona rutinas de entrenamiento personalizadas</p>
          </div>
          <button
            onClick={() => {
              setEditingRoutine(null);
              setFormData({ name: '', focus: '', level: 'beginner', description: '' });
              setShowForm(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Nueva Rutina
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar rutinas por nombre, enfoque o nivel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-white/20">
            <h2 className="text-2xl font-bold text-orange-400 mb-6">
              {editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Nombre de la Rutina</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Enfoque</label>
                <select
                  value={formData.focus}
                  onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Seleccionar enfoque</option>
                  <option value="Fuerza">Fuerza</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibilidad">Flexibilidad</option>
                  <option value="Resistencia">Resistencia</option>
                  <option value="Pérdida de peso">Pérdida de peso</option>
                  <option value="Ganancia muscular">Ganancia muscular</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Nivel</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Describe los ejercicios, series, repeticiones y descansos..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {editingRoutine ? 'Actualizar' : 'Crear'} Rutina
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingRoutine(null);
                    setFormData({ name: '', focus: '', level: 'beginner', description: '' });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map((routine) => (
          <div key={routine.id} className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-orange-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{routine.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(routine)}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(routine.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFocusColor(routine.focus)}`}>
                  {routine.focus}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(routine.level)}`}>
                  {routine.level === 'beginner' ? 'Principiante' : 
                   routine.level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                </span>
              </div>

              <p className="text-gray-300 text-sm line-clamp-3">
                {routine.description}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-gray-400 text-xs">
                  Creada: {new Date(routine.created_at).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  routine.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {routine.status === 1 ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoutines.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-400 text-3xl">🏋️</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {searchTerm ? 'No se encontraron rutinas' : 'No hay rutinas creadas'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera rutina para comenzar'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => {
                setEditingRoutine(null);
                setFormData({ name: '', focus: '', level: 'beginner', description: '' });
                setShowForm(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Crear Primera Rutina
            </button>
          )}
        </div>
      )}
    </div>
  );
} 