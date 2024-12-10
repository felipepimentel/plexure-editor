import React from 'react';
import { Widget } from './Widget';
import { Preview } from '../Preview';

interface PreviewWidgetProps {
  spec: any;
  error: string | null;
  darkMode: boolean;
}

export function PreviewWidget({
  spec,
  error,
  darkMode
}: PreviewWidgetProps) {
  return (
    <Widget
      title="Preview"
      darkMode={darkMode}
      className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="h-full">
        <Preview
          spec={spec}
          error={error}
          darkMode={darkMode}
        />
      </div>
    </Widget>
  );
}