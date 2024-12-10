import { editor, languages } from 'monaco-editor';
import { useEffect } from 'react';

const SNIPPETS = {
  'api-endpoint': {
    label: 'API Endpoint',
    description: 'Create a new API endpoint with common methods',
    insertText: [
      '/${1:resource}:',
      '  get:',
      '    summary: List ${1:resource}s',
      '    description: Retrieve a list of ${1:resource}s',
      '    parameters:',
      '      - name: limit',
      '        in: query',
      '        description: Maximum number of items to return',
      '        schema:',
      '          type: integer',
      '          default: 10',
      '    responses:',
      '      \'200\':',
      '        description: Successful response',
      '        content:',
      '          application/json:',
      '            schema:',
      '              type: array',
      '              items:',
      '                $ref: \'#/components/schemas/${2:ResourceName}\'',
      '  post:',
      '    summary: Create ${1:resource}',
      '    description: Create a new ${1:resource}',
      '    requestBody:',
      '      required: true',
      '      content:',
      '        application/json:',
      '          schema:',
      '            $ref: \'#/components/schemas/${2:ResourceName}\'',
      '    responses:',
      '      \'201\':',
      '        description: Created successfully'
    ].join('\n')
  },
  'schema-definition': {
    label: 'Schema Definition',
    description: 'Create a new schema definition',
    insertText: [
      '${1:SchemaName}:',
      '  type: object',
      '  required:',
      '    - id',
      '    - name',
      '  properties:',
      '    id:',
      '      type: string',
      '      format: uuid',
      '      description: Unique identifier',
      '    name:',
      '      type: string',
      '      minLength: 1',
      '      maxLength: 100',
      '      description: ${2:Resource} name',
      '    createdAt:',
      '      type: string',
      '      format: date-time',
      '      description: Creation timestamp'
    ].join('\n')
  }
};

export function useMonacoSnippets(monacoEditor: editor.IStandaloneCodeEditor | null) {
  useEffect(() => {
    if (!monacoEditor) return;

    const disposables: languages.CompletionItemProvider[] = [];

    const provider: languages.CompletionItemProvider = {
      provideCompletionItems: (model, position) => {
        const suggestions = Object.entries(SNIPPETS).map(([key, snippet]) => ({
          label: snippet.label,
          kind: languages.CompletionItemKind.Snippet,
          documentation: snippet.description,
          insertText: snippet.insertText,
          insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          }
        }));

        return { suggestions };
      }
    };

    disposables.push(languages.registerCompletionItemProvider('yaml', provider));

    return () => {
      disposables.forEach(d => d.dispose());
    };
  }, [monacoEditor]);
}