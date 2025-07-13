import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusOptions = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500' },
  { value: 'shipped', label: 'Enviado', color: 'bg-blue-500' },
  { value: 'delivered', label: 'Entregado', color: 'bg-green-500' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-500' }
];

export function PrizePurchases() {
  const { allPurchases, loading, getAllPurchases, updatePurchaseStatus } = useMarketplace();
  const { sendPurchaseNotification } = useWhatsApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('pending'); // Por defecto mostrar pendientes
  const [editingPurchase, setEditingPurchase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    getAllPurchases();
  }, []); // Solo se ejecuta una vez al montar el componente

  const filteredPurchases = selectedStatus === 'all' 
    ? allPurchases 
    : allPurchases.filter(purchase => purchase.status === selectedStatus);

  const handleStatusUpdate = async (purchaseId: number, newStatus: string) => {
    try {
      await updatePurchaseStatus(purchaseId, newStatus, trackingNumber);
      setTrackingNumber('');
      setIsModalOpen(false);
      setEditingPurchase(null);
      toast.success(`Estado actualizado a: ${statusOptions.find(opt => opt.value === newStatus)?.label}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el estado de la compra');
    }
  };

  const openWhatsAppModal = (purchase: any) => {
    setSelectedPurchase(purchase);
    setCustomMessage('');
    setIsWhatsAppModalOpen(true);
  };

  const handleSendWhatsApp = async () => {
    if (!selectedPurchase) return;
    
    try {
      // Obtener el teléfono del usuario
      const phone = selectedPurchase.user?.phone || selectedPurchase.shipping_address || '';
      
      if (!phone) {
        toast.error('No hay número de teléfono disponible para enviar el mensaje');
        return;
      }

      await sendPurchaseNotification(phone, selectedPurchase, customMessage);
      toast.success('Mensaje de WhatsApp enviado exitosamente');
      setIsWhatsAppModalOpen(false);
      setSelectedPurchase(null);
      setCustomMessage('');
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error);
      toast.error('Error al enviar mensaje de WhatsApp');
    }
  };

  const openStatusModal = (purchase: any) => {
    setEditingPurchase(purchase);
    setTrackingNumber(purchase.tracking_number || '');
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? (
      <Badge className={statusOption.color}>{statusOption.label}</Badge>
    ) : (
      <Badge className="bg-gray-500">{status}</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Compras</h1>
          {allPurchases.filter(p => p.status === 'pending').length > 0 && (
            <p className="text-orange-400 text-sm mt-1">
              ⚠️ {allPurchases.filter(p => p.status === 'pending').length} compra(s) pendiente(s) requieren atención
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las compras</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{allPurchases.length}</div>
            <div className="text-gray-300">Total Compras</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {allPurchases.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-gray-300">Pendientes</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">
              {allPurchases.filter(p => p.status === 'shipped').length}
            </div>
            <div className="text-gray-300">Enviadas</div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">
              {allPurchases.filter(p => p.status === 'delivered').length}
            </div>
            <div className="text-gray-300">Entregadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Compras */}
      <div className="space-y-4">
        {filteredPurchases.length === 0 ? (
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-bold text-white mb-2">No hay compras registradas</h3>
              <p className="text-gray-300">
                Cuando los usuarios realicen compras con sus puntos, aparecerán aquí para su gestión.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPurchases.map((purchase) => (
          <Card key={purchase.id} className="bg-white/10 border-white/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">
                    Compra #{purchase.id} - {purchase.prize.name}
                  </CardTitle>
                  <p className="text-gray-300 text-sm">
                    Usuario ID: {purchase.user_id} | {formatDate(purchase.purchase_date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(purchase.status)}
                  <div className="flex gap-2">
                    {purchase.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(purchase.id, 'shipped')}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                        title="Marcar como enviado"
                      >
                        Enviar
                      </button>
                    )}
                    <button
                      onClick={() => openWhatsAppModal(purchase)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                      title="Enviar notificación por WhatsApp"
                    >
                      📱 WhatsApp
                    </button>
                    <button
                      onClick={() => openStatusModal(purchase)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Actualizar Estado
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-orange-400 font-semibold mb-2">Detalles del Premio</h4>
                  <p className="text-gray-300 text-sm">{purchase.prize.description}</p>
                  <p className="text-orange-400 font-bold">{purchase.points_spent} puntos gastados</p>
                </div>
                
                <div>
                  <h4 className="text-orange-400 font-semibold mb-2">Dirección de Envío</h4>
                  <p className="text-gray-300 text-sm">
                    {purchase.shipping_address || 'No especificada'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-orange-400 font-semibold mb-2">Seguimiento</h4>
                  {purchase.tracking_number ? (
                    <p className="text-gray-300 text-sm">
                      Número: {purchase.tracking_number}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">Sin número de seguimiento</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Modal para actualizar estado */}
      {isModalOpen && editingPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Actualizar Estado de Compra
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Premio</label>
                <p className="text-gray-300">{editingPurchase.prize.name}</p>
              </div>
              
              <div>
                <label className="block text-white mb-2">Estado Actual</label>
                {getStatusBadge(editingPurchase.status)}
              </div>
              
              <div>
                <label className="block text-white mb-2">Nuevo Estado</label>
                <Select onValueChange={(value) => setEditingPurchase({...editingPurchase, status: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-white mb-2">
                  Número de Seguimiento
                  {editingPurchase.status === 'pending' && editingPurchase.status !== 'shipped' && (
                    <span className="text-orange-400 text-sm ml-2">(Recomendado para envíos)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                  placeholder={editingPurchase.status === 'pending' ? "Ej: TRK123456789" : "Opcional"}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleStatusUpdate(editingPurchase.id, editingPurchase.status)}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Actualizar
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPurchase(null);
                    setTrackingNumber('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de WhatsApp */}
      {isWhatsAppModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Enviar Notificación por WhatsApp
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Compra</label>
                <p className="text-gray-300">#{selectedPurchase.id} - {selectedPurchase.prize.name}</p>
              </div>
              
              <div>
                <label className="block text-white mb-2">Estado Actual</label>
                {getStatusBadge(selectedPurchase.status)}
              </div>
              
              <div>
                <label className="block text-white mb-2">Usuario</label>
                <p className="text-gray-300">{selectedPurchase.user?.username || 'Usuario no encontrado'}</p>
              </div>
              
              <div>
                <label className="block text-white mb-2">Teléfono</label>
                <p className="text-gray-300">{selectedPurchase.user?.phone || selectedPurchase.shipping_address || 'No especificado'}</p>
              </div>
              
              <div>
                <label className="block text-white mb-2">
                  Mensaje Personalizado (Opcional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 h-24 resize-none"
                  placeholder="Escribe un mensaje personalizado para el cliente..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSendWhatsApp}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  📱 Enviar WhatsApp
                </button>
                <button
                  onClick={() => {
                    setIsWhatsAppModalOpen(false);
                    setSelectedPurchase(null);
                    setCustomMessage('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 