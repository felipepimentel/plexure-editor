import { useEffect } from 'react';
import * as monaco from 'monaco-editor';

export function useMonacoSnippets(editor: monaco.editor.IStandaloneCodeEditor | null) {
  useEffect(() => {
    if (!editor) return;

    // Register snippets provider
    const snippetsDisposable = monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const snippets: monaco.languages.CompletionItem[] = [
          {
            label: 'get-endpoint',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'GET endpoint template with parameters and responses',
            insertText: [
              'get:',
              '  tags:',
              '    - ${1:tag}',
              '  summary: ${2:Get resource}',
              '  description: ${3:Detailed description}',
              '  parameters:',
              '    - name: ${4:parameterName}',
              '      in: ${5|query,path,header|}',
              '      description: ${6:Parameter description}',
              '      required: ${7|true,false|}',
              '      schema:',
              '        type: ${8|string,integer,number,boolean|}',
              '  responses:',
              '    \'200\':',
              '      description: ${9:Successful response}',
              '      content:',
              '        application/json:',
              '          schema:',
              '            \\$ref: \'#/components/schemas/${10:ResponseSchema}\'',
              '    \'400\':',
              '      description: Bad request',
              '    \'401\':',
              '      description: Unauthorized',
              '    \'404\':',
              '      description: Resource not found',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: 'post-endpoint',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'POST endpoint template with request body and responses',
            insertText: [
              'post:',
              '  tags:',
              '    - ${1:tag}',
              '  summary: ${2:Create resource}',
              '  description: ${3:Detailed description}',
              '  requestBody:',
              '    required: true',
              '    content:',
              '      application/json:',
              '        schema:',
              '          \\$ref: \'#/components/schemas/${4:RequestSchema}\'',
              '  responses:',
              '    \'201\':',
              '      description: ${5:Resource created}',
              '      content:',
              '        application/json:',
              '          schema:',
              '            \\$ref: \'#/components/schemas/${6:ResponseSchema}\'',
              '    \'400\':',
              '      description: Bad request',
              '    \'401\':',
              '      description: Unauthorized',
              '    \'409\':',
              '      description: Resource already exists',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: 'schema',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Schema template with common fields',
            insertText: [
              '${1:SchemaName}:',
              '  type: object',
              '  required:',
              '    - ${2:requiredField}',
              '  properties:',
              '    ${2:requiredField}:',
              '      type: ${3|string,integer,number,boolean|}',
              '      description: ${4:Field description}',
              '    ${5:optionalField}:',
              '      type: ${6|string,integer,number,boolean,array|}',
              '      description: ${7:Field description}',
              '      ${8|format: date-time,format: uuid,format: email,pattern: ^[A-Za-z0-9]+$|}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
          {
            label: 'security',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Security scheme template',
            insertText: [
              'security:',
              '  - ${1:securityScheme}: []',
              '',
              'components:',
              '  securitySchemes:',
              '    ${1:securityScheme}:',
              '      type: ${2|http,apiKey,oauth2,openIdConnect|}',
              '      ${3|scheme: bearer,in: header,flows: {}|}',
              '      ${4|bearerFormat: JWT,name: X-API-Key,openIdConnectUrl: https://example.com/.well-known/openid-configuration|}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
          },
        ];

        return { suggestions: snippets };
      },
    });

    return () => {
      snippetsDisposable.dispose();
    };
  }, [editor]);
} 