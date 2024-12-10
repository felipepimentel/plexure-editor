import { editor } from 'monaco-editor';
import { validateOpenAPI } from '../utils/swagger';
import { useEffect } from 'react';

export function useMonacoYamlValidation(
  monacoEditor: editor.IStandaloneCodeEditor | null
) {
  useEffect(() => {
    if (!monacoEditor) return;

    const model = monacoEditor.getModel();
    if (!model) return;

    const updateValidation = () => {
      const content = model.getValue();
      try {
        const validationError = validateOpenAPI(JSON.parse(content));
        const markers = validationError
          ? [{
              severity: monaco.MarkerSeverity.Error,
              message: validationError,
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: model.getLineCount(),
              endColumn: model.getLineMaxColumn(1)
            }]
          : [];
        monaco.editor.setModelMarkers(model, 'yaml-validation', markers);
      } catch (error) {
        // YAML parsing error will be handled by the Monaco YAML extension
      }
    };

    const disposable = model.onDidChangeContent(updateValidation);
    updateValidation();

    return () => disposable.dispose();
  }, [monacoEditor]);
}