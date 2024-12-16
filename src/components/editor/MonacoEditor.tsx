import React from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '@/lib/utils';

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  className?: string;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'yaml',
  className
}) => {
  return (
    <Editor
      value={value}
      onChange={(value) => onChange?.(value || '')}
      language={language}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10
        }
      }}
      className={cn('h-full w-full', className)}
      loading={
        <div className="h-full w-full bg-background p-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      }
    />
  );
};
