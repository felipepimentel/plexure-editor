import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Globe,
  Server,
  Settings,
  Check,
  Search,
  Filter,
  MoreVertical,
  Share2,
  Code2,
  Braces,
  FileText,
  Settings2,
  Sparkles,
  Lightbulb,
  Bug,
  Boxes,
  Box,
  ArrowRight,
  AlertCircle,
  Info,
  Link2,
  Eye,
  EyeOff,
  List,
  LayoutGrid,
  Network,
  Cloud,
  CloudOff,
  Laptop,
  Workflow,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APIServersProps {
  spec: any;
  environment?: any;
  onServerChange?: (server: any) => void;
  className?: string;
}

interface ServerProps {
  server: any;
  isActive?: boolean;
  onSelect?: () => void;
  category?: string;
}

const ServerComponent: React.FC<ServerProps> = ({
  server,
  isActive,
  onSelect,
  category
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [variables, setVariables] = React.useState<Record<string, string>>({});
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleCopyUrl = async () => {
    try {
      let url = server.url;
      Object.entries(variables).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, value);
      });
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getServerIcon = () => {
    if (server.url.startsWith('https://localhost') || server.url.startsWith('http://localhost')) {
      return <Laptop className="w-4 h-4 text-warning" />;
    }
    if (server.url.startsWith('https://')) {
      return <Cloud className="w-4 h-4 text-success" />;
    }
    if (server.url.startsWith('http://')) {
      return <CloudOff className="w-4 h-4 text-destructive" />;
    }
    return <Network className="w-4 h-4 text-primary" />;
  };

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all duration-200",
      isActive ? "ring-2 ring-primary" : "hover:shadow-sm",
      isExpanded && "bg-muted/30"
    )}>
      <div
        className={cn(
          'flex items-center gap-2 p-3 bg-card hover:bg-accent/50 cursor-pointer transition-colors',
          isActive && 'bg-accent/50'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0.5 transition-transform duration-200">
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform duration-200",
            isExpanded && "rotate-90"
          )} />
        </button>

        {getServerIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">
              {server.description || 'Server'}
            </span>
            {category && (
              <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                {category}
              </span>
            )}
            {server.path && (
              <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                {server.path}
              </span>
            )}
            {server.method && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-md text-[10px] font-medium uppercase",
                server.method === 'get' && "bg-blue-500/10 text-blue-500",
                server.method === 'post' && "bg-green-500/10 text-green-500",
                server.method === 'put' && "bg-orange-500/10 text-orange-500",
                server.method === 'delete' && "bg-red-500/10 text-red-500"
              )}>
                {server.method}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground font-mono truncate mt-0.5">
            {server.url}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onSelect && (
            <Tooltip content={isActive ? 'Current server' : 'Select server'}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={cn(
                  'p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors',
                  isActive && 'bg-primary/10 text-primary'
                )}
              >
                <Settings className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
          <Tooltip content={copiedUrl ? 'Copied!' : 'Copy URL'}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyUrl();
              }}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedUrl ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
          <div className="relative">
            <Tooltip content="More actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </Tooltip>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  View Config
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {/* Description */}
            {server.description && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {server.description}
                </p>
              </div>
            )}

            {/* Variables */}
            {server.variables && Object.keys(server.variables).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Variables
                </h4>
                <div className="space-y-3">
                  {Object.entries(server.variables).map(([name, variable]: [string, any]) => (
                    <div key={name} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={`var-${name}`}
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <span>{name}</span>
                          {variable.description && (
                            <Tooltip content={variable.description}>
                              <Info className="w-3.5 h-3.5 text-muted-foreground" />
                            </Tooltip>
                          )}
                        </label>
                        {variable.default && (
                          <span className="text-xs text-muted-foreground">
                            Default: {variable.default}
                          </span>
                        )}
                      </div>
                      <select
                        id={`var-${name}`}
                        value={variables[name] || variable.default}
                        onChange={(e) => handleVariableChange(name, e.target.value)}
                        className={cn(
                          "w-full h-9 px-3 rounded-md border bg-background text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-primary/50",
                          "transition-colors duration-200"
                        )}
                      >
                        {variable.enum ? (
                          variable.enum.map((value: string) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))
                        ) : (
                          <option value={variable.default}>
                            {variable.default}
                          </option>
                        )}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Docs */}
            {server.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  External Documentation
                </h4>
                <a
                  href={server.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {server.externalDocs.description || 'Learn more'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const APIServers: React.FC<APIServersProps> = ({
  spec,
  environment,
  onServerChange,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set(['global']));
  const [searchTerm, setSearchTerm] = React.useState('');

  // Group servers by category (using first tag or 'Other')
  const serversByCategory = React.useMemo(() => {
    const groups: Record<string, any[]> = {
      global: [],
      paths: [],
      operations: [],
    };

    // Global servers
    if (spec.servers) {
      groups.global = spec.servers;
    }

    // Path-level servers
    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
        if (pathItem.servers) {
          groups.paths.push(...pathItem.servers.map((server: any) => ({
            ...server,
            path,
          })));
        }
      });
    }

    // Operation-level servers
    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, pathItem]: [string, any]) => {
        Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
          if (method !== 'servers' && operation.servers) {
            groups.operations.push(...operation.servers.map((server: any) => ({
              ...server,
              path,
              method,
            })));
          }
        });
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      Object.keys(groups).forEach(category => {
        groups[category] = groups[category].filter(server =>
          server.url.toLowerCase().includes(term) ||
          server.description?.toLowerCase().includes(term)
        );
      });
    }

    // Remove empty categories
    Object.keys(groups).forEach(category => {
      if (groups[category].length === 0) {
        delete groups[category];
      }
    });

    return groups;
  }, [spec, searchTerm]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const totalServers = React.useMemo(() => {
    return Object.values(serversByCategory).reduce(
      (total, servers) => total + servers.length,
      0
    );
  }, [serversByCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'global':
        return <Globe className="w-4 h-4" />;
      case 'paths':
        return <Workflow className="w-4 h-4" />;
      case 'operations':
        return <Layers className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Network className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">API Servers</h2>
            <p className="text-sm text-muted-foreground">
              {totalServers} server{totalServers !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search servers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px] h-9 pl-8 pr-3 rounded-md border bg-background/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {Object.entries(serversByCategory).map(([category, servers]) => (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className={cn(
                "flex items-center gap-2 w-full text-left p-2 rounded-md transition-all duration-200",
                "hover:shadow-sm",
                expandedCategories.has(category)
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
            >
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-200",
                expandedCategories.has(category) && "rotate-90"
              )} />
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <h3 className="text-sm font-medium capitalize">
                  {category === 'global' ? 'Global Servers' : `${category} Servers`}
                </h3>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {servers.length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 ml-6 animate-in slide-in-from-top-2 duration-200">
                {servers.map((server, index) => (
                  <ServerComponent
                    key={`${server.url}-${index}`}
                    server={server}
                    isActive={environment?.server?.url === server.url}
                    onSelect={() => onServerChange?.(server)}
                    category={category !== 'global' ? category : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {Object.keys(serversByCategory).length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No servers found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {searchTerm
                ? `No servers match the search term "${searchTerm}"`
                : "This API doesn't have any servers defined in its specification."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIServers; 