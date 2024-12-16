import React from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '@/lib/utils';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  language?: string;
  className?: string;
  theme?: 'vs-dark' | 'vs-light';
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  roundedSelection: false,
  scrollBeyondLastLine: false,
  readOnly: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  wrappingStrategy: 'advanced',
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10
  },
  renderWhitespace: 'selection',
  guides: {
    indentation: true,
    bracketPairs: true
  },
  bracketPairColorization: {
    enabled: true
  },
  folding: true,
  foldingStrategy: 'indentation',
  showFoldingControls: 'always',
  suggestOnTriggerCharacters: true,
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  padding: {
    top: 8,
    bottom: 8
  }
};

export const MonacoEditor = React.memo(({
  value,
  onChange,
  onMount,
  language = 'yaml',
  className,
  theme = 'vs-dark',
  options = {}
}: MonacoEditorProps) => {
  const handleEditorDidMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    if (onMount) {
      onMount(editor);
    }
  }, [onMount]);

  return (
    <Editor
      value={value}
      onChange={(value) => onChange?.(value || '')}
      onMount={handleEditorDidMount}
      language={language}
      theme={theme}
      options={{
        ...defaultOptions,
        ...options
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
});
