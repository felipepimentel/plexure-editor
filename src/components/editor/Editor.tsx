import React from 'react';
import { cn } from '@/lib/utils';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { Code, AlertTriangle } from 'lucide-react';
import { EditorLayout } from './EditorLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { useEditorState } from '@/hooks/useEditorState';

interface EditorProps {
  className?: string;
  onSpecChange?: (spec: any) => void;
}

const DEFAULT_SPEC = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API specification
servers:
  - url: https://api.example.com/v1
    description: Production server
paths: {}
components:
  schemas: {}`;

export const Editor = ({ className, onSpecChange }: EditorProps) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { spec, parsedSpec, parseError, updateSpec } = useEditorState(DEFAULT_SPEC);

  // Call onSpecChange when parsedSpec changes
  React.useEffect(() => {
    onSpecChange?.(parsedSpec);
  }, [parsedSpec, onSpecChange]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <PanelHeader
        title="Editor"
        icon={Code}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      <div className={cn(
        'flex-1 transition-all duration-300 relative',
        !isExpanded && 'h-0 overflow-hidden'
      )}>
        <EditorLayout
          content={spec}
          onChange={updateSpec}
          preferences={{
            theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
            fontSize: 14,
            tabSize: 2,
            wordWrap: true,
          }}
        />

        {parseError && (
          <div className="absolute bottom-4 right-4 max-w-md bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">YAML Parse Error</span>
            </div>
            <p className="text-sm opacity-90">{parseError}</p>
          </div>
        )}
      </div>
    </div>
  );
};
