import { AlertTriangle, ChevronDown, Info, Loader2, Wand2, XCircle } from "lucide-react";
import { editor } from 'monaco-editor';
import React, { useCallback, useEffect, useState } from "react";
import { aiFixService } from "../lib/ai-fix";
import { ValidationMessage } from "../lib/types";
import { cn } from "../lib/utils";
import { APIEditorRef } from './APIEditor';
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/TooltipComponent";

interface ValidationPanelProps {
  messages: ValidationMessage[];
  isLoading: boolean;
  currentContent: string;
  editorInstance?: editor.IStandaloneCodeEditor;
  editorRef: React.RefObject<APIEditorRef>;
  onApplyFix: (newContent: string) => Promise<void>;
  onValidate: (content: string) => Promise<void>;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  messages = [],
  isLoading,
  currentContent,
  editorInstance,
  editorRef,
  onApplyFix,
  onValidate
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [isAiFixing, setIsAiFixing] = useState<string | null>(null);

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

  const handleAiFix = useCallback(async (message: ValidationMessage) => {
    if (!editorRef.current?.editor) return;

    try {
      setIsAiFixing(message.id);
      const currentContent = editorRef.current.editor.getValue();
      const suggestion = await aiFixService.getSuggestion(currentContent, message);

      if (!suggestion || suggestion.error) {
        console.warn('No suggestion available:', suggestion?.error);
        return;
      }

      // Show diff in editor
      editorRef.current.showDiff(currentContent, suggestion.suggestion);

      // Listen for diff events
      const unsubscribe = editorRef.current.addEventListener((event) => {
        if (event.type === 'diff:apply') {
          // Update editor content
          editorRef.current?.editor?.setValue(event.content);
          unsubscribe();
        } else if (event.type === 'diff:reject') {
          // Restore original content
          editorRef.current?.editor?.setValue(currentContent);
          unsubscribe();
        }
      });

    } catch (error) {
      console.error('Error getting AI fix:', error);
    } finally {
      setIsAiFixing(null);
    }
  }, [editorRef]);

  const togglePath = useCallback((path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  // Initialize expanded paths with all paths that have errors
  useEffect(() => {
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

  const getMessageIcon = (type: ValidationMessage['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleMessageClick = (message: ValidationMessage) => {
    if (!editorInstance || !message.line) return;

    editorInstance.revealLineInCenter(message.line);
    editorInstance.setPosition({
      lineNumber: message.line,
      column: message.column || 1
    });
    editorInstance.focus();
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
                        {getMessageIcon(message.type)}
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
                                      : "bg-primary/10 text-primary hover:bg-primary/20"
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

export default ValidationPanel;
