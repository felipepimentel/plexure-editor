import { editor, languages, Position } from 'monaco-editor';
import { useEffect } from 'react';

const OPENAPI_KEYWORDS = [
  'openapi',
  'info',
  'paths',
  'components',
  'schemas',
  'parameters',
  'responses',
  'securitySchemes',
  'tags',
  'servers',
  'security',
  'externalDocs'
];

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

const COMMON_PROPERTIES = [
  'type',
  'format',
  'description',
  'required',
  'enum',
  'example',
  'default',
  'minimum',
  'maximum',
  'pattern',
  'minLength',
  'maxLength'
];

export function useMonacoCompletion(monacoEditor: editor.IStandaloneCodeEditor | null) {
  useEffect(() => {
    if (!monacoEditor) return;

    const disposables: languages.CompletionItemProvider[] = [];

    const provider: languages.CompletionItemProvider = {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const line = model.getLineContent(position.lineNumber);
        const indentation = line.match(/^\s*/)?.[0].length || 0;

        const suggestions: languages.CompletionItem[] = [];

        // Root level completions
        if (indentation === 0) {
          suggestions.push(...OPENAPI_KEYWORDS.map(keyword => ({
            label: keyword,
            kind: languages.CompletionItemKind.Keyword,
            insertText: `${keyword}:`,
            range
          })));
        }

        // Path level completions
        if (line.includes('paths:') || indentation === 2) {
          suggestions.push(...HTTP_METHODS.map(method => ({
            label: method,
            kind: languages.CompletionItemKind.Method,
            insertText: `${method}:\n      summary: \n      description: \n      responses:\n        '200':\n          description: Success`,
            range
          })));
        }

        // Schema property completions
        if (line.includes('properties:') || indentation >= 4) {
          suggestions.push(...COMMON_PROPERTIES.map(prop => ({
            label: prop,
            kind: languages.CompletionItemKind.Property,
            insertText: `${prop}: `,
            range
          })));
        }

        return { suggestions };
      }
    };

    disposables.push(languages.registerCompletionItemProvider('yaml', provider));

    return () => {
      disposables.forEach(d => d.dispose());
    };
  }, [monacoEditor]);
}