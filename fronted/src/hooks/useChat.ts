import { useEffect, useState } from 'react';
import chatAdapter, { type ChatMessage } from '../adapters/chat.adapter';
import { useAuth } from './useAuth';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { user } = useAuth();

  console.log('Usuario actual:', user);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const historyMessages = await chatAdapter.getMessages();
      setMessages(historyMessages);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      // En caso de error, mostrar mensaje de bienvenida
      setMessages([
        {
          id: '1',
          sender: 'ia',
          content: 'Bienvenido al sistema. ¿En qué puedo ayudarte?',
          timestamp: Date.now() - 10000,
        },
      ]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    console.log('=== INICIO DE sendMessage ===');
    console.log('messageToSend:', messageToSend);
    console.log('user:', user);
    console.log('user.id:', user?.id);
    
    if (!messageToSend.trim()) {
      console.log('No hay mensaje para enviar');
      return;
    }
    
    // Si no hay usuario, intentar obtenerlo del localStorage como fallback
    let currentUser = user;
    if (!user) {
      console.log('Usuario es null, intentando obtener del localStorage...');
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          currentUser = JSON.parse(userData);
          console.log('Usuario obtenido del localStorage:', currentUser);
        } catch (error) {
          console.error('Error al parsear usuario del localStorage:', error);
        }
      }
    }
    
    if (!currentUser) {
      console.log('No hay usuario autenticado');
      // Opcional: mostrar mensaje de error al usuario
      return;
    }
    
    if (!currentUser.id) {
      console.log('Usuario no tiene ID válido');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Enviando mensaje:', messageToSend, 'user:', currentUser);
      console.log('user.id (number):', parseInt(currentUser.id));
      
      // Agregar el mensaje del usuario inmediatamente
      const userMessage: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        sender: 'user',
        content: messageToSend,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      const currentInput = messageToSend;
      if (!customMessage) {
        setInput('');
      }
      
      console.log('Llamando a chatAdapter.sendMessage...');
      // Enviar mensaje a la API y obtener respuesta
      const aiResponse = await chatAdapter.sendMessage(currentInput, parseInt(currentUser.id));
      console.log('Respuesta recibida:', aiResponse);
      
      // Agregar la respuesta de la IA
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Opcional: mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await chatAdapter.clearHistory();
      // Recargar historial después de limpiar
      await loadChatHistory();
    } catch (error) {
      console.error('Error al limpiar historial:', error);
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    isLoadingHistory,
    clearHistory,
  };
}; 