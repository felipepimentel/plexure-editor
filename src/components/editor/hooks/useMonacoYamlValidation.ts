import { useEffect } from 'react';
import * as monaco from 'monaco-editor';

export function useMonacoYamlValidation(editor: monaco.editor.IStandaloneCodeEditor | null) {
  useEffect(() => {
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    // Set up YAML validation
    const validateYaml = () => {
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
  }, [editor]);
} 