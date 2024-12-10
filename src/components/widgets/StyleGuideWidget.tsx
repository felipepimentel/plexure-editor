import React from 'react';
import { Widget } from './Widget';
import { StyleGuidePanel } from '../style-guide/StyleGuidePanel';
import { useStyleGuideStore } from '../../store/styleGuideStore';

interface StyleGuideWidgetProps {
  validationResults: any[];
  darkMode: boolean;
  onClose: () => void;
}

export function StyleGuideWidget({ validationResults, darkMode, onClose }: StyleGuideWidgetProps) {
  const { activeGuide } = useStyleGuideStore();

  return (
    <div className="h-full flex flex-col">
      <StyleGuidePanel
        validationResults={validationResults}
        darkMode={darkMode}
        onClose={onClose}
      />
    </div>
  );
}