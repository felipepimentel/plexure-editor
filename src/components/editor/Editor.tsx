import React from 'react';
import { useMonaco } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { MonacoEditor } from './MonacoEditor';
import { EditorToolbar } from './EditorToolbar';
import { OpenAPIPreview } from './OpenAPIPreview';
import { useOpenAPIValidation } from './hooks/useOpenAPIValidation';
import { useYAMLFormatter } from './hooks/useYAMLFormatter';
import { useOpenAPISnippets } from './hooks/useOpenAPISnippets';
import { useEditorSearch } from './hooks/useEditorSearch';
import * as monaco from 'monaco-editor';

interface EditorProps {
  className?: string;
  onSpecChange?: (spec: any) => void;
}

export const Editor = React.memo(({ className, onSpecChange }: EditorProps) => {
  const monaco = useMonaco();
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [viewMode, setViewMode] = React.useState<'yaml' | 'preview'>('yaml');
  const [content, setContent] = React.useState(`openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string`);

  // Use hooks
  const validation = useOpenAPIValidation(content, editorRef.current);
  const formatYAML = useYAMLFormatter();
  useOpenAPISnippets(editorRef.current);
  const search = useEditorSearch(editorRef.current);

  // Configure Monaco editor for OpenAPI
  React.useEffect(() => {
    if (monaco) {
      monaco.languages.yaml?.yamlDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
          uri: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.0/schema.json',
          fileMatch: ['*.yaml', '*.yml'],
          schema: {
            type: 'object',
            required: ['openapi', 'info', 'paths'],
            properties: {
              openapi: { type: 'string', pattern: '^3\\.0\\.\\d+$' },
              info: { type: 'object' },
              paths: { type: 'object' }
            }
          }
        }]
      });

      // Add format command with Ctrl+Shift+F
      monaco.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
        if (editorRef.current) {
          const formatted = formatYAML(content);
          setContent(formatted);
        }
      });
    }
  }, [monaco, content, formatYAML]);

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    try {
      // Try to parse as YAML and notify parent
      if (onSpecChange) {
        onSpecChange(newContent);
      }
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }
  };

  // Editor actions
  const handleUndo = React.useCallback(() => {
    editorRef.current?.trigger('keyboard', 'undo', null);
  }, []);

  const handleRedo = React.useCallback(() => {
    editorRef.current?.trigger('keyboard', 'redo', null);
  }, []);

  const handleSave = React.useCallback(() => {
    // Format before saving
    const formatted = formatYAML(content);
    setContent(formatted);
    // TODO: Implement actual save functionality
    console.log('Save not implemented');
  }, [content, formatYAML]);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(content);
  }, [content]);

  const handleDownload = React.useCallback(() => {
    // Format before downloading
    const formatted = formatYAML(content);
    const blob = new Blob([formatted], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swagger.yaml';
    a.click();
    URL.revokeObjectURL(url);
  }, [content, formatYAML]);

  const handleUpload = React.useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yaml,.yml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          // Format uploaded content
          const formatted = formatYAML(content);
          handleContentChange(formatted);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [formatYAML]);

  const handleSettings = React.useCallback(() => {
    // Implement settings functionality
    console.log('Settings not implemented');
  }, []);

  const handleFormat = React.useCallback(() => {
    const formatted = formatYAML(content);
    setContent(formatted);
  }, [content, formatYAML]);

  // Handle editor mount
  const handleEditorMount = React.useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Add format action
    editor.addAction({
      id: 'format-yaml',
      label: 'Format YAML',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      run: () => {
        const formatted = formatYAML(content);
        setContent(formatted);
      }
    });

    // Register search shortcuts
    search.registerShortcuts();
  }, [content, formatYAML, search]);

  return (
    <div className={cn('flex h-full w-full flex-col overflow-hidden', className)}>
      <EditorToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onUpload={handleUpload}
        onSettings={handleSettings}
        onFormat={handleFormat}
        isValid={validation.isValid}
        onSearch={search.toggleSearch}
        onFindNext={search.findNext}
        onFindPrevious={search.findPrevious}
        onReplace={search.replaceCurrent}
        searchState={search.searchState}
      />

      <div className="relative flex-1">
        {viewMode === 'yaml' ? (
          <MonacoEditor
            value={content}
            onChange={handleContentChange}
            language="yaml"
            onMount={handleEditorMount}
          />
        ) : (
          <OpenAPIPreview content={content} />
        )}
      </div>
    </div>
  );
});
