import React, { useState, useCallback, type ReactNode } from 'react';
import { Copy, Check, ExternalLink, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'react-hot-toast';

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface Response {
  code: string;
  description: string;
  example?: string;
}

interface PreviewProps {
  className?: string;
  title: string;
  description?: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path?: string;
  parameters?: Parameter[];
  responses?: Response[];
}

interface CodeBlockProps {
  code: string;
  language?: string;
  onCopy: (code: string) => Promise<void>;
  copiedCode: string | null;
}

function CodeBlock({ code, language = 'json', onCopy, copiedCode }: CodeBlockProps): JSX.Element {
  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          onClick={() => onCopy(code)}
        >
          {copiedCode === code ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <pre className="p-4 rounded-lg bg-gray-900/50 border border-white/5 overflow-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

function MethodBadge({ method }: { method: string }): JSX.Element {
  return (
    <span className={`method-badge method-badge-${method.toLowerCase()}`}>
      {method.toUpperCase()}
    </span>
  );
}

export function Preview({
  className = '',
  title,
  description,
  method,
  path,
  parameters,
  responses,
}: PreviewProps): JSX.Element {
  const { darkMode } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCopyCode = useCallback(async (code: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
      console.error('Copy failed:', error);
    }
  }, []);

  const toggleSection = useCallback((section: string): void => {
    setExpandedSection(prev => prev === section ? null : section);
  }, []);

  return (
    <div className={`preview-panel ${className}`}>
      <div className="h-full flex flex-col">
        <div className="flex-none px-4 py-3 border-b border-white/[0.05]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`px-2 py-1 text-xs font-medium rounded ${
                method === 'get' ? 'bg-emerald-400/10 text-emerald-400' :
                method === 'post' ? 'bg-blue-400/10 text-blue-400' :
                method === 'put' ? 'bg-amber-400/10 text-amber-400' :
                method === 'delete' ? 'bg-red-400/10 text-red-400' :
                method === 'patch' ? 'bg-purple-400/10 text-purple-400' :
                'bg-gray-400/10 text-gray-400'
              }`}>
                {method.toUpperCase()}
              </div>
              <div className="text-sm font-mono text-gray-300">{path}</div>
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-medium text-gray-200">{title}</h3>
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 space-y-6">
            {/* Parameters Section */}
            {parameters && parameters.length > 0 && (
              <section>
                <h4 className="text-xs font-medium uppercase text-gray-400 mb-3">Parameters</h4>
                <div className="space-y-2">
                  {parameters.map((param, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-md bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-200">{param.name}</span>
                            {param.required && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-red-400/10 text-red-400">
                                Required
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">{param.description}</div>
                        </div>
                        <div className="text-xs font-mono text-gray-500">{param.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Responses Section */}
            {responses && responses.length > 0 && (
              <section>
                <h4 className="text-xs font-medium uppercase text-gray-400 mb-3">Responses</h4>
                <div className="space-y-2">
                  {responses.map((response, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-md bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          response.code.startsWith('2') ? 'bg-emerald-400/10 text-emerald-400' :
                          response.code.startsWith('4') ? 'bg-amber-400/10 text-amber-400' :
                          response.code.startsWith('5') ? 'bg-red-400/10 text-red-400' :
                          'bg-gray-400/10 text-gray-400'
                        }`}>
                          {response.code}
                        </span>
                        <span className="text-sm text-gray-300">{response.description}</span>
                      </div>
                      {response.example && (
                        <pre className="mt-2 p-3 text-xs font-mono rounded bg-gray-900/50 border border-white/[0.05] overflow-x-auto">
                          {response.example}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 