import React from "react";
import { cn } from "../lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  Filter,
  Search,
  ChevronRight,
  ExternalLink,
  Copy,
  Loader2,
  FileCode,
  ArrowRight,
  Check,
  MoreVertical,
  Share2,
  Code2,
  FileJson,
  FileText,
  Settings2,
  Sparkles,
  Lightbulb,
  Bug,
  Braces,
  Boxes
} from "lucide-react";
import { Tooltip } from "./ui/TooltipComponent";

interface ValidationMessage {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  path?: string;
  line?: number;
  column?: number;
  source?: string;
}

interface ValidationPanelProps {
  messages?: ValidationMessage[];
  className?: string;
  isLoading?: boolean;
}

type FilterType = "all" | "errors" | "warnings" | "info";

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  messages = [],
  className,
  isLoading = false
}) => {
  const [filter, setFilter] = React.useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [expandedMessages, setExpandedMessages] = React.useState<string[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [showMessageMenu, setShowMessageMenu] = React.useState<string | null>(null);

  const toggleMessage = (id: string) => {
    setExpandedMessages(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const copySource = async (source: string, id: string) => {
    try {
      await navigator.clipboard.writeText(source);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy source:', error);
    }
  };

  const filteredMessages = React.useMemo(() => {
    let filtered = [...messages];
    if (filter !== "all") {
      filtered = filtered.filter(msg => msg.type === filter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        msg =>
          msg.message.toLowerCase().includes(term) ||
          msg.path?.toLowerCase().includes(term) ||
          msg.source?.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [messages, filter, searchTerm]);

  const stats = React.useMemo(
    () => ({
      errors: messages.filter(m => m.type === "error").length,
      warnings: messages.filter(m => m.type === "warning").length,
      info: messages.filter(m => m.type === "info").length
    }),
    [messages]
  );

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <Loader2 className="absolute inset-0 h-12 w-12 text-primary/20 animate-spin" />
            <Loader2 className="absolute inset-0 h-12 w-12 text-primary animate-spin-slow" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Validating specification...
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full p-8", className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto animate-in zoom-in-50 duration-500">
            <Sparkles className="h-6 w-6 text-success" />
          </div>
          <div className="animate-in fade-in-50 duration-500 delay-200">
            <h3 className="font-medium mb-1">No issues found</h3>
            <p className="text-sm text-muted-foreground">
              Your API specification looks good!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Filters */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-all duration-200",
              "hover:shadow-sm",
              filter === "all"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("errors")}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-all duration-200",
              "hover:shadow-sm flex items-center gap-1.5",
              filter === "errors"
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            )}
          >
            <Bug className="h-3 w-3" />
            {stats.errors}
          </button>
          <button
            onClick={() => setFilter("warnings")}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-all duration-200",
              "hover:shadow-sm flex items-center gap-1.5",
              filter === "warnings"
                ? "bg-warning/10 text-warning hover:bg-warning/20"
                : "text-muted-foreground hover:text-warning hover:bg-warning/10"
            )}
          >
            <AlertTriangle className="h-3 w-3" />
            {stats.warnings}
          </button>
          <button
            onClick={() => setFilter("info")}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md transition-all duration-200",
              "hover:shadow-sm flex items-center gap-1.5",
              filter === "info"
                ? "bg-info/10 text-info hover:bg-info/20"
                : "text-muted-foreground hover:text-info hover:bg-info/10"
            )}
          >
            <Lightbulb className="h-3 w-3" />
            {stats.info}
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={cn(
              "w-[180px] h-8 pl-7 pr-3 text-xs rounded-md border bg-background/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              "placeholder:text-muted-foreground",
              "transition-colors duration-200"
            )}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filteredMessages.map(message => {
          const isExpanded = expandedMessages.includes(message.id);
          return (
            <div
              key={message.id}
              className={cn(
                "group border-l-2 transition-all duration-200",
                message.type === "error"
                  ? "border-l-destructive/50"
                  : message.type === "warning"
                  ? "border-l-warning/50"
                  : "border-l-info/50",
                isExpanded ? "bg-muted/30" : "hover:bg-muted/30"
              )}
            >
              <div className="flex items-center px-3 py-2">
                <button
                  onClick={() => toggleMessage(message.id)}
                  className="flex-1 text-left flex items-start gap-3"
                >
                  {getMessageIcon(message.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{message.message}</span>
                    </div>
                    {message.path && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <FileCode className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">
                          {message.path}
                        </span>
                        {message.line && (
                          <>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Line {message.line}
                              {message.column && `, Column ${message.column}`}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-90"
                    )}
                  />
                </button>
                <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {message.source && (
                    <Tooltip content={copiedId === message.id ? 'Copied!' : 'Copy source'}>
                      <button
                        onClick={() => copySource(message.source!, message.id)}
                        className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </Tooltip>
                  )}
                  <div className="relative">
                    <Tooltip content="More actions">
                      <button
                        onClick={() => setShowMessageMenu(showMessageMenu === message.id ? null : message.id)}
                        className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </Tooltip>
                    {showMessageMenu === message.id && (
                      <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                        <button
                          onClick={() => setShowMessageMenu(null)}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          Share
                        </button>
                        <button
                          onClick={() => setShowMessageMenu(null)}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                        >
                          <FileJson className="h-3.5 w-3.5" />
                          View Schema
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isExpanded && message.source && (
                <div className="px-10 pb-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="relative">
                    <pre className="p-3 rounded-md bg-muted font-mono text-xs overflow-x-auto">
                      {message.source}
                    </pre>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <Tooltip content={copiedId === message.id ? 'Copied!' : 'Copy source'}>
                        <button
                          onClick={() => copySource(message.source, message.id)}
                          className="p-1 rounded-md hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </Tooltip>
                      {message.path && (
                        <Tooltip content="Go to source">
                          <button className="p-1 rounded-md hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </div>
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
