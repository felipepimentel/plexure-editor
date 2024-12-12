import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  darkMode: boolean;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, darkMode, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className={`
            p-1.5 rounded-lg transition-colors
            ${darkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
              : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'}
          `}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          background: darkMode ? '#1F2937' : '#F3F4F6',
        }}
        codeTagProps={{
          style: {
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
} 