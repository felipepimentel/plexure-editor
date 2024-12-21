import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import React, { forwardRef, useRef } from 'react';
import { DEFAULT_CONTENT } from '../../lib/constants';
import { FileManager } from '../../lib/file-manager';

interface APIEditorProps {
  fileManager: FileManager | null;
  onChange: (value: string | undefined) => void;
  isDarkMode: boolean;
  environment: any;
  showPreview: boolean;
  onTogglePreview: () => void;
  onEditorMount: (editor: editor.IStandaloneCodeEditor) => void;
}

interface IOverlayWidget extends editor.IOverlayWidget {
  dispose?: () => void;
}

export interface APIEditorRef {
  showDiff: (originalContent: string, newContent: string, onApply: () => void, onReject: () => void) => void;
}

export const APIEditor = forwardRef<APIEditorRef, APIEditorProps>(({
  fileManager,
  onChange,
  isDarkMode,
  environment,
  showPreview,
  onTogglePreview,
  onEditorMount
}, ref) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentFile, setCurrentFile] = React.useState<any>(null);
  const [editorValue, setEditorValue] = React.useState(DEFAULT_CONTENT);
  const [showMinimap, setShowMinimap] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);
  const [wordWrap, setWordWrap] = React.useState<'on' | 'off'>('on');
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [currentWidget, setCurrentWidget] = React.useState<IOverlayWidget | null>(null);
  const [decorationIds, setDecorationIds] = React.useState<string[]>([]);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Subscribe to file changes
  React.useEffect(() => {
    if (!fileManager) {
      setEditorValue(DEFAULT_CONTENT);
      return;
    }

    const file = fileManager.getCurrentFile();
    if (file) {
      setEditorValue(file.content);
    } else {
      setEditorValue(DEFAULT_CONTENT);
    }

    const unsubscribe = fileManager.onChange((file) => {
      if (file.content !== editorValue) {
        setEditorValue(file.content);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fileManager]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      minimap: { enabled: showMinimap },
      lineNumbers: showLineNumbers ? 'on' : 'off',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      theme: isDarkMode ? 'vs-dark' : 'vs-light',
      fontSize,
      wordWrap,
      tabSize: 2,
      glyphMargin: true,
    });

    onEditorMount(editor);
  };

  const handleEditorChange = React.useCallback((value: string | undefined) => {
    if (!fileManager || value === undefined) return;
    setEditorValue(value);
    onChange(value);
  }, [fileManager, onChange]);

  const showDiff = React.useCallback((originalContent: string, newContent: string, onApply: () => void, onReject: () => void) => {
    const editorInstance = editorRef.current;
    if (!editorInstance) return;

    // Get the current model
    const model = editorInstance.getModel();
    if (!model) return;

    // Update editor content with suggestion to show the diff
    model.pushEditOperations(
      [],
      [
        {
          range: model.getFullModelRange(),
          text: newContent
        }
      ],
      () => null
    );

    // Create inline diff decorations
    const diffLines = newContent.split('\n');
    const originalLines = originalContent.split('\n');
    const decorations: monaco.editor.IModelDeltaDecoration[] = [];
    
    let currentLine = 1;
    diffLines.forEach((line, index) => {
      if (line !== originalLines[index]) {
        decorations.push({
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: 'diff-add-line',
            glyphMarginClassName: 'diff-add-glyph',
            glyphMarginHoverMessage: { value: 'Changed line' },
            minimap: {
              color: { id: 'diffEditor.insertedLineBackground' },
              position: 1
            },
            linesDecorationsClassName: 'diff-add-line-number'
          }
        });
      }
      currentLine++;
    });

    // Add styles for the inline diff
    if (!document.getElementById('monaco-inline-diff-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'monaco-inline-diff-styles';
      styleSheet.textContent = `
        .diff-add-line {
          background-color: rgba(40, 167, 69, 0.1) !important;
          border-left: 3px solid #28a745 !important;
        }
        .diff-add-glyph {
          background-color: #28a745;
          width: 3px !important;
          margin-left: 3px;
        }
        .diff-add-line-number {
          color: #28a745 !important;
        }
        .inline-fix-widget {
          position: absolute;
          top: 0;
          right: 20px;
          background-color: #252526;
          border: 1px solid #454545;
          border-radius: 3px;
          padding: 8px;
          margin: 4px;
          z-index: 100;
        }
        .inline-fix-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .inline-fix-button {
          padding: 4px 12px;
          border-radius: 3px;
          cursor: pointer;
          border: none;
          font-size: 12px;
          font-weight: 500;
          transition: all 150ms ease;
        }
        .inline-fix-apply {
          background-color: #28a745;
          color: white;
        }
        .inline-fix-apply:hover {
          background-color: #218838;
        }
        .inline-fix-dismiss {
          background-color: #3c3c3c;
          color: #d4d4d4;
        }
        .inline-fix-dismiss:hover {
          background-color: #4a4a4a;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Clean up any existing widgets
    if (currentWidget?.dispose) {
      currentWidget.dispose();
    }

    // Add the inline widget with the fix buttons
    const inlineWidget: IOverlayWidget = {
      getId: () => 'inline-fix-widget',
      getDomNode: () => {
        const container = document.createElement('div');
        container.className = 'inline-fix-widget';
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'inline-fix-actions';
        
        const rejectButton = document.createElement('button');
        rejectButton.className = 'inline-fix-button inline-fix-dismiss';
        rejectButton.textContent = 'Reject';
        rejectButton.onclick = () => {
          // Restore original content
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: originalContent
              }
            ],
            () => null
          );
          
          // Clean up
          editorInstance.deltaDecorations(decorationIds, []);
          editorInstance.removeOverlayWidget(inlineWidget);
          setCurrentWidget(null);
          setDecorationIds([]);
          
          // Remove diff styles
          const styleSheet = document.getElementById('monaco-inline-diff-styles');
          if (styleSheet) {
            styleSheet.remove();
          }
          
          onReject();
        };
        
        const applyButton = document.createElement('button');
        applyButton.className = 'inline-fix-button inline-fix-apply';
        applyButton.textContent = 'Apply Fix';
        applyButton.onclick = () => {
          // Clean up
          editorInstance.deltaDecorations(decorationIds, []);
          editorInstance.removeOverlayWidget(inlineWidget);
          setCurrentWidget(null);
          setDecorationIds([]);
          
          // Remove diff styles
          const styleSheet = document.getElementById('monaco-inline-diff-styles');
          if (styleSheet) {
            styleSheet.remove();
          }
          
          onApply();
        };
        
        actionsDiv.appendChild(rejectButton);
        actionsDiv.appendChild(applyButton);
        container.appendChild(actionsDiv);
        
        return container;
      },
      getPosition: () => ({
        preference: monaco.editor.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
      })
    };

    // Apply new decorations and widget
    const newDecorationIds = editorInstance.deltaDecorations([], decorations);
    editorInstance.addOverlayWidget(inlineWidget);
    
    // Store references
    setCurrentWidget(inlineWidget);
    setDecorationIds(newDecorationIds);
  }, [editorRef, currentWidget, decorationIds]);

  // Expose the showDiff method to parent components
  React.useImperativeHandle(ref, () => ({
    showDiff
  }), [showDiff]);

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: showMinimap },
    lineNumbers: showLineNumbers ? 'on' : 'off',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    fontSize,
    wordWrap,
    tabSize: 2,
    glyphMargin: true,
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 relative">
        <Editor
          defaultLanguage="yaml"
          value={editorValue}
          onChange={handleEditorChange}
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          onMount={handleEditorDidMount}
          options={editorOptions}
        />
      </div>
    </div>
  );
}); 