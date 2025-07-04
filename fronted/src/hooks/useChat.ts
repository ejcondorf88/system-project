import { useEffect, useState } from 'react';
import chatAdapter, { type ChatMessage } from '../adapters/chat.adapter';
import { useAuth } from './useAuth';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  console.log('Usuario actual:', user);

  useEffect(() => {
    chatAdapter.getMessages().then(setMessages);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !user) {
      console.log('No hay input o usuario', { input, user });
      return;
    }
    setIsLoading(true);
    try {
      console.log('Enviando mensaje:', input, 'user:', user);
      // Agregar el mensaje del usuario inmediatamente
      const userMessage: ChatMessage = {
        id: Math.random().toString(36).slice(2),
        sender: 'user',
        content: input,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      const currentInput = input;
      setInput('');
      // Enviar mensaje a la API y obtener respuesta
      const aiResponse = await chatAdapter.sendMessage(currentInput, parseInt(user.id));
      // Agregar la respuesta de la IA
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Opcional: mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
  };
}; 