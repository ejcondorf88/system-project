import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-backend-app.onrender.com/api'  // URL de producción en Render
  : 'http://localhost:8080/api'; // URL de desarrollo local

export interface WhatsAppMessage {
  phone: string;
  message: string;
}

export interface WelcomeMessage {
  phone: string;
  name: string;
}

export interface PurchaseNotification {
  phone: string;
  purchaseData: any;
  customMessage?: string;
}

export interface WhatsAppStatus {
  enabled: boolean;
  ready: boolean;
  client_initialized: boolean;
  status: string;
  error?: string;
}

export interface WhatsAppResponse {
  success: boolean;
  message: string;
  phone?: string;
  name?: string;
  status?: string;
}

const whatsappAdapter = {
  /**
   * Envía un mensaje personalizado por WhatsApp
   */
  async sendMessage(messageData: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-message`, messageData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al enviar mensaje de WhatsApp');
      }
      throw error;
    }
  },

  /**
   * Envía un mensaje de bienvenida por WhatsApp
   */
  async sendWelcome(welcomeData: WelcomeMessage): Promise<WhatsAppResponse> {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-welcome`, welcomeData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al enviar mensaje de bienvenida');
      }
      throw error;
    }
  },

  /**
   * Envía un mensaje de bienvenida desde el CRM
   */
  async sendWelcomeCRM(welcomeData: WelcomeMessage): Promise<WhatsAppResponse> {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-welcome-crm`, welcomeData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al enviar mensaje de bienvenida desde CRM');
      }
      throw error;
    }
  },

  /**
   * Envía una notificación de compra por WhatsApp
   */
  async sendPurchaseNotification(notificationData: PurchaseNotification): Promise<WhatsAppResponse> {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/send-purchase-notification`, notificationData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al enviar notificación de compra');
      }
      throw error;
    }
  },

  /**
   * Obtiene el estado del servicio de WhatsApp
   */
  async getStatus(): Promise<WhatsAppStatus> {
    try {
      const response = await axios.get(`${API_URL}/whatsapp/status`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al obtener estado de WhatsApp');
      }
      throw error;
    }
  },

  /**
   * Prueba el servicio de WhatsApp
   */
  async test(): Promise<WhatsAppResponse> {
    try {
      const response = await axios.post(`${API_URL}/whatsapp/test`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Error al probar WhatsApp');
      }
      throw error;
    }
  },

  /**
   * Formatea un número de teléfono para WhatsApp
   */
  formatPhone(phone: string): string {
    // Remover caracteres especiales
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Si no tiene código de país, agregar +52 (México)
    if (cleanPhone.length === 10) {
      return `52${cleanPhone}`;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('52')) {
      return cleanPhone;
    }
    
    return cleanPhone;
  },

  /**
   * Valida un número de teléfono
   */
  validatePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  }
};

export default whatsappAdapter; 