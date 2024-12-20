import {
    AlertTriangle,
    Clock,
    Code,
    Eye,
    FileJson,
    FileText,
    GitBranch,
    Info,
    Loader2,
    Maximize2,
    MessageSquare,
    Minimize2,
    MoreVertical,
    Share2
} from 'lucide-react';
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileManager } from '../lib/file-manager';
import { cn } from '../lib/utils';
import { APIDocumentation } from './APIDocumentation';
import { ChatPanel } from './ChatPanel';
import { APIEditor } from './Editor/APIEditor';
import { Tooltip } from './ui/TooltipComponent';
import ValidationPanel from './ValidationPanel';

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
  const [isMaximized, setIsMaximized] = React.useState<string | null>(null);
  const [showPanelMenu, setShowPanelMenu] = React.useState<string | null>(null);

  const PanelHeader = ({ 
    icon: Icon, 
    title, 
    panelKey,
    actions,
    badge,
    description
  }: { 
    icon: React.ElementType; 
    title: string;
    panelKey: string;
    actions?: React.ReactNode;
    badge?: number;
    description?: string;
  }) => (
    <div className="flex flex-col border-b bg-muted/30">
      <div className="flex items-center h-9 px-4 select-none">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <Icon className="w-4 h-4 text-muted-foreground" />
            {badge !== undefined && badge > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {badge}
              </span>
            )}
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {actions}
          <div className="relative">
            <Tooltip content="Panel Actions">
              <button
                onClick={() => setShowPanelMenu(showPanelMenu === panelKey ? null : panelKey)}
                className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
            {showPanelMenu === panelKey && (
              <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                <button
                  onClick={() => {
                    setIsMaximized(isMaximized === panelKey ? null : panelKey);
                    setShowPanelMenu(null);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  {isMaximized === panelKey ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5" />
                      Restore
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5" />
                      Maximize
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowPanelMenu(null)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {description && (
        <div className="px-4 py-2 border-t border-border/50 bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            {description}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <PanelGroup
        direction="horizontal"
        className={cn(
          "flex-1",
          isMaximized && "hidden"
        )}
      >
        {/* AI Chat Panel */}
        <Panel
          defaultSize={25}
          minSize={15}
          maxSize={50}
          className="bg-background relative z-20"
        >
          <div className="h-full flex flex-col">
            <PanelHeader
              icon={MessageSquare}
              title="AI Assistant"
              panelKey="chat"
              badge={messages.length}
              description="Ask questions about OpenAPI and get instant help"
            />
            <ChatPanel
              messages={messages}
              onSendMessage={onSendMessage}
              className="flex-1"
            />
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-border hover:bg-primary/20 transition-colors relative group">
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10 transition-colors" />
        </PanelResizeHandle>

        {/* Editor Panel */}
        <Panel
          defaultSize={40}
          minSize={30}
          className="bg-background relative z-20"
        >
          <div className="h-full flex flex-col">
            <PanelHeader
              icon={FileText}
              title="Editor"
              panelKey="editor"
              description={fileManager?.getCurrentFile()?.name}
              actions={
                <div className="flex items-center gap-1">
                  <Tooltip content="Format Document">
                    <button className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <Code className="h-3.5 w-3.5" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Convert to JSON">
                    <button className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                      <FileJson className="h-3.5 w-3.5" />
                    </button>
                  </Tooltip>
                </div>
              }
            />
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

        <PanelResizeHandle className="w-px bg-border hover:bg-primary/20 transition-colors relative group">
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10 transition-colors" />
        </PanelResizeHandle>

        {/* Preview Panel */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={35}
          className="bg-background relative z-20"
        >
          <div className="h-full flex flex-col">
            <PanelHeader
              icon={Eye}
              title="Preview"
              panelKey="preview"
              description="Live preview of your OpenAPI specification"
            />
            <div className="flex-1 overflow-auto">
              {validationMessages.length === 0 ? (
                <APIDocumentation
                  spec={parsedSpec}
                  className="h-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <h2 className="text-base font-medium mb-2">Preview Disabled</h2>
                    <p className="text-sm text-muted-foreground">
                      Please fix validation errors before viewing the preview.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-border hover:bg-primary/20 transition-colors relative group">
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10 transition-colors" />
        </PanelResizeHandle>

        {/* Validation Panel */}
        <Panel
          defaultSize={20}
          minSize={15}
          maxSize={35}
          className="bg-background relative z-20"
        >
          <div className="h-full flex flex-col">
            <PanelHeader
              icon={AlertTriangle}
              title="Problems"
              panelKey="validation"
              badge={validationMessages.length}
              description={validationMessages.length > 0 ? `${validationMessages.length} issues found` : 'No issues found'}
            />
            <div className="flex-1 overflow-auto">
              <ValidationPanel
                messages={validationMessages}
                isLoading={isValidating}
                currentContent={fileManager?.getCurrentFile()?.content}
                onApplyFix={(newContent) => {
                  if (fileManager) {
                    const file = fileManager.getCurrentFile();
                    if (file) {
                      file.content = newContent;
                      file.modified = true;
                      fileManager.updateCurrentFile(file);
                      onChange(newContent);
                    }
                  }
                }}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>

      {isMaximized && (
        <div className="flex-1">
          {isMaximized === 'chat' && (
            <div className="h-full flex flex-col">
              <PanelHeader
                icon={MessageSquare}
                title="AI Assistant"
                panelKey="chat"
                badge={messages.length}
                description="Ask questions about OpenAPI and get instant help"
              />
              <ChatPanel
                messages={messages}
                onSendMessage={onSendMessage}
                className="flex-1"
              />
            </div>
          )}
          {isMaximized === 'editor' && (
            <div className="h-full flex flex-col">
              <PanelHeader
                icon={FileText}
                title="Editor"
                panelKey="editor"
                description={fileManager?.getCurrentFile()?.name}
                actions={
                  <div className="flex items-center gap-1">
                    <Tooltip content="Format Document">
                      <button className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <Code className="h-3.5 w-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Convert to JSON">
                      <button className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <FileJson className="h-3.5 w-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                }
              />
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
          )}
          {isMaximized === 'preview' && (
            <div className="h-full flex flex-col">
              <PanelHeader
                icon={Eye}
                title="Preview"
                panelKey="preview"
                description="Live preview of your OpenAPI specification"
              />
              <div className="flex-1 overflow-auto">
                {validationMessages.length === 0 ? (
                  <APIDocumentation
                    spec={parsedSpec}
                    className="h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      </div>
                      <h2 className="text-base font-medium mb-2">Preview Disabled</h2>
                      <p className="text-sm text-muted-foreground">
                        Please fix validation errors before viewing the preview.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {isMaximized === 'validation' && (
            <div className="h-full flex flex-col">
              <PanelHeader
                icon={AlertTriangle}
                title="Problems"
                panelKey="validation"
                badge={validationMessages.length}
                description={validationMessages.length > 0 ? `${validationMessages.length} issues found` : 'No issues found'}
              />
              <div className="flex-1 overflow-auto">
                <ValidationPanel
                  messages={validationMessages}
                  isLoading={isValidating}
                  currentContent={fileManager?.getCurrentFile()?.content}
                  onApplyFix={(newContent) => {
                    if (fileManager) {
                      const file = fileManager.getCurrentFile();
                      if (file) {
                        file.content = newContent;
                        file.modified = true;
                        fileManager.updateCurrentFile(file);
                        onChange(newContent);
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div className="h-6 border-t bg-muted/30 px-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isValidating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
            <span>Ready</span>
          </div>
          {fileManager?.getCurrentFile() && (
            <div className="flex items-center gap-2">
              <GitBranch className="w-3 h-3" />
              <span>{fileManager.getCurrentFile()?.name}</span>
              <span>•</span>
              <span>{fileManager.getCurrentFile()?.content.length} bytes</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>YAML</span>
          </div>
          <div>UTF-8</div>
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