import { useEffect } from 'react';
import * as monaco from 'monaco-editor';

export function useMonacoCompletion(
  editor: monaco.editor.IStandaloneCodeEditor | null,
  parsedSpec: any
) {
  useEffect(() => {
    if (!editor) return;

    // Register completion provider
    const completionDisposable = monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        // Basic OpenAPI suggestions
        const suggestions: monaco.languages.CompletionItem[] = [
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
          {
            label: 'components',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: [
              'components:',
              '  schemas:',
              '    ${1:SchemaName}:',
              '      type: ${2|object,string,number,integer,boolean,array|}',
              '      properties:',
              '        ${3:propertyName}:',
              '          type: ${4|string,number,integer,boolean,array|}',
              '          description: ${5:Property description}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
        ];

        // Add context-aware suggestions based on parsedSpec
        if (parsedSpec) {
          // Add suggestions for existing schemas
          if (parsedSpec.components?.schemas) {
            Object.keys(parsedSpec.components.schemas).forEach((schemaName) => {
              suggestions.push({
                label: schemaName,
                kind: monaco.languages.CompletionItemKind.Class,
                insertText: schemaName,
                range,
              });
            });
          }

          // Add suggestions for existing paths
          if (parsedSpec.paths) {
            Object.keys(parsedSpec.paths).forEach((path) => {
              suggestions.push({
                label: path,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: path,
                range,
              });
            });
          }
        }

        return { suggestions };
      },
    });

    return () => {
      completionDisposable.dispose();
    };
  }, [editor, parsedSpec]);
} 