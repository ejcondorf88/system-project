import { motion } from 'framer-motion';
import { FaShoppingCart, FaCoins, FaGift, FaStar, FaSignOutAlt, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { toast } from 'sonner';

export const Store = () => {
  const navigate = useNavigate();
  const { logout, user, refreshUser } = useAuth();
  const { prizes, loading, purchasePrize, getMyPurchases } = useMarketplace();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchasing, setPurchasing] = useState<number | null>(null);

  const userPoints = user?.points || 0;

  const categories = [
    { key: 'all', name: 'Todos', icon: '🛍️' },
    { key: 'suplementos', name: 'Suplementos', icon: '💊' },
    { key: 'equipamiento', name: 'Equipamiento', icon: '🏋️' },
    { key: 'ropa', name: 'Ropa', icon: '👕' },
    { key: 'accesorios', name: 'Accesorios', icon: '⌚' },
    { key: 'tecnología', name: 'Tecnología', icon: '📱' },
    { key: 'otros', name: 'Otros', icon: '🎁' }
  ];

  const filteredPrizes = selectedCategory === 'all' 
    ? prizes 
    : prizes.filter(prize => prize.category === selectedCategory);

  const handlePurchase = async (prizeId: number) => {
    if (!user) {
      toast.error('Debes estar logueado para comprar');
      return;
    }

    const prize = prizes.find(p => p.id === prizeId);
    if (!prize) {
      toast.error('Premio no encontrado');
      return;
    }

    if (userPoints < prize.points_cost) {
      toast.error(`No tienes suficientes puntos. Necesitas ${prize.points_cost} puntos`);
      return;
    }

    if (prize.stock <= 0) {
      toast.error('Este premio está agotado');
      return;
    }

    setPurchasing(prizeId);
    
    try {
      await purchasePrize({
        prize_id: prizeId,
        shipping_address: user.phone || 'Dirección no especificada'
      });
      
      toast.success(`¡Compra exitosa! Has gastado ${prize.points_cost} puntos`);
      
      // Actualizar las compras del usuario
      await getMyPurchases();
      await refreshUser(); // Actualizar el usuario en el estado global
    } catch (error) {
      console.error('Error al comprar:', error);
    } finally {
      setPurchasing(null);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Agotado', color: 'text-red-400', bg: 'bg-red-400/20' };
    if (stock < 5) return { text: 'Stock bajo', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    return { text: 'En stock', color: 'text-green-400', bg: 'bg-green-400/20' };
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -inset-10 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      <main className="flex-1 w-full flex flex-col items-center px-4 pb-24 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mb-6"
        >
          <div className="text-center mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-white">🏪 Marketplace</h1>
              <button 
                onClick={logout}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-400 transition"
              >
                <FaSignOutAlt className="text-xs" />
                Salir
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-orange-300">
              <FaCoins className="text-xl" />
              <span className="font-semibold">
                {loading ? 'Cargando...' : `${userPoints} puntos disponibles`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Filtros de categorías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mb-6"
        >
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.key
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Lista de premios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-md space-y-4"
        >
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-white text-sm">Cargando premios...</p>
              </div>
            </div>
          ) : filteredPrizes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No hay premios disponibles en esta categoría</p>
            </div>
          ) : (
            filteredPrizes.map((prize, index) => {
              const stockStatus = getStockStatus(prize.stock);
              const canAfford = userPoints >= prize.points_cost;
              const isPurchasing = purchasing === prize.id;
              
              return (
                <motion.div
                  key={prize.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start gap-4">
                    {/* Imagen del premio */}
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center text-2xl">
                      {prize.image_url ? (
                        <img 
                          src={prize.image_url} 
                          alt={prize.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        '🎁'
                      )}
                    </div>
                    
                    {/* Información del premio */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold text-lg">{prize.name}</h3>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-white text-sm">4.5</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {prize.description || 'Sin descripción disponible'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <FaCoins className="text-yellow-400 text-sm" />
                            <span className="text-white text-sm font-semibold">{prize.points_cost} pts</span>
                          </div>
                          <span className="text-white/70 text-sm">•</span>
                          <span className={`text-xs px-2 py-1 rounded ${stockStatus.color} ${stockStatus.bg}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handlePurchase(prize.id)}
                          disabled={!canAfford || prize.stock <= 0 || isPurchasing}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition ${
                            isPurchasing
                              ? 'bg-blue-500 text-white cursor-wait'
                              : canAfford && prize.stock > 0
                              ? 'bg-orange-500 text-white hover:bg-orange-400'
                              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {isPurchasing ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Comprando...
                            </>
                          ) : (
                            <>
                              <FaGift className="text-xs" />
                              {canAfford && prize.stock > 0 ? 'Comprar' : 'No disponible'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </main>

      {/* Barra de navegación inferior fija */}
      <nav className="w-full max-w-md grid grid-cols-4 gap-0 fixed bottom-0 left-1/2 -translate-x-1/2 bg-white/10 rounded-t-2xl border-t border-white/20 overflow-hidden shadow-lg z-30">
        <button onClick={() => navigate('/routines')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors">Rutinas</button>
        <button onClick={() => navigate('/chat')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors border-l border-white/20">Chat</button>
        <button onClick={() => navigate('/store')} className="py-3 text-orange-400 font-semibold text-sm bg-orange-500/20 transition-colors border-l border-white/20">Tienda</button>
        <button onClick={() => navigate('/profile')} className="py-3 text-white font-semibold text-sm hover:bg-orange-500/30 transition-colors border-l border-white/20">Perfil</button>
      </nav>
    </div>
  );
}; 