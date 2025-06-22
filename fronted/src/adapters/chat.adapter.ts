// Adapter simulado para chat
export interface ChatMessage {
  id: string;
  sender: 'ia' | 'user';
  content: string;
  timestamp: number;
}

const FAKE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'ia',
    content: 'Bienvenido al sistemas',
    timestamp: Date.now() - 10000,
  },
];

const chatAdapter = {
  async getMessages(): Promise<ChatMessage[]> {
    // Simula una petición
    return new Promise((resolve) => {
      setTimeout(() => resolve([...FAKE_MESSAGES]), 300);
    });
  },
  async sendMessage(content: string): Promise<ChatMessage> {
    // Simula el envío de un mensaje
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      sender: 'user',
      content,
      timestamp: Date.now(),
    };
    FAKE_MESSAGES.push(newMsg);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newMsg), 300);
    });
  },
};

export default chatAdapter; 