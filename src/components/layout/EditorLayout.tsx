import React, { useState } from 'react';
import { NavigatorPanel, PreviewPanel, ValidationPanel } from '../panels';
import { Editor } from '../Editor';
import { EditorToolbar } from '../editor/EditorToolbar';
import { EditorPreferences } from '../../types/preferences';
import { EditorStatusBar } from '../editor/EditorStatusBar';
import { PanelResizer } from '../common/PanelResizer';
import { 
  Maximize2, 
  Minimize2, 
  Eye, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  PanelLeft,
  PanelRight
} from 'lucide-react';
import { RightNavigationMenu } from '../navigation/RightNavigationMenu';

interface EditorLayoutProps {
  darkMode: boolean;
  spec: string;
  parsedSpec: any;
  validationResults: any[];
  preferences?: EditorPreferences;
  onSpecChange: (value: string) => void;
  onShowShortcuts: () => void;
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
  onFormat: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  selectedPath?: string;
  onPathSelect: (path: string) => void;
  cursorPosition: { line: number; column: number };
  documentInfo: {
    lineCount: number;
    version: string;
    format: 'yaml' | 'json';
  };
  errorCount: number;
  warningCount: number;
  onPanelCollapse: (panel: 'left' | 'right', collapsed: boolean) => void;
}

export function EditorLayout({
  darkMode,
  spec,
  parsedSpec,
  validationResults,
  preferences,
  onSpecChange,
  onShowShortcuts,
  onSave,
  onImport,
  onExport,
  onFormat,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  selectedPath,
  onPathSelect,
  cursorPosition,
  documentInfo,
  errorCount,
  warningCount,
  onPanelCollapse
}: EditorLayoutProps) {
  const [activeRightPanel, setActiveRightPanel] = useState<'preview' | 'validation'>('preview');
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);

  const handleCursorPositionChange = (position: { line: number; column: number }) => {
    console.log('Cursor position:', position);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Navigator */}
      <div className={`
        flex-shrink-0 border-r relative transition-all duration-300 ease-in-out
        ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}
        ${preferences?.left_panel_collapsed ? 'w-16' : 'w-72'}
        ${isEditorMaximized ? 'hidden' : ''}
      `}>
        <NavigatorPanel
          darkMode={darkMode}
          spec={parsedSpec}
          rawSpec={spec}
          collapsed={preferences?.left_panel_collapsed}
          selectedPath={selectedPath}
          onPathSelect={onPathSelect}
        />
        <PanelResizer
          darkMode={darkMode}
          position="right"
          collapsed={preferences?.left_panel_collapsed || false}
          onToggle={() => onPanelCollapse('left', !preferences?.left_panel_collapsed)}
        />
      </div>

      {/* Center Panel - Editor */}
      <div className={`
        flex-1 min-w-0 flex flex-col bg-opacity-50 relative
        ${isEditorMaximized ? 'w-full' : ''}
      `}>
        <EditorToolbar
          darkMode={darkMode}
          isEditorMaximized={isEditorMaximized}
          isPanelLeftCollapsed={preferences?.left_panel_collapsed || false}
          isPanelRightCollapsed={preferences?.right_panel_collapsed || false}
          onSave={onSave}
          onImport={onImport}
          onExport={onExport}
          onFormat={onFormat}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onToggleEditorMaximize={() => setIsEditorMaximized(!isEditorMaximized)}
          onToggleLeftPanel={() => onPanelCollapse('left', !preferences?.left_panel_collapsed)}
          onToggleRightPanel={() => onPanelCollapse('right', !preferences?.right_panel_collapsed)}
        />
        
        <div className="flex-1 min-h-0 relative">
          <Editor
            value={spec}
            onChange={onSpecChange}
            darkMode={darkMode}
            validationResults={validationResults}
            onShowShortcuts={onShowShortcuts}
            onCursorPositionChange={handleCursorPositionChange}
          />
        </div>

        <EditorStatusBar
          darkMode={darkMode}
          errorCount={errorCount}
          warningCount={warningCount}
          cursorPosition={cursorPosition}
          documentInfo={documentInfo}
        />
      </div>

      {/* Right Panel - Preview & Validation */}
      <div className={`
        flex-shrink-0 flex relative transition-all duration-300 ease-in-out
        ${darkMode ? 'bg-gray-900' : 'bg-white'}
        ${preferences?.right_panel_collapsed ? 'w-16' : 'w-[400px]'}
        ${isEditorMaximized ? 'hidden' : ''}
      `}>
        {/* Main Content */}
        <div className={`
          flex-1 min-w-0 border-l border-gray-800
          ${preferences?.right_panel_collapsed ? 'hidden' : ''}
        `}>
          {activeRightPanel === 'preview' ? (
            <PreviewPanel
              spec={parsedSpec}
              darkMode={darkMode}
              errors={validationResults.map(result => ({
                path: result.path || '',
                message: result.message || 'Validation error',
                severity: result.rule.severity === 'info' ? 'warning' : result.rule.severity
              }))}
              collapsed={preferences?.right_panel_collapsed}
            />
          ) : (
            <ValidationPanel
              errors={validationResults}
              darkMode={darkMode}
              collapsed={preferences?.right_panel_collapsed}
            />
          )}
        </div>

        {/* Navigation Bar */}
        <div className="w-16 flex-shrink-0 flex flex-col border-l border-gray-800">
          <RightNavigationMenu
            darkMode={darkMode}
            collapsed={preferences?.right_panel_collapsed}
            activeItem={activeRightPanel}
            onItemSelect={setActiveRightPanel}
            validationCount={validationResults.length}
            onToggleCollapse={() => onPanelCollapse('right', !preferences?.right_panel_collapsed)}
          />
        </div>

        {/* Panel Resizer */}
        <PanelResizer
          darkMode={darkMode}
          position="left"
          collapsed={preferences?.right_panel_collapsed}
          onToggle={() => onPanelCollapse('right', !preferences?.right_panel_collapsed)}
        />
      </div>
    </div>
  );
} 