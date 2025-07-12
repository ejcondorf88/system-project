import axios from 'axios';

const API_URL = 'http://localhost:8080/api/marketplace';

export interface Prize {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  points_cost: number;
  stock: number;
  category?: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface PrizePurchase {
  id: number;
  user_id: number;
  prize_id: number;
  points_spent: number;
  purchase_date: string;
  status: string;
  shipping_address?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  prize: Prize;
}

export interface PurchaseRequest {
  prize_id: number;
  shipping_address?: string;
}

const marketplaceAdapter = {
  // Obtener todos los premios
  async getPrizes(): Promise<Prize[]> {
    try {
      const response = await axios.get(`${API_URL}/prizes`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener premios');
      }
      throw error;
    }
  },

  // Obtener premio por ID
  async getPrize(id: number): Promise<Prize> {
    try {
      const response = await axios.get(`${API_URL}/prizes/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener premio');
      }
      throw error;
    }
  },

  // Obtener premios por categoría
  async getPrizesByCategory(category: string): Promise<Prize[]> {
    try {
      const response = await axios.get(`${API_URL}/prizes/category/${category}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener premios por categoría');
      }
      throw error;
    }
  },

  // Comprar un premio
  async purchasePrize(purchaseData: PurchaseRequest): Promise<PrizePurchase> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.post(`${API_URL}/purchase`, purchaseData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al procesar la compra');
      }
      throw error;
    }
  },

  // Obtener mis compras
  async getMyPurchases(): Promise<PrizePurchase[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(`${API_URL}/purchases/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener compras');
      }
      throw error;
    }
  },

  // Obtener todas las compras (solo admin)
  async getAllPurchases(): Promise<PrizePurchase[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get(`${API_URL}/purchases/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener todas las compras');
      }
      throw error;
    }
  },

  // Crear premio (solo admin)
  async createPrize(prizeData: Omit<Prize, 'id' | 'created_at' | 'updated_at'>): Promise<Prize> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.post(`${API_URL}/prizes`, prizeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al crear premio');
      }
      throw error;
    }
  },

  // Actualizar premio (solo admin)
  async updatePrize(id: number, prizeData: Partial<Prize>): Promise<Prize> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.put(`${API_URL}/prizes/${id}`, prizeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al actualizar premio');
      }
      throw error;
    }
  },

  // Eliminar premio (solo admin)
  async deletePrize(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      await axios.delete(`${API_URL}/prizes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al eliminar premio');
      }
      throw error;
    }
  },

  // Actualizar estado de compra (solo admin)
  async updatePurchaseStatus(purchaseId: number, status: string, trackingNumber?: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.put(`${API_URL}/purchases/${purchaseId}/status`, {
        status,
        tracking_number: trackingNumber
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al actualizar estado de compra');
      }
      throw error;
    }
  }
};

export default marketplaceAdapter; 