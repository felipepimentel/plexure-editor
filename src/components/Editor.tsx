import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useCallback, useEffect, useRef } from 'react';
import { ValidationResult } from '../types/styleGuide';
import { EditorToolbar } from './EditorToolbar';

interface EditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  darkMode: boolean;
  onShowShortcuts: () => void;
  validationResults: ValidationResult[];
  language?: string;
}

export function Editor({ 
  value, 
  onChange, 
  darkMode, 
  onShowShortcuts, 
  validationResults,
  language = 'yaml' 
}: EditorProps) {
  const isEditorReady = useRef(false);

  // Reset editor readiness on component unmount
  useEffect(() => {
    return () => {
      isEditorReady.current = false;
    };
  }, []);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    isEditorReady.current = true;
  }, []);

  const handleSearch = useCallback(() => {
    if (!isEditorReady.current) return;
    console.log('Search functionality to be implemented');
  }, []);

  const handleCopy = useCallback(() => {
    if (!isEditorReady.current) return;
    const contentToCopy = value ?? '';
    navigator.clipboard.writeText(contentToCopy).catch((err) => {
      console.error('Failed to copy text:', err);
    });
  }, [value]);

  const handleClear = useCallback(() => {
    if (!isEditorReady.current) return;
    onChange('');
  }, [onChange]);

  const handleFormat = useCallback(() => {
    if (!isEditorReady.current) return;
    console.log('Format functionality to be implemented');
  }, []);

  const validatedValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar
        onShowShortcuts={onShowShortcuts}
        isValid={validationResults.length === 0}
        errorCount={validationResults.filter(r => r.rule.severity === 'error').length}
        warningCount={validationResults.filter(r => r.rule.severity === 'warning').length}
        darkMode={darkMode}
        onSearch={handleSearch}
        onCopy={handleCopy}
        onClear={handleClear}
        onFormat={handleFormat}
        onConvertFormat={() => console.log('Convert format functionality to be implemented')}
      />
      <div className="flex-1 overflow-hidden rounded-b-lg border-0">
        <MonacoEditor
          height="100%"
          defaultLanguage={language}
          defaultValue={validatedValue}
          theme={darkMode ? 'vs-dark' : 'vs-light'}
          onChange={(newValue) => onChange(newValue ?? '')}
          onMount={handleEditorDidMount}
          loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
