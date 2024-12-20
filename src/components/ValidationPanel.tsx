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
  Boxes,
  Sliders
} from "lucide-react";
import { Tooltip } from "./ui/TooltipComponent";
import { validationManager } from "../lib/validation";
import { ValidationSeverity } from "../lib/custom-rules";

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
  const [showRuleConfig, setShowRuleConfig] = React.useState(false);

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

  const handleRuleConfigChange = (ruleId: string, config: { enabled: boolean; severity: ValidationSeverity }) => {
    const configManager = validationManager.getConfigManager();
    configManager.updateRuleConfig(ruleId, config);
    validationManager.getRuleEngine().configureRule(ruleId, config);
  };

  const RuleConfigPanel = () => {
    const rules = validationManager.getRuleEngine().getRules();
    const configManager = validationManager.getConfigManager();

    return (
      <div className="p-4 border-l border-border bg-[#1e1e1e] w-80 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-sm text-zinc-200">Rule Configuration</h3>
          <button
            onClick={() => setShowRuleConfig(false)}
            className="p-1 rounded-sm hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          {rules.map(rule => {
            const config = configManager.getRuleConfig(rule.id);
            return (
              <div key={rule.id} className="space-y-2 p-3 rounded-md bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200">{rule.name}</h4>
                    <p className="text-xs text-zinc-400">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={config?.severity || rule.severity}
                      onChange={e => handleRuleConfigChange(rule.id, {
                        enabled: config?.enabled ?? true,
                        severity: e.target.value as ValidationSeverity
                      })}
                      className="text-xs rounded-md border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-zinc-200"
                    >
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                      <option value="info">Info</option>
                    </select>
                    <button
                      onClick={() => handleRuleConfigChange(rule.id, {
                        enabled: !(config?.enabled ?? true),
                        severity: config?.severity || rule.severity
                      })}
                      className={cn(
                        "p-1 rounded-md transition-colors",
                        config?.enabled ?? true
                          ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
                      )}
                    >
                      {config?.enabled ?? true ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {rule.options && Object.entries(rule.options).length > 0 && (
                  <div className="pl-4 border-l-2 border-zinc-800 space-y-2 mt-3">
                    {Object.entries(rule.options).map(([key, option]) => (
                      <div key={key} className="flex items-center justify-between gap-4">
                        <div>
                          <h5 className="text-xs font-medium text-zinc-300">{key}</h5>
                          <p className="text-xs text-zinc-500">{option.description}</p>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8 bg-[#1e1e1e]">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-12 h-12">
            <Loader2 className="absolute inset-0 h-12 w-12 text-blue-500/20 animate-spin" />
            <Loader2 className="absolute inset-0 h-12 w-12 text-blue-500 animate-spin-slow" />
          </div>
          <p className="text-sm text-zinc-400 animate-pulse">
            Validating specification...
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full p-8 bg-[#1e1e1e]", className)}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto animate-in zoom-in-50 duration-500">
            <Sparkles className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="animate-in fade-in-50 duration-500 delay-200">
            <h3 className="font-medium mb-1 text-zinc-200">No issues found</h3>
            <p className="text-sm text-zinc-400">
              Your API specification looks good!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full bg-[#1e1e1e]", className)}>
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-zinc-200">Problems</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Bug className="h-3 w-3 text-red-400" />
                {stats.errors}
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                {stats.warnings}
              </span>
              <span className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3 text-blue-400" />
                {stats.info}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip content="Configure Rules">
              <button
                onClick={() => setShowRuleConfig(!showRuleConfig)}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  showRuleConfig
                    ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
              >
                <Sliders className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
            <div className="h-4 w-px bg-zinc-800" />
            <button
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-2 border-b border-zinc-800 bg-zinc-900/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={cn(
                "w-full h-7 pl-7 pr-3 text-xs rounded-md border border-zinc-800 bg-zinc-900/50",
                "focus:outline-none focus:ring-1 focus:ring-blue-500/50",
                "placeholder:text-zinc-500 text-zinc-200",
                "transition-colors duration-200"
              )}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-2 py-1 text-xs rounded-md transition-all duration-200",
                filter === "all"
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter("errors")}
              className={cn(
                "px-2 py-1 text-xs rounded-md transition-all duration-200 flex items-center gap-1",
                filter === "errors"
                  ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  : "text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
              )}
            >
              <Bug className="h-3 w-3" />
              <span>{stats.errors}</span>
            </button>
            <button
              onClick={() => setFilter("warnings")}
              className={cn(
                "px-2 py-1 text-xs rounded-md transition-all duration-200 flex items-center gap-1",
                filter === "warnings"
                  ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                  : "text-zinc-400 hover:text-yellow-400 hover:bg-yellow-500/10"
              )}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>{stats.warnings}</span>
            </button>
            <button
              onClick={() => setFilter("info")}
              className={cn(
                "px-2 py-1 text-xs rounded-md transition-all duration-200 flex items-center gap-1",
                filter === "info"
                  ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  : "text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10"
              )}
            >
              <Lightbulb className="h-3 w-3" />
              <span>{stats.info}</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map(message => {
            const isExpanded = expandedMessages.includes(message.id);
            return (
              <div
                key={message.id}
                className={cn(
                  "group border-l-2 transition-all duration-200",
                  message.type === "error"
                    ? "border-l-red-500/50"
                    : message.type === "warning"
                    ? "border-l-yellow-500/50"
                    : "border-l-blue-500/50",
                  isExpanded ? "bg-zinc-800/30" : "hover:bg-zinc-800/30"
                )}
              >
                <div className="flex items-start px-3 py-2">
                  <button
                    onClick={() => toggleMessage(message.id)}
                    className="flex-1 text-left flex items-start gap-3 min-w-0 group/message"
                  >
                    <div className="pt-0.5">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-200 break-all">{message.message}</span>
                      </div>
                      {message.path && (
                        <div className="flex items-center gap-2 mt-1">
                          <FileCode className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                          <span className="text-xs font-mono text-zinc-400 truncate">
                            {message.path}
                          </span>
                          {message.line && (
                            <>
                              <ArrowRight className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                              <span className="text-xs text-zinc-400 flex-shrink-0">
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
                        "h-4 w-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 opacity-0 group-hover/message:opacity-100",
                        isExpanded && "rotate-90 opacity-100"
                      )}
                    />
                  </button>
                  <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {message.source && (
                      <Tooltip content={copiedId === message.id ? 'Copied!' : 'Copy source'}>
                        <button
                          onClick={() => copySource(message.source!, message.id)}
                          className="p-1 rounded-sm hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200 transition-colors"
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
                          className="p-1 rounded-sm hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </Tooltip>
                      {showMessageMenu === message.id && (
                        <div className="absolute right-0 mt-1 w-48 rounded-md border border-zinc-700 bg-zinc-800/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                          <button
                            onClick={() => {
                              setShowMessageMenu(null);
                              // TODO: Implement share functionality
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-sm text-zinc-200 hover:bg-zinc-700/80 transition-colors"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            Share
                          </button>
                          <button
                            onClick={() => {
                              setShowMessageMenu(null);
                              // TODO: Implement view schema functionality
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-sm text-zinc-200 hover:bg-zinc-700/80 transition-colors"
                          >
                            <FileJson className="h-3.5 w-3.5" />
                            View Schema
                          </button>
                          <button
                            onClick={() => {
                              setShowMessageMenu(null);
                              // TODO: Implement fix functionality
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded-sm text-zinc-200 hover:bg-zinc-700/80 transition-colors"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Quick Fix...
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded && message.source && (
                  <div className="px-10 pb-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                      <pre className="p-3 rounded-md bg-zinc-900 font-mono text-xs overflow-x-auto text-zinc-200">
                        {message.source}
                      </pre>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <Tooltip content={copiedId === message.id ? 'Copied!' : 'Copy source'}>
                          <button
                            onClick={() => copySource(message.source!, message.id)}
                            className="p-1 rounded-md hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors"
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
                            <button className="p-1 rounded-md hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors">
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

      {/* Rule Configuration Panel */}
      {showRuleConfig && <RuleConfigPanel />}
    </div>
  );
};

export default ValidationPanel;
