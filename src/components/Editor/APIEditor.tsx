import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_CONTENT } from '../../lib/constants';
import { ValidationMessage } from '../../lib/types';

// Event types
type EditorEventType = 
  | { type: 'content:change', content: string }
  | { type: 'content:validate', messages: ValidationMessage[], parsedSpec: any }
  | { type: 'editor:ready', instance: editor.IStandaloneCodeEditor }
  | { type: 'diff:show', original: string, modified: string }
  | { type: 'diff:apply', content: string }
  | { type: 'diff:reject' };

interface APIEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onMount?: (editor: editor.IStandaloneCodeEditor) => void;
  onValidate?: (messages: ValidationMessage[], parsedSpec: any) => void;
  isDarkMode?: boolean;
  wordWrap?: 'on' | 'off';
}

export interface APIEditorRef {
  showDiff: (original: string, modified: string) => void;
  addEventListener: (listener: (event: EditorEventType) => void) => () => void;
  editor: editor.IStandaloneCodeEditor | null;
}

interface CustomOverlayWidget extends editor.IOverlayWidget {
  domNode: HTMLDivElement;
}

export const APIEditor = forwardRef<APIEditorRef, APIEditorProps>(({
  content = DEFAULT_CONTENT,
  onChange,
  onMount,
  onValidate,
  isDarkMode = false,
  wordWrap = 'on'
}, ref) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const decorationsRef = useRef<string[]>([]);
  const eventListenersRef = useRef<Set<(event: EditorEventType) => void>>(new Set());

  // Event handling
  const emit = useCallback((event: EditorEventType) => {
    eventListenersRef.current.forEach(listener => listener(event));
  }, []);

  const addEventListener = useCallback((listener: (event: EditorEventType) => void) => {
    eventListenersRef.current.add(listener);
    return () => {
      eventListenersRef.current.delete(listener);
    };
  }, []);

  // Editor initialization
  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: content,
      language: 'yaml',
      theme: isDarkMode ? 'vs-dark' : 'vs',
      wordWrap,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      renderValidationDecorations: 'on',
      folding: true,
      fontSize: 14,
      tabSize: 2,
    });

    editorRef.current = editor;

    // Emit ready event
    emit({ type: 'editor:ready', instance: editor });

    // Content change handler
    editor.onDidChangeModelContent(() => {
      const newContent = editor.getValue();
      emit({ type: 'content:change', content: newContent });
      if (onChange) onChange(newContent);
    });

    if (onMount) {
      onMount(editor);
    }

    return () => {
      editor.dispose();
      editorRef.current = null;
    };
  }, []);

  // Theme update
  useEffect(() => {
    monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
  }, [isDarkMode]);

  // Word wrap update
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ wordWrap });
    }
  }, [wordWrap]);

  // Diff handling
  const showDiff = useCallback((original: string, modified: string) => {
    if (!editorRef.current) return;

    // Clear previous decorations
    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);

    const domNode = document.createElement('div');
    domNode.className = 'inline-fix-widget';
    domNode.innerHTML = `
      <div class="inline-fix-actions">
        <button class="inline-fix-button inline-fix-dismiss">Reject</button>
        <button class="inline-fix-button inline-fix-apply">Apply Fix</button>
      </div>
    `;

    // Create inline widget for diff actions
    const widget: CustomOverlayWidget = {
      domNode,
      getId: () => 'inline-fix-widget',
      getDomNode: () => domNode,
      getPosition: () => ({
        preference: monaco.editor.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
      })
    };

    // Add click handlers
    const applyButton = domNode.querySelector('.inline-fix-apply');
    const rejectButton = domNode.querySelector('.inline-fix-dismiss');

    if (applyButton) {
      applyButton.addEventListener('click', () => {
        emit({ type: 'diff:apply', content: modified });
        editorRef.current?.removeOverlayWidget(widget);
      });
    }

    if (rejectButton) {
      rejectButton.addEventListener('click', () => {
        emit({ type: 'diff:reject' });
        editorRef.current?.removeOverlayWidget(widget);
      });
    }

    // Add widget to editor
    editorRef.current.addOverlayWidget(widget);

    // Update content to show diff
    editorRef.current.setValue(modified);
  }, []);

  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    showDiff,
    addEventListener,
    editor: editorRef.current
  }), [showDiff, addEventListener]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
});

APIEditor.displayName = 'APIEditor';

export default APIEditor; 