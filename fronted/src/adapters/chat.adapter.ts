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

export interface ChatMessageResponse {
  id: number;
  user_id: number;
  message_type: string;
  content: string;
  timestamp: string;
  session_id?: string;
}

const chatAdapter = {
  async getMessages(): Promise<ChatMessage[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return [
          {
            id: '1',
            sender: 'ia',
            content: 'Bienvenido al sistema. ¿En qué puedo ayudarte?',
            timestamp: Date.now() - 10000,
          },
        ];
      }

      const response = await apiAdapter.get('/chat/history');
      console.log('Historial cargado:', response);

      // Convertir mensajes de la base de datos al formato del frontend
      const messages: ChatMessage[] = response.map((msg: ChatMessageResponse) => ({
        id: msg.id.toString(),
        sender: msg.message_type === 'ai' ? 'ia' : 'user',
        content: msg.content,
        timestamp: new Date(msg.timestamp).getTime(),
      }));

      // Si no hay mensajes, mostrar mensaje de bienvenida
      if (messages.length === 0) {
        return [
          {
            id: '1',
            sender: 'ia',
            content: 'Bienvenido al sistema. ¿En qué puedo ayudarte?',
            timestamp: Date.now() - 10000,
          },
        ];
      }

      return messages;
    } catch (error) {
      console.error('Error al cargar historial:', error);
      // Retornar mensaje de bienvenida en caso de error
      return [
        {
          id: '1',
          sender: 'ia',
          content: 'Bienvenido al sistema. ¿En qué puedo ayudarte?',
          timestamp: Date.now() - 10000,
        },
      ];
    }
  },
  
  async sendMessage(content: string, userId: number): Promise<ChatMessage> {
    try {
      console.log('=== chatAdapter.sendMessage ===');
      console.log('content:', content);
      console.log('userId:', userId);
      
      const messageData = {
        message: content,
        user_id: userId,
        timestamp: new Date().toISOString(),
      };
      
      console.log('messageData a enviar:', messageData);

      const response = await apiAdapter.sendChatMessage(messageData);
      console.log('Respuesta del backend:', response);
      
      // Crear la respuesta de la IA usando el campo 'message' de la respuesta
      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        sender: 'ia',
        content: response.message || 'Gracias por tu mensaje.',
        timestamp: Date.now() + 1000,
      };

      console.log('aiMessage creado:', aiMessage);
      return aiMessage;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw new Error('Error al enviar mensaje');
    }
  },

  async getChatSessions(): Promise<any[]> {
    try {
      const response = await apiAdapter.get('/chat/sessions');
      return response;
    } catch (error) {
      console.error('Error al obtener sesiones:', error);
      return [];
    }
  },

  async clearHistory(): Promise<void> {
    try {
      await apiAdapter.delete('/chat/clear');
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      throw new Error('Error al limpiar historial');
    }
  },
};

export default chatAdapter; 