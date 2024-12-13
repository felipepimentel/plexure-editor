import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useMonacoYamlValidation } from './hooks/useMonacoYamlValidation';
import { useMonacoCompletion } from './hooks/useMonacoCompletion';
import { useMonacoSnippets } from './hooks/useMonacoSnippets';
import { EditorPreferences } from '@/types/preferences';

interface EditorLayoutProps {
  content: string;
  onChange: (value: string) => void;
  preferences: EditorPreferences;
}

export function EditorLayout({ content, onChange, preferences }: EditorLayoutProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [parsedSpec, setParsedSpec] = useState<any>(null);

  // Initialize editor
  useEffect(() => {
    if (editorRef.current) {
      const ed = monaco.editor.create(editorRef.current, {
        value: content,
        language: 'yaml',
        theme: preferences.theme,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: preferences.fontSize,
        tabSize: preferences.tabSize,
        wordWrap: preferences.wordWrap ? 'on' : 'off',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        folding: true,
        foldingStrategy: 'indentation',
        bracketPairColorization: {
          enabled: true,
        },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        overviewRulerLanes: 0,
        lineDecorationsWidth: 8,
        lineNumbersMinChars: 4,
        renderLineHighlight: 'all',
        renderLineHighlightOnlyWhenFocus: true,
        hideCursorInOverviewRuler: true,
        occurrencesHighlight: true,
        selectionHighlight: true,
        roundedSelection: true,
        selectOnLineNumbers: true,
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true,
        },
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        snippetSuggestions: 'inline',
        suggest: {
          localityBonus: true,
          snippetsPreventQuickSuggestions: false,
          showIcons: true,
          maxVisibleSuggestions: 12,
          showMethods: true,
          showFunctions: true,
          showConstructors: true,
          showFields: true,
          showVariables: true,
          showClasses: true,
          showStructs: true,
          showInterfaces: true,
          showModules: true,
          showProperties: true,
          showEvents: true,
          showOperators: true,
          showUnits: true,
          showValues: true,
          showConstants: true,
          showEnums: true,
          showEnumMembers: true,
          showKeywords: true,
          showWords: true,
          showColors: true,
          showFiles: true,
          showReferences: true,
          showFolders: true,
          showTypeParameters: true,
          showSnippets: true,
        },
      });

      setEditor(ed);

      return () => {
        ed.dispose();
      };
    }
  }, []);

  // Sync content
  useEffect(() => {
    if (editor) {
      const value = editor.getValue();
      if (value !== content) {
        editor.setValue(content);
      }
    }
  }, [content, editor]);

  // Update preferences
  useEffect(() => {
    if (editor) {
      editor.updateOptions({
        theme: preferences.theme,
        fontSize: preferences.fontSize,
        tabSize: preferences.tabSize,
        wordWrap: preferences.wordWrap ? 'on' : 'off',
      });
    }
  }, [preferences, editor]);

  // Handle editor changes
  useEffect(() => {
    if (editor) {
      const disposable = editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });

      return () => {
        disposable.dispose();
      };
    }
  }, [editor, onChange]);

  // Handle layout changes
  useEffect(() => {
    if (editor) {
      const handleResize = () => {
        editor.layout();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [editor]);

  // Monaco hooks
  useMonacoYamlValidation(editor);
  useMonacoCompletion(editor, parsedSpec);
  useMonacoSnippets(editor);

  return (
    <div className="h-full w-full relative">
      <div ref={editorRef} className="absolute inset-0" />
    </div>
  );
} 