import { useState, useCallback } from 'react';
import whatsappAdapter from '../adapters/whatsapp.adapter';
import type { WhatsAppMessage, WelcomeMessage, WhatsAppStatus, WhatsAppResponse } from '../adapters/whatsapp.adapter';

interface UseWhatsAppReturn {
  // Estado
  status: WhatsAppStatus | null;
  isLoading: boolean;
  error: string | null;
  
  // Funciones
  sendMessage: (phone: string, message: string) => Promise<WhatsAppResponse>;
  sendWelcome: (phone: string, name: string) => Promise<WhatsAppResponse>;
  sendWelcomeCRM: (phone: string, name: string) => Promise<WhatsAppResponse>;
  sendPurchaseNotification: (phone: string, purchaseData: any, customMessage?: string) => Promise<WhatsAppResponse>;
  getStatus: () => Promise<void>;
  testService: () => Promise<WhatsAppResponse>;
  formatPhone: (phone: string) => string;
  validatePhone: (phone: string) => boolean;
  clearError: () => void;
}

export const useWhatsApp = (): UseWhatsAppReturn => {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(async (phone: string, message: string): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedPhone = whatsappAdapter.formatPhone(phone);
      const response = await whatsappAdapter.sendMessage({
        phone: formattedPhone,
        message
      });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendWelcome = useCallback(async (phone: string, name: string): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedPhone = whatsappAdapter.formatPhone(phone);
      const response = await whatsappAdapter.sendWelcome({
        phone: formattedPhone,
        name
      });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendWelcomeCRM = useCallback(async (phone: string, name: string): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedPhone = whatsappAdapter.formatPhone(phone);
      const response = await whatsappAdapter.sendWelcomeCRM({
        phone: formattedPhone,
        name
      });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendPurchaseNotification = useCallback(async (phone: string, purchaseData: any, customMessage?: string): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedPhone = whatsappAdapter.formatPhone(phone);
      const response = await whatsappAdapter.sendPurchaseNotification({
        phone: formattedPhone,
        purchaseData,
        customMessage
      });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStatus = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const statusData = await whatsappAdapter.getStatus();
      setStatus(statusData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testService = useCallback(async (): Promise<WhatsAppResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await whatsappAdapter.test();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatPhone = useCallback((phone: string): string => {
    return whatsappAdapter.formatPhone(phone);
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    return whatsappAdapter.validatePhone(phone);
  }, []);

  return {
    status,
    isLoading,
    error,
    sendMessage,
    sendWelcome,
    sendWelcomeCRM,
    sendPurchaseNotification,
    getStatus,
    testService,
    formatPhone,
    validatePhone,
    clearError
  };
}; 