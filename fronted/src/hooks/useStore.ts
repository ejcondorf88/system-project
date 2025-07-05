import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userAdapter from '@/adapters/user.adapter';

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

interface UseStoreReturn {
  products: Product[];
  selectedCategory: 'all' | 'supplement' | 'equipment' | 'clothing';
  cart: Product[];
  userPoints: number;
  loading: boolean;
  error: string | null;
  setSelectedCategory: (category: 'all' | 'supplement' | 'equipment' | 'clothing') => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  refreshUserPoints: () => Promise<void>;
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

export const useStore = (): UseStoreReturn => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'supplement' | 'equipment' | 'clothing'>('all');
  const [cart, setCart] = useState<Product[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserPoints = async () => {
    try {
      const points = await userAdapter.getUserPoints();
      setUserPoints(points);
      setError(null);
    } catch (error) {
      console.error('Error fetching user points:', error);
      setError('Error al cargar los puntos del usuario');
      if (error instanceof Error && error.message === 'No token found') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const refreshUserPoints = async () => {
    await fetchUserPoints();
  };

  useEffect(() => {
    fetchUserPoints();
  }, [navigate]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return {
    products: filteredProducts,
    selectedCategory,
    cart,
    userPoints,
    loading,
    error,
    setSelectedCategory,
    addToCart,
    removeFromCart,
    clearCart,
    refreshUserPoints
  };
}; 