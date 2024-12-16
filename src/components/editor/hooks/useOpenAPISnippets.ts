import { useEffect } from 'react';
import type * as monaco from 'monaco-editor';

const snippets = {
  endpoint: {
    label: 'New Endpoint',
    description: 'Add a new endpoint with request/response',
    insertText: `  /{path}:
    get:
      summary: ''
      description: ''
      parameters:
        - name: ''
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  name:
                    type: string`
  },
  schema: {
    label: 'New Schema',
    description: 'Add a new schema definition',
    insertText: `  ${name}:
    type: object
    required:
      - id
    properties:
      id:
        type: string
        format: uuid
      createdAt:
        type: string
        format: date-time
      updatedAt:
        type: string
        format: date-time`
  },
  parameter: {
    label: 'New Parameter',
    description: 'Add a new parameter',
    insertText: `      - name: ''
        in: query
        description: ''
        required: false
        schema:
          type: string`
  },
  response: {
    label: 'New Response',
    description: 'Add a new response',
    insertText: `        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string`
  },
  security: {
    label: 'New Security',
    description: 'Add security requirements',
    insertText: `      security:
        - bearerAuth: []
        - apiKey: []`
  }
};

export function useOpenAPISnippets(editor: monaco.editor.IStandaloneCodeEditor | null) {
  useEffect(() => {
    if (!editor) return;

    // Register completion provider
    const disposable = monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        // Convert snippets to completion items
        const suggestions = Object.entries(snippets).map(([key, snippet]) => ({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: snippet.description,
          insertText: snippet.insertText,
          range,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }));

        return { suggestions };
      }
    });

    // Add commands for each snippet
    Object.entries(snippets).forEach(([key, snippet]) => {
      editor.addAction({
        id: `insert-${key}`,
        label: `Insert ${snippet.label}`,
        keybindings: [], // Optional: Add keyboard shortcuts
        run: (ed) => {
          const position = ed.getPosition();
          if (position) {
            ed.executeEdits('snippet', [{
              range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
              ),
              text: snippet.insertText
            }]);
          }
        }
      });
    });

    return () => disposable.dispose();
  }, [editor]);
} 