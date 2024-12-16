import { useEffect, useState } from 'react';
import { parse } from 'yaml';
import type * as monaco from 'monaco-editor';

interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    message: string;
    line: number;
    column: number;
    severity: 'error' | 'warning';
  }>;
}

export function useOpenAPIValidation(
  content: string,
  editor: monaco.editor.IStandaloneCodeEditor | null
) {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: []
  });

  useEffect(() => {
    const validateContent = async () => {
      try {
        // Parse YAML
        const parsed = parse(content);
        const errors: ValidationResult['errors'] = [];

        // Basic structure validation
        if (!parsed.openapi) {
          errors.push({
            message: 'Missing OpenAPI version',
            line: 1,
            column: 1,
            severity: 'error'
          });
        } else if (!/^3\.0\.\d+$/.test(parsed.openapi)) {
          errors.push({
            message: 'Invalid OpenAPI version (must be 3.0.x)',
            line: 1,
            column: 1,
            severity: 'error'
          });
        }

        if (!parsed.info) {
          errors.push({
            message: 'Missing info object',
            line: 1,
            column: 1,
            severity: 'error'
          });
        } else {
          if (!parsed.info.title) {
            errors.push({
              message: 'Missing API title',
              line: 1,
              column: 1,
              severity: 'error'
            });
          }
          if (!parsed.info.version) {
            errors.push({
              message: 'Missing API version',
              line: 1,
              column: 1,
              severity: 'error'
            });
          }
        }

        if (!parsed.paths) {
          errors.push({
            message: 'Missing paths object',
            line: 1,
            column: 1,
            severity: 'error'
          });
        } else {
          // Validate paths
          Object.entries(parsed.paths).forEach(([path, methods]: [string, any]) => {
            if (!path.startsWith('/')) {
              errors.push({
                message: `Path must start with / (${path})`,
                line: 1,
                column: 1,
                severity: 'error'
              });
            }

            // Validate methods
            if (methods && typeof methods === 'object') {
              Object.entries(methods).forEach(([method, operation]: [string, any]) => {
                const validMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];
                if (!validMethods.includes(method.toLowerCase())) {
                  errors.push({
                    message: `Invalid HTTP method: ${method}`,
                    line: 1,
                    column: 1,
                    severity: 'error'
                  });
                }

                // Validate operation
                if (operation) {
                  if (!operation.responses) {
                    errors.push({
                      message: `Missing responses for ${method.toUpperCase()} ${path}`,
                      line: 1,
                      column: 1,
                      severity: 'warning'
                    });
                  }
                }
              });
            }
          });
        }

        // Update editor markers
        if (editor) {
          const model = editor.getModel();
          if (model) {
            monaco.editor.setModelMarkers(model, 'openapi', errors.map(error => ({
              message: error.message,
              severity: error.severity === 'error' 
                ? monaco.MarkerSeverity.Error 
                : monaco.MarkerSeverity.Warning,
              startLineNumber: error.line,
              startColumn: error.column,
              endLineNumber: error.line,
              endColumn: error.column + 1
            })));
          }
        }

        setValidationResult({
          isValid: errors.length === 0,
          errors
        });
      } catch (err) {
        setValidationResult({
          isValid: false,
          errors: [{
            message: err instanceof Error ? err.message : 'Invalid YAML',
            line: 1,
            column: 1,
            severity: 'error'
          }]
        });

        // Update editor markers for YAML parsing error
        if (editor) {
          const model = editor.getModel();
          if (model) {
            monaco.editor.setModelMarkers(model, 'openapi', [{
              message: err instanceof Error ? err.message : 'Invalid YAML',
              severity: monaco.MarkerSeverity.Error,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 2
            }]);
          }
        }
      }
    };

    validateContent();
  }, [content, editor]);

  return validationResult;
} 