import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { ValidationResult } from '../types/project';
import '../monaco-config'; // Importar a configuração do Monaco

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  validationResults: any[];
  onShowShortcuts: () => void;
  onCursorPositionChange?: (position: { line: number; column: number }) => void;
}

export function Editor({
  value,
  onChange,
  darkMode,
  validationResults,
  onShowShortcuts,
  onCursorPositionChange
}: EditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Monaco Editor
    editorRef.current = monaco.editor.create(containerRef.current, {
      value,
      language: 'yaml',
      theme: darkMode ? 'vs-dark' : 'vs',
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      renderWhitespace: 'selection',
      tabSize: 2,
      wordWrap: 'on'
    });

    // Add change listener
    editorRef.current.onDidChangeModelContent(() => {
      const newValue = editorRef.current?.getValue();
      if (newValue !== undefined) {
        onChange(newValue);
      }
    });

    // Add keyboard shortcut for help
    editorRef.current.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH,
      () => {
        onShowShortcuts?.();
      }
    );

    editorRef.current.onDidChangeCursorPosition((e: any) => {
      onCursorPositionChange?.({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    return () => {
      editorRef.current?.dispose();
    };
  }, []);

  // Update theme when darkMode changes
  useEffect(() => {
    monaco.editor.setTheme(darkMode ? 'vs-dark' : 'vs');
  }, [darkMode]);

  // Update validation markers
  useEffect(() => {
    if (!editorRef.current) return;

    const markers = validationResults.map(result => ({
      severity: result.rule.severity === 'error'
        ? monaco.MarkerSeverity.Error
        : monaco.MarkerSeverity.Warning,
      message: result.message || 'Validation error',
      startLineNumber: result.line || 1,
      startColumn: result.column || 1,
      endLineNumber: result.line || 1,
      endColumn: (result.column || 1) + 1,
      source: result.rule.name
    }));

    monaco.editor.setModelMarkers(
      editorRef.current.getModel()!,
      'swagger-validation',
      markers
    );
  }, [validationResults]);

  return (
    <div className="h-full w-full relative">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
      />
      {/* Keyboard shortcuts hint */}
      <div className={`absolute bottom-4 right-4 text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Press <kbd className="px-2 py-1 rounded bg-opacity-10 bg-current">⌘H</kbd> for keyboard shortcuts
      </div>
    </div>
  );
}
