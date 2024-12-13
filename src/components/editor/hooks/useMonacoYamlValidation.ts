import { useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { ValidationResult } from '@/types/preferences';

export function useMonacoYamlValidation(editor: monaco.editor.IStandaloneCodeEditor | null) {
  useEffect(() => {
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    // Set up YAML validation
    const yamlValidationDisposable = monaco.languages.registerDiagnosticsProvider('yaml', {
      onDidChangeDiagnostics: () => {},
      provideDiagnostics: async (model) => {
        const content = model.getValue();
        const markers: monaco.editor.IMarkerData[] = [];

        try {
          // Basic YAML syntax validation
          // In a real implementation, you would use a proper YAML parser
          // and OpenAPI/Swagger schema validation
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

          // Add more validation rules here
        } catch (error) {
          console.error('YAML validation error:', error);
        }

        monaco.editor.setModelMarkers(model, 'yaml', markers);
        return { markers };
      }
    });

    return () => {
      yamlValidationDisposable.dispose();
    };
  }, [editor]);
} 