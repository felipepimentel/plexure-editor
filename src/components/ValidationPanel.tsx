import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  Filter,
  Info,
  Lightbulb,
  Loader2,
  Search,
  Sparkles,
  Wand2,
  X,
  XCircle
} from "lucide-react";
import React from "react";
import { parse, stringify } from "yaml";
import { aiFixService, AiFixSuggestion } from "../lib/ai-fix";
import { AutoFixer } from "../lib/auto-fix";
import { ValidationSeverity } from "../lib/custom-rules";
import { ValidationMessage } from "../lib/types";
import { cn } from "../lib/utils";
import { validationManager } from "../lib/validation";
import { Tooltip } from "./ui/TooltipComponent";

interface ValidationPanelProps {
  messages?: ValidationMessage[];
  className?: string;
  isLoading?: boolean;
  onApplyFix?: (newContent: string) => void;
  currentContent?: string;
}

type FilterType = "all" | "errors" | "warnings" | "info";

interface GroupedMessages {
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  groupId: string;
  pathInfo: {
    fullPath: string;
    method: string;
    endpoint: string;
  };
}

interface FilteredGroup {
  path: string;
  messages: ValidationMessage[];
  type: 'error' | 'warning';
  groupId: string;
  pathInfo: {
    fullPath: string;
    method: string;
    endpoint: string;
  };
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  messages = [],
  className,
  isLoading = false,
  onApplyFix,
  currentContent
}) => {
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [search, setSearch] = React.useState("");
  const [selectedMessage, setSelectedMessage] = React.useState<ValidationMessage | null>(null);
  const [isFixing, setIsFixing] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const autoFixer = React.useMemo(() => new AutoFixer(), []);
  const [isAiFixing, setIsAiFixing] = React.useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = React.useState<Record<string, AiFixSuggestion>>({});

  // Deduplicate and group messages by unique path and message
  const groupedMessages = React.useMemo(() => {
    const uniqueMessages = new Map<string, ValidationMessage>();
    
    // First, deduplicate messages by combining path and message text
    messages.forEach(message => {
      const key = `${message.path}-${message.message}`;
      if (!uniqueMessages.has(key)) {
        uniqueMessages.set(key, message);
      }
    });

    // Then group by path
    const groups = new Map<string, GroupedMessages>();
    
    uniqueMessages.forEach(message => {
      const pathParts = message.path?.split('/') || [];
      const method = pathParts.pop() || '';
      const endpoint = pathParts.join('/');
      const basePath = endpoint || 'global';
      const groupId = `${basePath}-${method}-${message.type}`;
      
      if (!groups.has(basePath)) {
        groups.set(basePath, { 
          errors: [], 
          warnings: [], 
          groupId,
          pathInfo: {
            fullPath: message.path || '',
            method,
            endpoint
          }
        });
      }
      
      const group = groups.get(basePath)!;
      if (message.type === 'error') {
        group.errors.push(message);
      } else if (message.type === 'warning') {
        group.warnings.push(message);
      }
    });
    
    return groups;
  }, [messages]);

  // Filter and sort groups
  const filteredGroups = React.useMemo(() => {
    const result: FilteredGroup[] = [];

    groupedMessages.forEach((group, path) => {
      if (filter === 'errors' || filter === 'all') {
        if (group.errors.length > 0) {
          result.push({
            path,
            messages: group.errors,
            type: 'error',
            groupId: `${group.groupId}-errors`,
            pathInfo: group.pathInfo
          });
        }
      }
      
      if (filter === 'warnings' || filter === 'all') {
        if (group.warnings.length > 0) {
          result.push({
            path,
            messages: group.warnings,
            type: 'warning',
            groupId: `${group.groupId}-warnings`,
            pathInfo: group.pathInfo
          });
        }
      }
    });

    // Sort by severity and then by path
    return result.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'error' ? -1 : 1;
      }
      return a.path.localeCompare(b.path);
    });
  }, [groupedMessages, filter]);

  // Calculate stats from deduplicated messages
  const stats = React.useMemo(() => {
    const uniqueMessages = new Map<string, ValidationMessage>();
    
    messages.forEach(message => {
      const key = `${message.path}-${message.message}`;
      if (!uniqueMessages.has(key)) {
        uniqueMessages.set(key, message);
      }
    });

    const deduplicatedMessages = Array.from(uniqueMessages.values());
    
    return {
      errors: deduplicatedMessages.filter(m => m.type === "error").length,
      warnings: deduplicatedMessages.filter(m => m.type === "warning").length,
      info: deduplicatedMessages.filter(m => m.type === "info").length
    };
  }, [messages]);

  const getMessageIcon = (type: ValidationMessage["type"]) => {
    switch (type) {
      case "error":
        return <Bug className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Lightbulb className="h-4 w-4 text-info" />;
    }
  };

  const handleRuleConfigChange = (ruleId: string, config: { enabled: boolean; severity: ValidationSeverity }) => {
    const configManager = validationManager.getConfigManager();
    configManager.updateRuleConfig(ruleId, config);
    validationManager.getRuleEngine().configureRule(ruleId, config);
  };

  const handleApplyFix = async (message: ValidationMessage) => {
    if (!currentContent || !onApplyFix) return;

    try {
      setIsFixing(true);
      const spec = parse(currentContent);
      const fixResult = autoFixer.fix(spec, message);

      if (fixResult.fixed) {
        const newContent = JSON.stringify(fixResult.spec, null, 2);
        onApplyFix(newContent);
        console.log('Applied fixes:', fixResult.changes);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Failed to apply fix:', error);
    } finally {
      setIsFixing(false);
    }
  };

  const handleApplyAllFixes = async () => {
    if (!currentContent || !onApplyFix) return;

    try {
      setIsFixing(true);
      const spec = parse(currentContent);
      const fixResult = autoFixer.fixAll(spec, messages);

      if (fixResult.fixed) {
        const newContent = JSON.stringify(fixResult.spec, null, 2);
        onApplyFix(newContent);
        console.log('Applied all fixes:', fixResult.changes);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Failed to apply fixes:', error);
    } finally {
      setIsFixing(false);
    }
  };

  const handleAiFix = async (message: ValidationMessage) => {
    if (!currentContent || !onApplyFix) {
      console.log('Missing required props:', { currentContent: !!currentContent, onApplyFix: !!onApplyFix });
      return;
    }

    try {
      setIsAiFixing(message.id);
      console.log('Getting AI suggestion for:', message);
      
      let spec;
      try {
        spec = parse(currentContent);
        console.log('Parsed spec:', spec);
      } catch (parseError) {
        console.error('Failed to parse current content:', parseError);
        setAiSuggestions(prev => ({
          ...prev,
          [message.id]: {
            suggestion: "Failed to parse OpenAPI specification. Please ensure it's valid YAML.",
            fix: { path: "", oldValue: {}, newValue: {} },
            error: true
          }
        }));
        return;
      }
      
      const suggestion = await aiFixService.getSuggestion(spec, message);
      console.log('Got suggestion:', suggestion);
      
      // Update suggestions with the validated suggestion
      setAiSuggestions(prev => ({
        ...prev,
        [message.id]: suggestion
      }));

    } catch (err) {
      const error = err as Error;
      console.error('Failed to get AI suggestion:', error);
      setAiSuggestions(prev => ({
        ...prev,
        [message.id]: {
          suggestion: `An error occurred while generating the fix: ${error.message}`,
          fix: { path: "", oldValue: {}, newValue: {} },
          error: true
        }
      }));
    } finally {
      setIsAiFixing(null);
    }
  };

  const applyAiFix = async (message: ValidationMessage) => {
    if (!currentContent || !onApplyFix) return;

    const suggestion = aiSuggestions[message.id];
    if (!suggestion || suggestion.error) return;

    try {
      const spec = parse(currentContent);
      const updatedSpec = await aiFixService.applyFix(spec, suggestion.fix);
      const newContent = stringify(updatedSpec);
      onApplyFix(newContent);
      dismissAiSuggestion(message.id);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to apply fix:', error);
      setAiSuggestions(prev => ({
        ...prev,
        [message.id]: {
          ...prev[message.id],
          error: true,
          suggestion: `Failed to apply fix: ${error.message}`
        }
      }));
    }
  };

  const handleApplyAiFix = async (messageId: string) => {
    dismissAiSuggestion(messageId);
  };

  const dismissAiSuggestion = (messageId: string) => {
    setAiSuggestions(prev => {
      const next = { ...prev };
      delete next[messageId];
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col h-full bg-background min-w-[300px]", className)}>
      {/* Enhanced Header */}
      <div className="flex flex-col border-b">
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-muted/5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Bug className="h-4 w-4 text-muted-foreground" />
              Problems
              {(stats.errors > 0 || stats.warnings > 0) && (
                <span className="text-xs font-medium text-muted-foreground">
                  ({stats.errors + stats.warnings})
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              {stats.errors > 0 && (
                <span key="error-badge" className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                  <Bug className="h-3.5 w-3.5" />
                  {stats.errors} {stats.errors === 1 ? 'Error' : 'Errors'}
                </span>
              )}
              {stats.warnings > 0 && (
                <span key="warning-badge" className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {stats.warnings} {stats.warnings === 1 ? 'Warning' : 'Warnings'}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter problems..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-40 sm:w-48 h-8 pl-8 pr-3 text-xs bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Tooltip content="Filter by type">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "h-8 px-2.5 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
                  showFilters ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">
                  {filter === 'all' ? 'All Problems' : filter === 'errors' ? 'Errors Only' : 'Warnings Only'}
                </span>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Enhanced Filter Menu */}
        {showFilters && (
          <div className="p-1.5 border-t bg-muted/5">
            <div className="flex gap-1.5">
              <button
                key="filter-all"
                onClick={() => setFilter('all')}
                className={cn(
                  "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  filter === 'all' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                All Problems
              </button>
              <button
                key="filter-errors"
                onClick={() => setFilter('errors')}
                className={cn(
                  "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5",
                  filter === 'errors' 
                    ? "bg-red-500/15 text-red-400 border border-red-500/30" 
                    : "hover:bg-red-500/10 hover:text-red-400"
                )}
              >
                <Bug className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Errors Only</span>
                <span className="sm:hidden">Errors</span>
              </button>
              <button
                key="filter-warnings"
                onClick={() => setFilter('warnings')}
                className={cn(
                  "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5",
                  filter === 'warnings' 
                    ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" 
                    : "hover:bg-yellow-500/10 hover:text-yellow-400"
                )}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Warnings Only</span>
                <span className="sm:hidden">Warnings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="relative">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />
                <div className="relative border-2 border-primary/40 rounded-full p-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
              <span className="text-sm">Validating specification...</span>
            </div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3 border border-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-green-500">All Clear!</p>
              <p className="text-xs text-muted-foreground mt-1.5">
                No problems found in your specification
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {filteredGroups.map((group) => (
              <div
                key={group.groupId}
                className={cn(
                  "group rounded-lg border bg-card overflow-hidden transition-all hover:shadow-sm",
                  group.type === 'error' 
                    ? "border-red-500/30 hover:border-red-500/40" 
                    : "border-yellow-500/30 hover:border-yellow-500/40"
                )}
              >
                {/* Enhanced Group Header */}
                <div className={cn(
                  "flex items-center gap-3 px-4 py-2 border-b bg-muted/5",
                  group.type === 'error' 
                    ? "border-red-500/20" 
                    : "border-yellow-500/20"
                )}>
                  <div className="flex-shrink-0">
                    {group.type === 'error' ? (
                      <div className="p-1 rounded-md bg-red-500/15">
                        <Bug className="h-4 w-4 text-red-400" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-md bg-yellow-500/15">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {group.path === 'global' ? 'Global Issues' : (
                        <span className="font-mono">
                          {group.pathInfo.endpoint}
                          {group.pathInfo.method && (
                            <span className="text-muted-foreground">/{group.pathInfo.method}</span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full border",
                      group.type === 'error' 
                        ? "bg-red-500/15 text-red-400 border-red-500/30" 
                        : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                    )}>
                      {group.messages.length}
                    </span>
                  </div>
                </div>

                {/* Enhanced Messages */}
                <div className="divide-y divide-border/50">
                  {group.messages.map((message) => (
                    <div
                      key={`${group.groupId}-message-${message.id || Math.random().toString(36).slice(2)}`}
                      className="group/message relative p-4 hover:bg-muted/5 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed">
                            {message.message}
                          </p>
                          {message.path && (
                            <p key={`path-${message.id}`} className="mt-2 text-xs text-muted-foreground font-mono flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-muted/50 border">
                                {message.path.split('/').pop()}
                              </span>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                          {message.type === "error" && (
                            <Tooltip key={`tooltip-${message.id}`} content={isAiFixing === message.id ? "Generating fix..." : "Fix with AI"}>
                              <button
                                key={`fix-button-${message.id}`}
                                onClick={() => handleAiFix(message)}
                                disabled={isAiFixing === message.id}
                                className={cn(
                                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                  isAiFixing === message.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/10 hover:bg-primary/20 text-primary"
                                )}
                              >
                                {isAiFixing === message.id ? (
                                  <div key={`fixing-${message.id}`} className="flex items-center gap-1.5">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Generating Fix...
                                  </div>
                                ) : (
                                  <div key={`fix-content-${message.id}`} className="flex items-center gap-1.5">
                                    <Wand2 className="h-3.5 w-3.5" />
                                    Fix with AI
                                  </div>
                                )}
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {/* Enhanced AI Suggestion */}
                      {aiSuggestions[message.id] && (
                        <div 
                          key={`suggestion-${message.id}`}
                          className={cn(
                            "mt-3 rounded-lg border p-4",
                            aiSuggestions[message.id].error
                              ? "border-destructive/20 bg-destructive/5"
                              : "border-primary/20 bg-primary/5"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 pt-0.5">
                              {aiSuggestions[message.id].error ? (
                                <div className="p-1 rounded-md bg-destructive/10">
                                  <XCircle key={`error-icon-${message.id}`} className="h-4 w-4 text-destructive" />
                                </div>
                              ) : (
                                <div className="p-1 rounded-md bg-primary/10">
                                  <Sparkles key={`success-icon-${message.id}`} className="h-4 w-4 text-primary" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <p key={`suggestion-text-${message.id}`} className="text-sm leading-relaxed">
                                {aiSuggestions[message.id].suggestion}
                              </p>
                              {aiSuggestions[message.id].preview && !aiSuggestions[message.id].error && (
                                <div key={`preview-${message.id}`} className="space-y-2">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Info className="h-3.5 w-3.5" />
                                    <span>Proposed Changes:</span>
                                  </div>
                                  <pre className="p-3 rounded-md bg-muted/50 text-xs font-mono overflow-x-auto border">
                                    {aiSuggestions[message.id].preview}
                                  </pre>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                {!aiSuggestions[message.id].error && (
                                  <button
                                    key={`apply-${message.id}`}
                                    onClick={() => applyAiFix(message)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Apply Changes
                                  </button>
                                )}
                                <button
                                  key={`dismiss-${message.id}`}
                                  onClick={() => dismissAiSuggestion(message.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-medium transition-colors"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Export as default
export default ValidationPanel;
