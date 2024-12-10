import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  darkMode: boolean;
}

export function CodeEditor({ value, onChange, language, darkMode }: CodeEditorProps) {
  console.log("CodeEditor: ", value);
  console.log("CodeEditor: ", language);
  console.log("CodeEditor: ", darkMode);
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: darkMode ? 'vs-dark' : 'vs-light',
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on'
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

  return <div ref={editorRef} className="h-full" />;
}