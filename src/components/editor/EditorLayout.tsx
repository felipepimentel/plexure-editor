import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { EditorPreferences } from '@/types/preferences';

interface EditorLayoutProps {
  content: string;
  onChange: (value: string) => void;
  preferences: EditorPreferences;
}

export function EditorLayout({ content, onChange, preferences }: EditorLayoutProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;

    // Set up editor options
    editor.updateOptions({
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
  };

  // YAML Validation
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    // Set up YAML validation
    const validateYaml = () => {
      const content = model.getValue();
      const markers: monaco.editor.IMarkerData[] = [];

      try {
        // Basic YAML syntax validation
        if (content.includes('\\t')) {
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            message: 'Tabs are not recommended in YAML. Use spaces instead.',
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        }
      } catch (error) {
        console.error('YAML validation error:', error);
      }

      monaco.editor.setModelMarkers(model, 'yaml', markers);
    };

    // Initial validation
    validateYaml();

    // Set up change listener
    const disposable = model.onDidChangeContent(() => {
      validateYaml();
    });

    return () => {
      disposable.dispose();
      monaco.editor.setModelMarkers(model, 'yaml', []);
    };
  }, [editorRef.current]);

  // Completion Provider
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const disposable = monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          {
            label: 'openapi',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'openapi: 3.0.0',
            range,
          },
          {
            label: 'info',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: [
              'info:',
              '  title: ${1:API Title}',
              '  version: ${2:1.0.0}',
              '  description: ${3:API Description}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: 'paths',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: [
              'paths:',
              '  /${1:path}:',
              '    ${2|get,post,put,delete,patch|}:',
              '      summary: ${3:Operation summary}',
              '      description: ${4:Operation description}',
              '      responses:',
              '        \'200\':',
              '          description: ${5:Successful response}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
        ];

        return { suggestions };
      },
    });

    return () => {
      disposable.dispose();
    };
  }, [editorRef.current]);

  return (
    <div className="h-full w-full relative">
      <Editor
        height="100%"
        defaultLanguage="yaml"
        defaultValue={content}
        theme={preferences.theme}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          automaticLayout: true,
        }}
      />
    </div>
  );
} 