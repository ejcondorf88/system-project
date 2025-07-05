import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCoins, FaGift, FaDumbbell, FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  points: number;
  image: string;
  category: 'supplement' | 'equipment' | 'clothing';
  rating: number;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Proteína Whey Gold Standard',
    description: 'Proteína de alta calidad para recuperación muscular',
    price: 45.99,
    points: 250,
    image: '🥛',
    category: 'supplement',
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: 'Creatina Monohidratada',
    description: 'Suplemento para fuerza y potencia',
    price: 25.50,
    points: 150,
    image: '💪',
    category: 'supplement',
    rating: 4.9,
    inStock: true
  },
  {
    id: 3,
    name: 'BCAA Aminoácidos',
    description: 'Recuperación muscular y reducción de fatiga',
    price: 32.99,
    points: 180,
    image: '🧬',
    category: 'supplement',
    rating: 4.7,
    inStock: true
  },
  {
    id: 4,
    name: 'Mancuernas Ajustables',
    description: 'Set de mancuernas de 2-20kg',
    price: 89.99,
    points: 500,
    image: '🏋️',
    category: 'equipment',
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: 'Cinta de Resistencia',
    description: 'Set de 5 bandas de resistencia',
    price: 18.99,
    points: 100,
    image: '🎯',
    category: 'equipment',
    rating: 4.5,
    inStock: true
  },
  {
    id: 6,
    name: 'Camiseta Deportiva Premium',
    description: 'Material transpirable y cómodo',
    price: 34.99,
    points: 200,
    image: '👕',
    category: 'clothing',
    rating: 4.4,
    inStock: true
  },
  {
    id: 7,
    name: 'Pre-entreno Explosivo',
    description: 'Energía y enfoque para entrenamientos',
    price: 38.50,
    points: 220,
    image: '⚡',
    category: 'supplement',
    rating: 4.8,
    inStock: false
  },
  {
    id: 8,
    name: 'Yoga Mat Premium',
    description: 'Alfombrilla antideslizante',
    price: 28.99,
    points: 160,
    image: '🧘',
    category: 'equipment',
    rating: 4.3,
    inStock: true
  }
];

export const Store = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'supplement' | 'equipment' | 'clothing'>('all');
  const [cart, setCart] = useState<Product[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserPoints(response.data.points || 0);
      } catch (error) {
        console.error('Error fetching user points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
  }, [navigate]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'supplement': return '💊';
      case 'equipment': return '🏋️';
      case 'clothing': return '👕';
      default: return '🛍️';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'supplement': return 'Suplementos';
      case 'equipment': return 'Equipamiento';
      case 'clothing': return 'Ropa';
      default: return 'Todos';
    }
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
            <h1 className="text-3xl font-bold text-white mb-2">🏪 Tienda Fitness</h1>
            <div className="flex items-center justify-center gap-2 text-orange-300">
              <FaCoins className="text-xl" />
              <span className="font-semibold">
                {loading ? 'Cargando...' : `${userPoints} puntos disponibles`}
              </span>
            </div>
          </div>

          {/* Carrito */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaShoppingCart className="text-orange-400 text-xl" />
                <span className="text-white font-semibold">Carrito ({cart.length})</span>
              </div>
              {cart.length > 0 && (
                <button className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-400 transition">
                  Canjear ({cart.reduce((sum, item) => sum + item.points, 0)} pts)
                </button>
              )}
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
            {[
              { key: 'all', name: 'Todos', icon: '🛍️' },
              { key: 'supplement', name: 'Suplementos', icon: '💊' },
              { key: 'equipment', name: 'Equipamiento', icon: '🏋️' },
              { key: 'clothing', name: 'Ropa', icon: '👕' }
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key as any)}
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

        {/* Lista de productos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-md space-y-4"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start gap-4">
                {/* Imagen del producto */}
                <div className="text-4xl">{product.image}</div>
                
                {/* Información del producto */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-white text-sm">{product.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-300 font-semibold">${product.price}</span>
                      <span className="text-white/70 text-sm">•</span>
                      <div className="flex items-center gap-1">
                        <FaCoins className="text-yellow-400 text-sm" />
                        <span className="text-white text-sm">{product.points} pts</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!product.inStock && (
                        <span className="text-red-400 text-xs bg-red-400/20 px-2 py-1 rounded">Agotado</span>
                      )}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition ${
                          product.inStock
                            ? 'bg-orange-500 text-white hover:bg-orange-400'
                            : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <FaGift className="text-xs" />
                        {product.inStock ? 'Agregar' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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