import { useEffect, useState } from 'react';
import chatAdapter, { type ChatMessage } from '../adapters/chat.adapter';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chatAdapter.getMessages().then(setMessages);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const newMsg = await chatAdapter.sendMessage(input);
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsLoading(false);
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
  };
}; 