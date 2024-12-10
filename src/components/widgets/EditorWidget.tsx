import React from 'react';
import { Widget } from './Widget';
import { Editor } from '../Editor';

interface EditorWidgetProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  onShowShortcuts: () => void;
  validationResults: any[];
}

export function EditorWidget({
  value,
  onChange,
  darkMode,
  onShowShortcuts,
  validationResults
}: EditorWidgetProps) {
  return (
    <Widget
      title="Editor"
      darkMode={darkMode}
    >
      <Editor
        value={value}
        onChange={onChange}
        darkMode={darkMode}
        onShowShortcuts={onShowShortcuts}
        validationResults={validationResults}
      />
    </Widget>
  );
}