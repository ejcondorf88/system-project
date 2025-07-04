// Adapter para chat usando API real
import { apiAdapter } from './api';

export interface ChatMessage {
  id: string;
  sender: 'ia' | 'user';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  message: string;
  user_id: number;
  timestamp: string;
}

const chatAdapter = {
  async getMessages(): Promise<ChatMessage[]> {
    // Por ahora retornamos un mensaje de bienvenida
    // En el futuro se puede implementar un endpoint para obtener historial
    return [
      {
        id: '1',
        sender: 'ia',
        content: 'Bienvenido al sistema. ¿En qué puedo ayudarte?',
        timestamp: Date.now() - 10000,
      },
    ];
  },
  
  async sendMessage(content: string, userId: number): Promise<ChatMessage> {
    try {
      const messageData = {
        message: content,
        user_id: userId,
        timestamp: new Date().toISOString(),
      };

      const response = await apiAdapter.sendChatMessage(messageData);
      
      // Crear el mensaje del usuario
      const userMessage: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        sender: 'user',
        content,
        timestamp: Date.now(),
      };

      // Crear la respuesta de la IA (asumiendo que la API retorna la respuesta)
      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        sender: 'ia',
        content: response.message || 'Gracias por tu mensaje.',
        timestamp: Date.now() + 1000,
      };

      return aiMessage;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw new Error('Error al enviar mensaje');
    }
  },
};

export default chatAdapter; 