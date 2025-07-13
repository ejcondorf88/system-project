import React, { useState, useEffect, useCallback } from 'react';
import marketplaceAdapter from '@/adapters/marketplace.adapter';
import type { Prize, PrizePurchase, PurchaseRequest } from '@/adapters/marketplace.adapter';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface UseMarketplaceReturn {
  prizes: Prize[];
  myPurchases: PrizePurchase[];
  allPurchases: PrizePurchase[];
  loading: boolean;
  error: string | null;
  getPrizes: () => Promise<void>;
  getPrizesByCategory: (category: string) => Promise<Prize[]>;
  purchasePrize: (purchaseData: PurchaseRequest) => Promise<void>;
  getMyPurchases: () => Promise<void>;
  getAllPurchases: () => Promise<void>;
  createPrize: (prizeData: Omit<Prize, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePrize: (id: number, prizeData: Partial<Prize>) => Promise<void>;
  deletePrize: (id: number) => Promise<void>;
  updatePurchaseStatus: (purchaseId: number, status: string, trackingNumber?: string) => Promise<void>;
}

export const useMarketplace = (): UseMarketplaceReturn => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [myPurchases, setMyPurchases] = useState<PrizePurchase[]>([]);
  const [allPurchases, setAllPurchases] = useState<PrizePurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  const getPrizes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketplaceAdapter.getPrizes();
      setPrizes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener premios';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPrizesByCategory = async (category: string): Promise<Prize[]> => {
    try {
      setError(null);
      const data = await marketplaceAdapter.getPrizesByCategory(category);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener premios por categoría';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    }
  };

  const purchasePrize = async (purchaseData: PurchaseRequest) => {
    try {
      setLoading(true);
      setError(null);
      await marketplaceAdapter.purchasePrize(purchaseData);
      toast.success('¡Compra realizada exitosamente!');
      
      // Actualizar la lista de premios para reflejar el stock actualizado
      await getPrizes();
      
      // Actualizar las compras del usuario
      await getMyPurchases();
      await refreshUser(); // Actualizar el usuario en el contexto
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la compra';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMyPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketplaceAdapter.getMyPurchases();
      setMyPurchases(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener compras';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAllPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketplaceAdapter.getAllPurchases();
      setAllPurchases(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener todas las compras';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Memoizar las funciones para evitar recreaciones
  const memoizedGetAllPurchases = useCallback(getAllPurchases, []);

  const createPrize = async (prizeData: Omit<Prize, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      await marketplaceAdapter.createPrize(prizeData);
      toast.success('Premio creado exitosamente');
      await getPrizes(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear premio';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePrize = async (id: number, prizeData: Partial<Prize>) => {
    try {
      setLoading(true);
      setError(null);
      await marketplaceAdapter.updatePrize(id, prizeData);
      toast.success('Premio actualizado exitosamente');
      await getPrizes(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar premio';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePrize = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await marketplaceAdapter.deletePrize(id);
      toast.success('Premio eliminado exitosamente');
      await getPrizes(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar premio';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseStatus = async (purchaseId: number, status: string, trackingNumber?: string) => {
    try {
      setLoading(true);
      setError(null);
      await marketplaceAdapter.updatePurchaseStatus(purchaseId, status, trackingNumber);
      toast.success('Estado de compra actualizado exitosamente');
      await getAllPurchases(); // Actualizar la lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado de compra';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar premios al inicializar
  useEffect(() => {
    getPrizes();
  }, []);

  return {
    prizes,
    myPurchases,
    allPurchases,
    loading,
    error,
    getPrizes,
    getPrizesByCategory,
    purchasePrize,
    getMyPurchases,
    getAllPurchases: memoizedGetAllPurchases,
    createPrize,
    updatePrize,
    deletePrize,
    updatePurchaseStatus
  };
}; 