import React from 'react';
import { cn } from '../lib/utils';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Command,
  Eraser,
  Copy,
  Check,
  MoreVertical,
  MessageSquare,
  Share2,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Repeat,
  Code2,
  FileJson,
  FileCode,
  Globe,
  Info
} from 'lucide-react';
import type { Message } from '../lib/chat';
import { Tooltip } from './ui/TooltipComponent';

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
  const [isTyping, setIsTyping] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showMessageMenu, setShowMessageMenu] = React.useState<string | null>(null);
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
      setIsTyping(true);
      await onSendMessage(inputValue.trim());
      setInputValue('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearChat = () => {
    // Implement clear chat functionality
  };

  const copyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const MessageActions = ({ message }: { message: Message }) => (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Tooltip content={copiedId === message.id ? 'Copied!' : 'Copy message'}>
        <button
          onClick={() => copyMessage(message.content, message.id)}
          className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          {copiedId === message.id ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </Tooltip>
      <div className="relative">
        <Tooltip content="More actions">
          <button
            onClick={() => setShowMessageMenu(showMessageMenu === message.id ? null : message.id)}
            className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
        {showMessageMenu === message.id && (
          <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
            <button
              onClick={() => setShowMessageMenu(null)}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button
              onClick={() => setShowMessageMenu(null)}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
            >
              <Repeat className="h-3.5 w-3.5" />
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-base font-medium mb-2">
              OpenAPI Assistant
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-8">
              I can help you with your OpenAPI specification, answer questions about API design,
              and provide guidance on best practices.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <button
                onClick={() => onSendMessage("Help me design a RESTful API")}
                className="flex items-center gap-2 p-3 text-sm text-left rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span>Design a RESTful API</span>
              </button>
              <button
                onClick={() => onSendMessage("What are OpenAPI best practices?")}
                className="flex items-center gap-2 p-3 text-sm text-left rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <FileCode className="w-4 h-4 text-primary" />
                <span>OpenAPI best practices</span>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3 max-w-[85%] group animate-in slide-in-from-bottom-2 duration-200',
                message.role === 'assistant' ? 'mr-auto' : 'ml-auto'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={cn(
                'rounded-lg p-3 group-hover:shadow-sm transition-all duration-200',
                message.role === 'assistant'
                  ? 'bg-card border'
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
                  'mt-1.5 flex items-center justify-between text-[10px]',
                  message.role === 'assistant'
                    ? 'text-muted-foreground'
                    : 'text-primary-foreground/80'
                )}>
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  {message.status !== 'sending' && message.status !== 'error' && (
                    <div className="flex items-center gap-2">
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-1">
                          <Tooltip content="Helpful">
                            <button className="p-1 rounded-sm hover:bg-muted/50 transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Not helpful">
                            <button className="p-1 rounded-sm hover:bg-muted/50 transition-colors">
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </Tooltip>
                        </div>
                      )}
                      <MessageActions message={message} />
                    </div>
                  )}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {messages.length} messages
            </div>
            <Tooltip content="Clear chat history">
              <button
                onClick={clearChat}
                className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-muted/50 transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about OpenAPI..."
            className={cn(
              'w-full px-4 py-3 pr-12 rounded-lg border bg-card resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'placeholder:text-muted-foreground',
              'min-h-[80px] max-h-[200px]',
              'transition-colors duration-200',
              isTyping && 'opacity-50'
            )}
            style={{ height: '80px' }}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={cn(
              'absolute right-2 bottom-2 p-2 rounded-md',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              inputValue.trim() && !isTyping
                ? 'text-primary hover:bg-primary/10 scale-100'
                : 'text-muted-foreground scale-95'
            )}
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
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
