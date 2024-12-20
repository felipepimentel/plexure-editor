import { Change, diffLines } from 'diff';
import { AlertTriangle, ChevronDown, Info, Loader2, Wand2, XCircle } from "lucide-react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
import React from "react";
import { parse, stringify } from "yaml";
import { aiFixService } from "../lib/ai-fix";
import { ValidationMessage } from "../lib/types";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/TooltipComponent";

interface ValidationPanelProps {
  messages: ValidationMessage[];
  isLoading?: boolean;
  currentContent?: string;
  editorInstance?: editor.IStandaloneCodeEditor;
  onApplyFix?: (newContent: string) => void;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  messages = [],
  isLoading = false,
  currentContent,
  editorInstance,
  onApplyFix
}) => {
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(new Set());
  const [isAiFixing, setIsAiFixing] = React.useState<string | null>(null);

  // Group messages by path
  const groupedMessages = React.useMemo(() => {
    const groups: Record<string, ValidationMessage[]> = {};
    messages.forEach(message => {
      const path = message.path || "root";
      if (!groups[path]) groups[path] = [];
      groups[path].push(message);
    });
    return groups;
  }, [messages]);

  const handleAiFix = async (message: ValidationMessage) => {
    if (!currentContent) {
      console.warn('Missing currentContent for AI fix');
      return;
    }
    if (!onApplyFix) {
      console.warn('Missing onApplyFix handler for AI fix');
      return;
    }
    if (!editorInstance) {
      console.warn('Missing editorInstance for AI fix');
      return;
    }

    try {
      setIsAiFixing(message.id);
      
      let spec;
      try {
        spec = parse(currentContent);
      } catch (error) {
        console.error('Failed to parse YAML content:', error);
        return;
      }

      const suggestion = await aiFixService.getSuggestion(spec, message);
      
      if (!suggestion || suggestion.error) {
        console.error('AI suggestion failed:', suggestion?.error);
        return;
      }
      
      const updatedSpec = await aiFixService.applyFix(spec, suggestion.fix);
      const newContent = stringify(updatedSpec);
      
      // Show the diff preview
      const diff = diffLines(currentContent, newContent);
      
      // Add decorations to show the diff
      const decorations = diff.flatMap((change: Change, index: number) => {
        if (!change.added && !change.removed) return [];
        
        const startLine = change.removed ? message.line || 1 : (message.line || 1) + 1;
        const endLine = startLine + (change.count || 1);
        
        return [{
          range: new monaco.Range(startLine, 1, endLine, 1),
          options: {
            isWholeLine: true,
            className: change.added ? 'diff-added' : 'diff-removed',
            glyphMarginClassName: change.added ? 'diff-added-gutter' : 'diff-removed-gutter',
          }
        }];
      });

      // Clear any existing decorations
      editorInstance.deltaDecorations([], decorations);

      // Remove any existing widget
      const existingWidget = editorInstance.getContentWidgets().find(w => w.getId() === 'ai-fix-widget');
      if (existingWidget) {
        editorInstance.removeContentWidget(existingWidget);
      }

      // Add the fix button to the editor
      const widgetHtml = `
        <div class="p-2 bg-background border rounded-md shadow-lg">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-sm font-medium">Apply this fix?</span>
            <span class="text-xs text-muted-foreground">${suggestion.suggestion}</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.applyAiFix('${message.id}')" class="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Apply
            </button>
            <button onclick="window.dismissAiFix()" class="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md hover:bg-muted/90">
              Dismiss
            </button>
          </div>
        </div>
      `;

      editorInstance.addContentWidget({
        getId: () => 'ai-fix-widget',
        getDomNode: () => {
          const container = document.createElement('div');
          container.innerHTML = widgetHtml;
          return container;
        },
        getPosition: () => ({
          position: {
            lineNumber: message.line || 1,
            column: 1
          },
          preference: [1]
        })
      });
    } catch (error) {
      console.error('Failed to get AI suggestion:', error);
    } finally {
      setIsAiFixing(null);
    }
  };

  // Set up global handlers for AI fix actions
  React.useEffect(() => {
    window.applyAiFix = async (messageId: string) => {
      if (!currentContent || !onApplyFix) return;

      try {
        const spec = parse(currentContent);
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        const suggestion = await aiFixService.getSuggestion(spec, message);
        if (!suggestion || suggestion.error) return;

        const updatedSpec = await aiFixService.applyFix(spec, suggestion.fix);
        onApplyFix(stringify(updatedSpec));
      } catch (error) {
        console.error('Failed to apply AI fix:', error);
      }
    };

    window.dismissAiFix = () => {
      if (editorInstance) {
        editorInstance.deltaDecorations([], []);
        const widget = editorInstance.getContentWidgets().find(w => w.getId() === 'ai-fix-widget');
        if (widget) {
          editorInstance.removeContentWidget(widget);
        }
      }
    };

    return () => {
      delete window.applyAiFix;
      delete window.dismissAiFix;
    };
  }, [messages, currentContent, onApplyFix, editorInstance]);

  const togglePath = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Initialize expanded paths with all paths that have errors
  React.useEffect(() => {
    setExpandedPaths(new Set(
      Object.entries(groupedMessages)
        .filter(([_, messages]) => messages.some(m => m.type === 'error'))
        .map(([path]) => path)
    ));
  }, [groupedMessages]);

  // Function to check if a message can be fixed by AI
  const canFixMessage = (message: ValidationMessage) => {
    return message.type === 'error' && (
      message.message.toLowerCase().includes('requires authentication') ||
      message.message.toLowerCase().includes('security') ||
      message.message.toLowerCase().includes('schema') ||
      message.message.toLowerCase().includes('required')
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedMessages).map(([path, messages]) => {
          const isExpanded = expandedPaths.has(path);
          const hasErrors = messages.some(m => m.type === "error");
          return (
            <div key={`group-${path}`} className="border-b border-border/50 last:border-0">
              <button
                onClick={() => togglePath(path)}
                className={cn(
                  "flex items-center w-full gap-1 px-4 py-1.5 text-xs font-medium transition-colors",
                  hasErrors ? "bg-red-500/5 hover:bg-red-500/10" : "bg-muted/30 hover:bg-muted/50"
                )}
              >
                <span className="opacity-50">#</span>
                <span className="truncate flex-1 text-left">{path}</span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span>{messages.length} {messages.length === 1 ? 'issue' : 'issues'}</span>
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </span>
              </button>
              {isExpanded && (
                <div className="divide-y divide-border/50">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.id || index}`}
                      className={cn(
                        "group relative flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-muted/50",
                        message.type === "error" && "hover:bg-red-500/5",
                        message.type === "warning" && "hover:bg-yellow-500/5",
                        message.type === "info" && "hover:bg-blue-500/5"
                      )}
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        {message.type === "error" && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {message.type === "warning" && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {message.type === "info" && (
                          <Info className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <span
                            className={cn(
                              "text-sm break-words",
                              message.type === "error" && "text-red-500",
                              message.type === "warning" && "text-yellow-500",
                              message.type === "info" && "text-blue-500"
                            )}
                          >
                            {message.message}
                          </span>
                          {canFixMessage(message) && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Tooltip content={isAiFixing === message.id ? "Generating fix..." : "Fix with AI"}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAiFix(message)}
                                  disabled={isAiFixing === message.id}
                                  className={cn(
                                    "h-7 px-2 transition-all",
                                    isAiFixing === message.id
                                      ? "bg-primary/20 text-primary"
                                      : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                  )}
                                >
                                  {isAiFixing === message.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Wand2 className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                        {message.context && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {message.context.method && (
                              <span className="mr-2">Method: {message.context.method}</span>
                            )}
                            {message.context.schemaName && (
                              <span>Schema: {message.context.schemaName}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
