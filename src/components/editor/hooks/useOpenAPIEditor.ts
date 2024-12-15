import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { parse, stringify } from 'yaml';
import { OpenAPIV3 } from 'openapi-types';

interface OpenAPISnippet {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
  kind: monaco.languages.CompletionItemKind;
}

interface OpenAPIContext {
  path: string;
  method?: string;
  property?: string;
  parent?: string;
}

export function useOpenAPIEditor(editor: monaco.editor.IStandaloneCodeEditor | null) {
  const validationTimer = useRef<NodeJS.Timeout>();
  const diagnostics = useRef<monaco.editor.IMarkerData[]>([]);

  // OpenAPI Snippets
  const openAPISnippets: OpenAPISnippet[] = [
    {
      label: 'path',
      detail: 'Add a new API path',
      documentation: 'Creates a new API endpoint with methods and responses',
      insertText: [
        '/${1:path}:',
        '  ${2|get,post,put,delete,patch|}:',
        '    summary: ${3:Operation summary}',
        '    description: ${4:Operation description}',
        '    tags:',
        '      - ${5:tag}',
        '    parameters:',
        '      - name: ${6:parameterName}',
        '        in: ${7|path,query,header,cookie|}',
        '        required: ${8|true,false|}',
        '        schema:',
        '          type: ${9|string,integer,number,boolean,array,object|}',
        '    responses:',
        '      \'200\':',
        '        description: ${10:Successful response}',
        '        content:',
        '          application/json:',
        '            schema:',
        '              type: object',
      ].join('\n'),
      kind: monaco.languages.CompletionItemKind.Snippet
    },
    {
      label: 'component',
      detail: 'Add a new component schema',
      documentation: 'Creates a new reusable component schema',
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
      kind: monaco.languages.CompletionItemKind.Snippet
    },
    {
      label: 'security',
      detail: 'Add security scheme',
      documentation: 'Defines API security requirements',
      insertText: [
        'security:',
        '  - ${1:securityScheme}:',
        '      - ${2:scope}',
        'components:',
        '  securitySchemes:',
        '    ${1:securityScheme}:',
        '      type: ${3|oauth2,apiKey,http|}',
        '      description: ${4:Security scheme description}',
      ].join('\n'),
      kind: monaco.languages.CompletionItemKind.Snippet
    },
    {
      label: 'requestBody',
      detail: 'Add request body definition',
      documentation: 'Defines the request body for an operation',
      insertText: [
        'requestBody:',
        '  description: ${1:Request body description}',
        '  required: ${2|true,false|}',
        '  content:',
        '    application/json:',
        '      schema:',
        '        ${3|type: object,\\$ref: "#/components/schemas/|}',
      ].join('\n'),
      kind: monaco.languages.CompletionItemKind.Snippet
    },
    {
      label: 'parameter',
      detail: 'Add parameter definition',
      documentation: 'Defines a parameter for an operation',
      insertText: [
        '- name: ${1:parameterName}',
        '  in: ${2|path,query,header,cookie|}',
        '  description: ${3:Parameter description}',
        '  required: ${4|true,false|}',
        '  schema:',
        '    type: ${5|string,integer,number,boolean,array|}',
      ].join('\n'),
      kind: monaco.languages.CompletionItemKind.Snippet
    },
    {
      label: 'response',
      detail: 'Add response definition',
      documentation: 'Defines a response for an operation',
      insertText: [
        '\'${1|200,201,400,401,403,404,500|}\':', 
        '  description: ${2:Response description}',
        '  content:',
        '    application/json:',
        '      schema:',
        '        ${3|type: object,\\$ref: "#/components/schemas/|}',
      ].join('\n'),
      kind: monaco.languages.CompletionItemKind.Snippet
    }
  ];

  // Get OpenAPI context at position
  const getContext = (model: monaco.editor.ITextModel, position: monaco.Position): OpenAPIContext => {
    const lineContent = model.getLineContent(position.lineNumber);
    const lines = model.getLinesContent();
    let context: OpenAPIContext = { path: '' };

    // Find the current path in the document
    for (let i = position.lineNumber; i >= 1; i--) {
      const line = lines[i - 1];
      if (line.includes('paths:')) {
        break;
      }
      if (line.match(/^\/[^:]+:/)) {
        context.path = line.split(':')[0].trim();
        break;
      }
    }

    // Find the current HTTP method
    if (context.path) {
      const methodMatch = lineContent.match(/\b(get|post|put|delete|patch|options|head)\b/i);
      if (methodMatch) {
        context.method = methodMatch[0].toLowerCase();
      }
    }

    // Find the current property
    const propertyMatch = lineContent.match(/\b(parameters|responses|requestBody|security)\b/);
    if (propertyMatch) {
      context.property = propertyMatch[0];
    }

    // Find the parent context
    if (lineContent.includes('components:')) {
      context.parent = 'components';
    } else if (lineContent.includes('paths:')) {
      context.parent = 'paths';
    }

    return context;
  };

  // Register language features
  useEffect(() => {
    if (!editor) return;

    // Register OpenAPI snippets and completions
    const completionProvider = monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const context = getContext(model, position);
        let suggestions: monaco.languages.CompletionItem[] = [];

        // Add context-specific suggestions
        if (context.method) {
          // Inside an HTTP method
          suggestions = suggestions.concat([
            {
              label: 'parameters',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'parameters:\n  ',
              range,
            },
            {
              label: 'responses',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'responses:\n  ',
              range,
            },
            {
              label: 'requestBody',
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: 'requestBody:\n  ',
              range,
            },
          ]);
        }

        // Add snippets based on context
        suggestions = suggestions.concat(
          openAPISnippets
            .filter(snippet => {
              if (context.property === 'parameters' && snippet.label === 'parameter') return true;
              if (context.property === 'responses' && snippet.label === 'response') return true;
              if (context.property === 'requestBody' && snippet.label === 'requestBody') return true;
              if (!context.property) return true;
              return false;
            })
            .map(snippet => ({
              ...snippet,
              range,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            }))
        );

        return { suggestions };
      },
    });

    // Register hover provider with enhanced documentation
    const hoverProvider = monaco.languages.registerHoverProvider('yaml', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const context = getContext(model, position);
        let contents: monaco.IMarkdownString[] = [];

        // Provide context-specific documentation
        if (context.method && word.word === context.method) {
          contents = [
            { value: `### HTTP ${context.method.toUpperCase()}\n\nDefines a ${context.method.toUpperCase()} operation.` },
            { value: '**Common Properties:**\n- parameters\n- responses\n- requestBody (for POST, PUT, PATCH)' },
            { value: '**Example:**\n```yaml\npost:\n  summary: Create a new resource\n  parameters:\n    - name: id\n      in: path\n```' }
          ];
        } else if (word.word === 'parameters') {
          contents = [
            { value: '### Parameters\n\nDefines operation parameters.' },
            { value: '**Types:**\n- path\n- query\n- header\n- cookie' },
            { value: '**Example:**\n```yaml\nparameters:\n  - name: userId\n    in: path\n    required: true\n```' }
          ];
        } else if (word.word === 'responses') {
          contents = [
            { value: '### Responses\n\nDefines operation responses.' },
            { value: '**Common Status Codes:**\n- 200: OK\n- 201: Created\n- 400: Bad Request\n- 404: Not Found' },
            { value: '**Example:**\n```yaml\nresponses:\n  \'200\':\n    description: Success\n```' }
          ];
        }

        if (contents.length === 0) return null;

        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents
        };
      }
    });

    // Enhanced OpenAPI validation
    const validateOpenAPI = async (content: string) => {
      const markers: monaco.editor.IMarkerData[] = [];

      try {
        const spec = parse(content) as OpenAPIV3.Document;

        // Validate OpenAPI version
        if (!spec.openapi) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: 'Missing OpenAPI version',
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        } else if (!spec.openapi.startsWith('3.')) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: 'Only OpenAPI 3.x is supported',
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        }

        // Validate info section
        if (!spec.info) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            message: 'Missing info section',
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 1,
          });
        } else {
          if (!spec.info.title) {
            const infoLine = content.split('\n').findIndex(line => line.includes('info:'));
            markers.push({
              severity: monaco.MarkerSeverity.Warning,
              message: 'Missing API title',
              startLineNumber: infoLine + 1,
              startColumn: 1,
              endLineNumber: infoLine + 1,
              endColumn: 1,
            });
          }
          if (!spec.info.version) {
            const infoLine = content.split('\n').findIndex(line => line.includes('info:'));
            markers.push({
              severity: monaco.MarkerSeverity.Warning,
              message: 'Missing API version',
              startLineNumber: infoLine + 1,
              startColumn: 1,
              endLineNumber: infoLine + 1,
              endColumn: 1,
            });
          }
        }

        // Validate paths
        if (spec.paths) {
          Object.entries(spec.paths).forEach(([path, pathItem]) => {
            // Find the line number for this path
            const lines = content.split('\n');
            const pathLine = lines.findIndex(line => line.includes(path));

            // Validate path format
            if (!path.startsWith('/')) {
              markers.push({
                severity: monaco.MarkerSeverity.Error,
                message: 'Path must start with /',
                startLineNumber: pathLine + 1,
                startColumn: 1,
                endLineNumber: pathLine + 1,
                endColumn: path.length + 1,
              });
            }

            // Validate path parameters
            const pathParams = (path.match(/\{([^}]+)\}/g) || []).map(p => p.slice(1, -1));
            const declaredParams = new Set<string>();

            // Check operations
            if (pathItem) {
              const operations = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
              operations.forEach(op => {
                const operation = (pathItem as any)[op];
                if (operation) {
                  // Check operation parameters
                  if (operation.parameters) {
                    operation.parameters.forEach((param: OpenAPIV3.ParameterObject) => {
                      if (param.in === 'path') {
                        declaredParams.add(param.name);
                      }
                    });
                  }

                  // Validate responses
                  if (!operation.responses || Object.keys(operation.responses).length === 0) {
                    markers.push({
                      severity: monaco.MarkerSeverity.Warning,
                      message: `Operation ${op} is missing responses`,
                      startLineNumber: pathLine + 1,
                      startColumn: 1,
                      endLineNumber: pathLine + 1,
                      endColumn: 1,
                    });
                  }
                }
              });
            }

            // Check if all path parameters are declared
            pathParams.forEach(param => {
              if (!declaredParams.has(param)) {
                markers.push({
                  severity: monaco.MarkerSeverity.Error,
                  message: `Path parameter {${param}} is not declared in parameters section`,
                  startLineNumber: pathLine + 1,
                  startColumn: 1,
                  endLineNumber: pathLine + 1,
                  endColumn: path.length + 1,
                });
              }
            });
          });
        }

        // Validate components
        if (spec.components) {
          // Validate schemas
          if (spec.components.schemas) {
            Object.entries(spec.components.schemas).forEach(([name, schema]) => {
              const lines = content.split('\n');
              const schemaLine = lines.findIndex(line => line.includes(`${name}:`));

              if (!schema.type && !('$ref' in schema)) {
                markers.push({
                  severity: monaco.MarkerSeverity.Warning,
                  message: `Schema '${name}' is missing type or $ref`,
                  startLineNumber: schemaLine + 1,
                  startColumn: 1,
                  endLineNumber: schemaLine + 1,
                  endColumn: name.length + 1,
                });
              }
            });
          }

          // Validate security schemes
          if (spec.components.securitySchemes) {
            Object.entries(spec.components.securitySchemes).forEach(([name, scheme]) => {
              const lines = content.split('\n');
              const schemeLine = lines.findIndex(line => line.includes(`${name}:`));

              if (!scheme.type) {
                markers.push({
                  severity: monaco.MarkerSeverity.Error,
                  message: `Security scheme '${name}' is missing type`,
                  startLineNumber: schemeLine + 1,
                  startColumn: 1,
                  endLineNumber: schemeLine + 1,
                  endColumn: name.length + 1,
                });
              }
            });
          }
        }

        monaco.editor.setModelMarkers(editor.getModel()!, 'openapi', markers);
        diagnostics.current = markers;

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
        monaco.editor.setModelMarkers(editor.getModel()!, 'openapi', markers);
        diagnostics.current = markers;
      }
    };

    // Add content change listener with debounce
    const changeDisposable = editor.onDidChangeModelContent(() => {
      if (validationTimer.current) {
        clearTimeout(validationTimer.current);
      }
      validationTimer.current = setTimeout(() => {
        validateOpenAPI(editor.getValue());
      }, 500);
    });

    // Initial validation
    validateOpenAPI(editor.getValue());

    // Cleanup
    return () => {
      completionProvider.dispose();
      hoverProvider.dispose();
      changeDisposable.dispose();
      if (validationTimer.current) {
        clearTimeout(validationTimer.current);
      }
      monaco.editor.setModelMarkers(editor.getModel()!, 'openapi', []);
    };
  }, [editor]);

  return {
    diagnostics: diagnostics.current
  };
} 