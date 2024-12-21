import { AlertTriangle, ChevronDown, Info, Loader2, Wand2, XCircle } from "lucide-react";
import { editor } from "monaco-editor";
import React, { useCallback, useEffect, useState } from "react";
import { aiFixService } from "../lib/ai-fix";
import { ValidationMessage } from "../lib/types";
import { cn } from "../lib/utils";
import { APIEditorRef } from './Editor/APIEditor';
import { Button } from "./ui/Button";
import { Tooltip } from "./ui/TooltipComponent";

interface ValidationPanelProps {
  messages: ValidationMessage[];
  isLoading?: boolean;
  currentContent?: string;
  editorInstance?: editor.IStandaloneCodeEditor;
  onApplyFix?: (newContent: string) => void;
  editorRef?: React.RefObject<APIEditorRef>;
  onValidate?: (content: string) => Promise<void>;
}

interface IOverlayWidget extends editor.IOverlayWidget {
  dispose?: () => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  messages = [],
  isLoading = false,
  currentContent,
  editorInstance,
  onApplyFix,
  editorRef,
  onValidate
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [isAiFixing, setIsAiFixing] = useState<string | null>(null);
  const [currentWidget, setCurrentWidget] = useState<IOverlayWidget | null>(null);

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
    if (!currentContent || !onApplyFix || !editorRef?.current) {
      console.warn('Missing required props for AI fix');
      return;
    }

    try {
      setIsAiFixing(message.id);
      
      const suggestion = await aiFixService.getSuggestion(currentContent, message);
      
      if (!suggestion || suggestion.error) {
        console.error('AI suggestion failed:', suggestion?.error);
        return;
      }

      // Use the editor's showDiff method
      editorRef.current.showDiff(
        currentContent,
        suggestion.suggestion,
        async () => {
          // On apply
          await onApplyFix(suggestion.suggestion);
          // Trigger validation after applying the fix
          if (onValidate) {
            await onValidate(suggestion.suggestion);
          }
        },
        () => {
          // On reject - nothing to do as the editor will handle restoring the content
        }
      );

    } catch (error) {
      console.error('Failed to handle AI fix:', error);
    } finally {
      setIsAiFixing(null);
    }
  };

  // Helper function to escape HTML
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Function to handle rejecting the fix
  const handleRejectFix = React.useCallback(() => {
    if (currentWidget?.dispose) {
      currentWidget.dispose();
    }
  }, [currentWidget]);

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

  // Set up global handlers for AI fix actions
  React.useEffect(() => {
    (window as any).applyAiFix = async (messageId: string) => {
      if (!currentContent || !onApplyFix || !editorRef?.current) return;

      try {
        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        const suggestion = await aiFixService.getSuggestion(currentContent, message);
        if (!suggestion || suggestion.error) return;

        // Apply the suggestion permanently
        onApplyFix(suggestion.suggestion);
        
        // Trigger validation after applying the fix
        if (onValidate) {
          await onValidate(suggestion.suggestion);
        }
        
        // Clean up the widget and decorations
        if (currentWidget?.dispose) {
          // Just remove the widget and decorations without restoring original content
          editorRef.current.deltaDecorations([], []);
          editorRef.current.removeOverlayWidget(currentWidget);
          setCurrentWidget(null);
        }
      } catch (error) {
        console.error('Failed to apply AI fix:', error);
      }
    };

    (window as any).dismissAiFix = () => {
      if (currentWidget?.dispose) {
        currentWidget.dispose();
        setCurrentWidget(null);
      }
    };

    return () => {
      delete (window as any).applyAiFix;
      delete (window as any).dismissAiFix;
    };
  }, [messages, currentContent, onApplyFix, currentWidget, editorRef, onValidate]);

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
