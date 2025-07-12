import React, { useState } from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PrizeFormData {
  name: string;
  description: string;
  image_url: string;
  points_cost: number;
  stock: number;
  category: string;
  status: number;
}

const initialFormData: PrizeFormData = {
  name: '',
  description: '',
  image_url: '',
  points_cost: 0,
  stock: 0,
  category: '',
  status: 1
};

const categories = [
  'ropa',
  'equipamiento',
  'suplementos',
  'accesorios',
  'tecnología',
  'otros'
];

export function Prizes() {
  const { prizes, loading, createPrize, updatePrize, deletePrize } = useMarketplace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<any>(null);
  const [formData, setFormData] = useState<PrizeFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.points_cost <= 0) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      if (editingPrize) {
        await updatePrize(editingPrize.id, formData);
        toast.success('Premio actualizado exitosamente');
      } else {
        await createPrize(formData);
        toast.success('Premio creado exitosamente');
      }
      
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (prize: any) => {
    setEditingPrize(prize);
    setFormData({
      name: prize.name,
      description: prize.description || '',
      image_url: prize.image_url || '',
      points_cost: prize.points_cost,
      stock: prize.stock,
      category: prize.category || '',
      status: prize.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este premio?')) {
      try {
        await deletePrize(id);
        toast.success('Premio eliminado exitosamente');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPrize(null);
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-500">Activo</Badge>
    ) : (
      <Badge className="bg-red-500">Inactivo</Badge>
    );
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-500">Sin stock</Badge>;
    } else if (stock < 5) {
      return <Badge className="bg-yellow-500">Stock bajo</Badge>;
    } else {
      return <Badge className="bg-green-500">En stock</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando premios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gestión de Premios</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Crear Premio
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{prizes.length}</div>
            <div className="text-gray-300">Total Premios</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {prizes.filter(p => p.stock > 0).length}
            </div>
            <div className="text-gray-300">Con Stock</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">
              {prizes.filter(p => p.stock === 0).length}
            </div>
            <div className="text-gray-300">Sin Stock</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-400">
              {prizes.reduce((sum, p) => sum + p.points_cost, 0)}
            </div>
            <div className="text-gray-300">Total Puntos</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Premios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes.map((prize) => (
          <Card key={prize.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-lg">{prize.name}</CardTitle>
                <div className="flex gap-2">
                  {getStatusBadge(prize.status)}
                  {getStockBadge(prize.stock)}
                </div>
              </div>
              {prize.category && (
                <Badge variant="outline" className="text-orange-400 border-orange-400">
                  {prize.category}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {prize.image_url && (
                <img 
                  src={prize.image_url} 
                  alt={prize.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {prize.description || 'Sin descripción'}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-orange-400 font-bold">{prize.points_cost} puntos</span>
                <span className="text-gray-300">Stock: {prize.stock}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(prize)}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prize.id)}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal para Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingPrize ? 'Editar Premio' : 'Crear Premio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">URL de Imagen</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Categoría</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Costo en Puntos *</label>
                  <input
                    type="number"
                    value={formData.points_cost}
                    onChange={(e) => setFormData({...formData, points_cost: parseInt(e.target.value) || 0})}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  {editingPrize ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 