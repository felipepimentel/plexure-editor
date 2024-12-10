import React, { useState } from 'react';
import { Sparkles, Plus, MessageSquare } from 'lucide-react';

interface AiAssistantProps {
  darkMode: boolean;
  onSuggestion: (suggestion: string) => void;
}

export function AiAssistant({ darkMode, onSuggestion }: AiAssistantProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    {
      title: 'Add Authentication',
      description: 'Add OAuth2 or API Key authentication to your API',
      template: `securitySchemes:
  oauth2:
    type: oauth2
    flows:
      implicit:
        authorizationUrl: https://example.com/oauth/authorize
        scopes:
          read: Read access
          write: Write access`
    },
    {
      title: 'Add Error Responses',
      description: 'Add common error response definitions',
      template: `responses:
  Error400:
    description: Bad Request
    content:
      application/json:
        schema:
          type: object
          properties:
            code:
              type: integer
              example: 400
            message:
              type: string
              example: Bad Request`
    },
    {
      title: 'Add Pagination',
      description: 'Add pagination parameters to GET endpoints',
      template: `parameters:
  - name: page
    in: query
    description: Page number
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: limit
    in: query
    description: Items per page
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 10`
    }
  ];

  return (
    <div className={`fixed bottom-4 right-4 z-50`}>
      <button
        onClick={() => setShowSuggestions(!showSuggestions)}
        className={`p-3 rounded-full shadow-lg ${
          darkMode 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {showSuggestions && (
        <div className={`absolute bottom-16 right-0 w-80 rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              AI Suggestions
            </h3>
          </div>
          <div className="p-2 space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  onSuggestion(suggestion.template);
                  setShowSuggestions(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Plus className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {suggestion.title}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {suggestion.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}