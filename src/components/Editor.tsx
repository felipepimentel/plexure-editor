import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { useMonacoCompletion } from '../hooks/useMonacoCompletion';
import { useMonacoSnippets } from '../hooks/useMonacoSnippets';
import { useMonacoYamlValidation } from '../hooks/useMonacoYamlValidation';
import { ValidationResult } from '../types/styleGuide';
import { EditorToolbar } from './EditorToolbar';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  onShowShortcuts: () => void;
  validationResults: ValidationResult[];
}

export function Editor({ value, onChange, darkMode, onShowShortcuts, validationResults }: EditorProps) {
  console.log("CodeEditor: ", value);
  console.log("CodeEditor: ", language);
  console.log("CodeEditor: ", darkMode);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useMonacoYamlValidation(monacoEditorRef.current);
  useMonacoCompletion(monacoEditorRef.current);
  useMonacoSnippets(monacoEditorRef.current);

  useEffect(() => {
    if (editorRef.current) {
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language: 'yaml',
        theme: darkMode ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line',
        wordWrap: 'on',
        renderWhitespace: 'selection',
        rulers: [80],
        bracketPairColorization: { enabled: true },
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
        autoIndent: 'full',
        snippetSuggestions: 'inline',
        quickSuggestions: { other: true, comments: true, strings: true },
        suggest: {
          showWords: false,
          showSnippets: true,
          showProperties: true
        }
      });

      monacoEditorRef.current.onDidChangeModelContent(() => {
        onChange(monacoEditorRef.current?.getValue() || '');
      });
    }

    return () => {
      monacoEditorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.updateOptions({
        theme: darkMode ? 'vs-dark' : 'vs-light'
      });
    }
  }, [darkMode]);

  useEffect(() => {
    if (monacoEditorRef.current && value !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!monacoEditorRef.current) return;

    const model = monacoEditorRef.current.getModel();
    if (!model) return;

    const markers = validationResults.map(result => {
      const position = model.getPositionAt(0);
      return {
        severity: result.rule.severity === 'error' 
          ? monaco.MarkerSeverity.Error 
          : result.rule.severity === 'warning'
          ? monaco.MarkerSeverity.Warning
          : monaco.MarkerSeverity.Info,
        message: `${result.rule.name}: ${result.message}`,
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column + 1,
        source: 'Style Guide'
      };
    });

    monaco.editor.setModelMarkers(model, 'style-guide', markers);
  }, [validationResults]);

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar
        onShowShortcuts={onShowShortcuts}
        isValid={validationResults.length === 0}
        errorCount={validationResults.filter(r => r.rule.severity === 'error').length}
        warningCount={validationResults.filter(r => r.rule.severity === 'warning').length}
        darkMode={darkMode}
      />
      <div ref={editorRef} className="flex-1" />
    </div>
  );
}