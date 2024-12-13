import React, { useState } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { BaseButton } from '@ui/Button';
import { BaseFormInput } from '@ui/Form';

interface AiAssistantProps {
  darkMode: boolean;
  onClose: () => void;
}

export function AiAssistant({ darkMode, onClose }: AiAssistantProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setQuery('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Implement AI API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'This is a placeholder response. The AI assistant is not yet implemented.'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      fixed bottom-4 right-4 w-96 rounded-lg shadow-lg
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      border
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bot className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            AI Assistant
          </h3>
        </div>
        <BaseButton
          variant="ghost"
          size="sm"
          onClick={onClose}
          darkMode={darkMode}
          icon={<X className="w-4 h-4" />}
          aria-label="Close assistant"
        />
      </div>

      {/* Messages */}
      <div className={`h-96 overflow-y-auto p-4 space-y-4 ${
        darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] rounded-lg px-4 py-2
              ${message.type === 'user'
                ? darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-900'
                : darkMode
                ? 'bg-gray-700 text-gray-200'
                : 'bg-white text-gray-900'
              }
            `}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`
              flex items-center gap-2 max-w-[80%] rounded-lg px-4 py-2
              ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-900'}
            `}>
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <BaseFormInput
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything..."
            darkMode={darkMode}
            className="flex-1"
          />
          <BaseButton
            type="submit"
            disabled={!query.trim() || loading}
            darkMode={darkMode}
            icon={<Send className="w-4 h-4" />}
          >
            Send
          </BaseButton>
        </div>
      </form>
    </div>
  );
}