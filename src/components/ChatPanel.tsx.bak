import React from 'react';
import { cn } from '../lib/utils';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import type { Message } from '../lib/chat';

interface ChatPanelProps {
  messages?: Message[];
  onSendMessage: (message: string) => void;
  className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages = [],
  onSendMessage,
  className,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await onSendMessage(inputValue.trim());
      setInputValue('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Bot className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              How can I help you today?
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              I can help you with your OpenAPI specification, answer questions about API design,
              and provide guidance on best practices.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 max-w-[80%]',
                message.role === 'assistant' ? 'mr-auto' : 'ml-auto'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={cn(
                'rounded-lg p-3',
                message.role === 'assistant'
                  ? 'bg-muted'
                  : 'bg-primary text-primary-foreground',
                message.status === 'sending' && 'opacity-70'
              )}>
                <div className="text-sm whitespace-pre-wrap break-words">
                  {message.status === 'sending' ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  ) : message.status === 'error' ? (
                    <div className="text-destructive">{message.content}</div>
                  ) : (
                    message.content
                  )}
                </div>
                <div className={cn(
                  'text-[10px] mt-1',
                  message.role === 'assistant'
                    ? 'text-muted-foreground'
                    : 'text-primary-foreground/80'
                )}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={cn(
              'w-full px-4 py-3 pr-12 rounded-lg border bg-background resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'placeholder:text-muted-foreground',
              'min-h-[80px] max-h-[200px]'
            )}
            style={{ height: '80px' }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={cn(
              'absolute right-2 bottom-2 p-2 rounded-md',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              inputValue.trim()
                ? 'text-primary hover:bg-primary/10'
                : 'text-muted-foreground'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Press Enter to send, Shift + Enter for new line
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;
