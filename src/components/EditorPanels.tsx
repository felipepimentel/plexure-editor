import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChatPanel } from './ChatPanel';
import { APIEditor } from './Editor/APIEditor';
import { APIDocumentation } from './APIDocumentation';
import { ValidationPanel } from './ValidationPanel';
import { cn } from '../lib/utils';
import { FileManager } from '../lib/file-manager';
import { MessageSquare, FileText, AlertTriangle, Settings } from 'lucide-react';

interface EditorPanelsProps {
  messages?: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }>;
  onSendMessage: (message: string) => void;
  onChange: (value: string | undefined) => void;
  isDarkMode: boolean;
  environment: any;
  fileManager: FileManager | null;
  showPreview: boolean;
  onTogglePreview: () => void;
  validationMessages: Array<{
    id: string;
    type: 'error' | 'warning';
    message: string;
    path?: string;
  }>;
  isValidating: boolean;
  parsedSpec: any;
}

export const EditorPanels: React.FC<EditorPanelsProps> = ({
  messages = [],
  onSendMessage,
  onChange,
  isDarkMode,
  environment,
  fileManager,
  showPreview,
  onTogglePreview,
  validationMessages,
  isValidating,
  parsedSpec,
}) => {
  const [activePanel, setActivePanel] = React.useState<'chat' | 'editor' | 'preview' | 'validation'>('editor');

  return (
    <div className="h-full flex flex-col">
      <PanelGroup direction="horizontal" className="flex-1">
        {/* AI Chat Panel */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={30}
          className={cn(
            "bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50",
            "relative z-20"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">AI Assistant</span>
              </div>
            </div>
            <ChatPanel
              messages={messages}
              onSendMessage={onSendMessage}
              className="flex-1"
            />
          </div>
        </Panel>

        <PanelResizeHandle className="panel-resize-handle w-px bg-border hover:bg-primary/20 transition-colors relative">
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10 transition-colors" />
        </PanelResizeHandle>

        {/* Editor Panel */}
        <Panel
          defaultSize={40}
          minSize={30}
          className={cn(
            "bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50",
            "relative z-20"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Editor</span>
              </div>
            </div>
            <div className="flex-1">
              <APIEditor
                onChange={onChange}
                isDarkMode={isDarkMode}
                environment={environment}
                fileManager={fileManager}
                showPreview={showPreview}
                onTogglePreview={onTogglePreview}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="panel-resize-handle w-px bg-border hover:bg-primary/20 transition-colors relative">
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10 transition-colors" />
        </PanelResizeHandle>

        {/* Preview Panel */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={35}
          className={cn(
            "bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50",
            "relative z-20"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Preview</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              {validationMessages.length === 0 ? (
                <APIDocumentation
                  spec={parsedSpec}
                  className="h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center p-4">
                    <h2 className="text-lg font-semibold mb-2">Preview Disabled</h2>
                    <p className="text-sm text-muted-foreground">
                      Please fix validation errors before viewing the preview.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="panel-resize-handle w-px bg-border hover:bg-primary/20 transition-colors relative">
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10 transition-colors" />
        </PanelResizeHandle>

        {/* Validation Panel */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={35}
          className={cn(
            "bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50",
            "relative z-20"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Validation</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <ValidationPanel
                messages={validationMessages}
                isLoading={isValidating}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>

      {/* Status Bar */}
      <div className="editor-status-bar">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Ready</span>
          </div>
          {fileManager?.getCurrentFile() && (
            <div className="text-xs">
              {fileManager.getCurrentFile()?.name} - {fileManager.getCurrentFile()?.content.length} bytes
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs">YAML</div>
          <div className="text-xs">UTF-8</div>
          {validationMessages.length > 0 && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{validationMessages.length} issues</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 