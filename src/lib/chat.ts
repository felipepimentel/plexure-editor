import type { Message } from './types';

export async function handleSendMessage(
  messages: Message[],
  content: string,
  setMessages: (messages: Message[]) => void
) {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    role: 'user',
    timestamp: Date.now()
  };
  
  setMessages([...messages, userMessage]);

  // Simulate assistant response
  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    content: 'I can help you with your OpenAPI specification. What would you like to know?',
    role: 'assistant',
    timestamp: Date.now()
  };

  setTimeout(() => {
    setMessages([...messages, userMessage, assistantMessage]);
  }, 1000);
} 