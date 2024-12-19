import { OpenRouterMessage, sendMessageToOpenRouter } from './openrouter-config';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
}

export async function handleSendMessage(
  messages: Message[],
  newMessage: string,
  setMessages: (messages: Message[]) => void
): Promise<void> {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: newMessage,
    timestamp: Date.now(),
    status: 'sent'
  };
  
  // Add temporary assistant message to show loading state
  const loadingMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: '...',
    timestamp: Date.now(),
    status: 'sending'
  };
  
  const updatedMessages = [...messages, userMessage, loadingMessage];
  setMessages(updatedMessages);

  try {
    // Convert messages to OpenRouter format (excluding the loading message)
    const openRouterMessages: OpenRouterMessage[] = messages
      .concat(userMessage)
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    // Get response from OpenRouter
    const response = await sendMessageToOpenRouter(openRouterMessages);

    // Replace loading message with actual response
    const assistantMessage: Message = {
      id: loadingMessage.id,
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
      status: 'sent'
    };

    setMessages([...messages, userMessage, assistantMessage]);
  } catch (error) {
    console.error('Error handling message:', error);
    
    // Replace loading message with error message
    const errorMessage: Message = {
      id: loadingMessage.id,
      role: 'assistant',
      content: 'Sorry, I encountered an error while processing your request. Please try again.',
      timestamp: Date.now(),
      status: 'error'
    };

    setMessages([...messages, userMessage, errorMessage]);
  }
} 