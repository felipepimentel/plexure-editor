import { useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { parse } from 'yaml';

export function useOpenAPIEditor(editor: monaco.editor.IStandaloneCodeEditor | null) {
  useEffect(() => {
    if (!editor) return;

    // Register OpenAPI snippets
    const snippetProvider = monaco.languages.registerCompletionItemProvider('yaml', {
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
            detail: 'OpenAPI version declaration',
            documentation: 'Specifies the OpenAPI Specification version being used.',
          },
          {
            label: 'info',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: [
              'info:',
              '  title: ${1:API Title}',
              '  version: ${2:1.0.0}',
              '  description: ${3:API Description}',
              '  contact:',
              '    name: ${4:Contact Name}',
              '    email: ${5:contact@example.com}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            detail: 'API information',
            documentation: 'General information about the API.',
          },
          {
            label: 'paths',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: [
              'paths:',
              '  /${1:path}:',
              '    ${2|get,post,put,delete,patch|}:',
              '      tags:',
              '        - ${3:tag}',
              '      summary: ${4:Operation summary}',
              '      description: ${5:Operation description}',
              '      operationId: ${6:operationId}',
              '      parameters:',
              '        - name: ${7:parameterName}',
              '          in: ${8|path,query,header,cookie|}',
              '          required: ${9|true,false|}',
              '          schema:',
              '            type: ${10|string,integer,number,boolean,array,object|}',
              '      responses:',
              '        \'200\':',
              '          description: ${11:Successful response}',
              '          content:',
              '            application/json:',
              '              schema:',
              '                type: object',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            detail: 'API paths',
            documentation: 'The available paths and operations for the API.',
          },
          {
            label: 'components',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: [
              'components:',
              '  schemas:',
              '    ${1:SchemaName}:',
              '      type: object',
              '      properties:',
              '        ${2:propertyName}:',
              '          type: ${3|string,integer,number,boolean,array,object|}',
              '          description: ${4:Property description}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            detail: 'Reusable components',
            documentation: 'Reusable OpenAPI components including schemas, responses, parameters, etc.',
          },
          {
            label: 'security',
            kind: monaco.languages.CompletionItemKind.Struct,
            insertText: [
              'security:',
              '  - ${1:securityScheme}:',
              '      - ${2:scope}',
            ].join('\n'),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range,
            detail: 'Security requirements',
            documentation: 'Security requirements for the API.',
          },
        ];

        return { suggestions };
      },
    });

    // Register OpenAPI validation
    const validateOpenAPI = () => {
      const model = editor.getModel();
      if (!model) return;

      const content = model.getValue();
      const markers: monaco.editor.IMarkerData[] = [];

      try {
        const spec = parse(content);

        // Basic validation rules
        if (!spec.openapi) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: 'Missing OpenAPI version',
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        }

        if (!spec.info?.title) {
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            message: 'Missing API title in info section',
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        }

        if (!spec.paths) {
          markers.push({
            severity: monaco.MarkerSeverity.Info,
            message: 'No paths defined in the specification',
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        }

        // Validate paths
        if (spec.paths) {
          Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
            if (!path.startsWith('/')) {
              // Find the line number for this path
              const pathLine = content.split('\n').findIndex(line => line.includes(path));
              markers.push({
                severity: monaco.MarkerSeverity.Error,
                message: 'Path must start with /',
                startLineNumber: pathLine + 1,
                startColumn: 1,
                endLineNumber: pathLine + 1,
                endColumn: path.length + 1,
              });
            }
          });
        }

      } catch (error) {
        // YAML parsing error
        markers.push({
          severity: monaco.MarkerSeverity.Error,
          message: error instanceof Error ? error.message : 'Invalid YAML',
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1,
        });
      }

      monaco.editor.setModelMarkers(model, 'openapi', markers);
    };

    const model = editor.getModel();
    if (model) {
      const changeDisposable = model.onDidChangeContent(() => {
        validateOpenAPI();
      });

      // Initial validation
      validateOpenAPI();

      return () => {
        snippetProvider.dispose();
        changeDisposable.dispose();
        monaco.editor.setModelMarkers(model, 'openapi', []);
      };
    }
  }, [editor]);
} 