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

interface Window {
  applyAiFix: (messageId: string) => void;
  dismissAiFix: () => void;
}

declare global {
  interface Window {
    applyAiFix: (messageId: string) => void;
    dismissAiFix: () => void;
  }
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  messages = [],
  isLoading = false,
  currentContent,
  editorInstance,
  onApplyFix
}) => {
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(new Set());
  const [isAiFixing, setIsAiFixing] = React.useState<string | null>(null);
  const [currentWidget, setCurrentWidget] = React.useState<monaco.editor.IOverlayWidget | null>(null);

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
    if (!currentContent || !onApplyFix || !editorInstance) {
      console.warn('Missing required props for AI fix');
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

      // Find the range of lines to modify
      const lines = currentContent.split('\n');
      let startLine = Math.max(1, Math.min(message.line || 1, lines.length));
      let endLine = startLine;

      // Safely get the base indentation
      const baseIndent = lines[startLine - 1] 
        ? (lines[startLine - 1].match(/^\s*/) || [''])[0].length
        : 0;
      
      // Look backwards for the block start
      for (let i = startLine - 2; i >= 0; i--) {
        const line = lines[i];
        if (!line) continue;
        
        const indent = (line.match(/^\s*/) || [''])[0].length;
        if (indent < baseIndent) {
          startLine = i + 1;
          break;
        }
      }
      
      // Look forwards for the block end
      for (let i = startLine; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        
        const indent = (line.match(/^\s*/) || [''])[0].length;
        if (indent < baseIndent && i > startLine) {
          endLine = i;
          break;
        }
      }

      // Create inline diff decorations
      const diffLines = suggestion.diff?.split('\n') || [];
      const decorations: monaco.editor.IModelDeltaDecoration[] = [];
      
      let currentLine = startLine;
      diffLines.forEach(line => {
        if (!line) return;

        if (line.startsWith('+')) {
          decorations.push({
            range: new monaco.Range(currentLine, 1, currentLine, 1),
            options: {
              isWholeLine: true,
              className: 'diff-add-line',
              glyphMarginClassName: 'diff-add-glyph',
              glyphMarginHoverMessage: { value: 'Line to be added' },
              minimap: {
                color: { id: 'diffEditor.insertedLineBackground' },
                position: 1
              },
              linesDecorationsClassName: 'diff-add-line-number'
            }
          });
        } else if (line.startsWith('-')) {
          decorations.push({
            range: new monaco.Range(currentLine, 1, currentLine, 1),
            options: {
              isWholeLine: true,
              className: 'diff-remove-line',
              glyphMarginClassName: 'diff-remove-glyph',
              glyphMarginHoverMessage: { value: 'Line to be removed' },
              minimap: {
                color: { id: 'diffEditor.removedLineBackground' },
                position: 1
              },
              linesDecorationsClassName: 'diff-remove-line-number'
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
          .diff-remove-line {
            background-color: rgba(220, 53, 69, 0.1) !important;
            border-left: 3px solid #dc3545 !important;
            text-decoration: line-through;
            opacity: 0.7;
          }
          .diff-remove-glyph {
            background-color: #dc3545;
            width: 3px !important;
            margin-left: 3px;
          }
          .diff-remove-line-number {
            color: #dc3545 !important;
          }
          .inline-fix-widget {
            background-color: #252526;
            border: 1px solid #454545;
            border-radius: 3px;
            padding: 8px;
            margin: 4px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          .inline-fix-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
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

      // Clean up any existing widgets before adding new ones
      if (currentWidget?.dispose) {
        currentWidget.dispose();
      }

      // Add the inline widget with the fix buttons
      const inlineWidget = {
        getId: () => 'inline-fix-widget',
        getDomNode: () => {
          const container = document.createElement('div');
          container.className = 'inline-fix-widget';
          container.innerHTML = `
            <div>${suggestion.suggestion}</div>
            <div class="inline-fix-actions">
              <button class="inline-fix-button inline-fix-apply" onclick="window.applyAiFix('${message.id}')">
                Apply Fix
              </button>
              <button class="inline-fix-button inline-fix-dismiss" onclick="window.dismissAiFix()">
                Dismiss
              </button>
            </div>
          `;
          return container;
        },
        getPosition: () => ({
          position: {
            lineNumber: Math.max(1, startLine),
            column: 1
          },
          preference: [
            monaco.editor.ContentWidgetPositionPreference.ABOVE,
            monaco.editor.ContentWidgetPositionPreference.EXACT
          ]
        })
      };

      // Apply new decorations and widget
      const decorationIds = editorInstance.deltaDecorations([], decorations);
      editorInstance.addContentWidget(inlineWidget);
      
      // Store references for cleanup
      setCurrentWidget({
        dispose: () => {
          editorInstance.deltaDecorations(decorationIds, []);
          editorInstance.removeContentWidget(inlineWidget);
        }
      } as monaco.editor.IOverlayWidget);

      // Reveal the relevant lines
      editorInstance.revealLinesInCenter(startLine, endLine);

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
