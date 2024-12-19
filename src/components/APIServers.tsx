import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Globe,
  Server,
  Settings,
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
}

const ServerComponent: React.FC<ServerProps> = ({
  server,
  isActive,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [variables, setVariables] = React.useState<Record<string, string>>({});

  const handleCopyUrl = () => {
    let url = server.url;
    Object.entries(variables).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
    navigator.clipboard.writeText(url);
  };

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className={cn(
          'flex items-center gap-2 p-3 bg-card hover:bg-accent/50 cursor-pointer',
          isActive && 'bg-accent'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0.5">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <Server className="w-4 h-4" />
        <div className="flex-1">
          <div className="font-medium">
            {server.description || 'Server'}
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {server.url}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onSelect && (
            <Tooltip content="Select server">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className={cn(
                  'p-1.5 rounded-md hover:bg-accent',
                  isActive && 'bg-primary text-primary-foreground'
                )}
              >
                <Settings className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
          <Tooltip content="Copy URL">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyUrl();
              }}
              className="p-1.5 rounded-md hover:bg-accent"
            >
              <Copy className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50">
          <div className="space-y-4">
            {/* Description */}
            {server.description && (
              <p className="text-sm text-muted-foreground">
                {server.description}
              </p>
            )}

            {/* Variables */}
            {server.variables && Object.keys(server.variables).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Variables</h4>
                <div className="space-y-3">
                  {Object.entries(server.variables).map(([name, variable]: [string, any]) => (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={`var-${name}`}
                          className="text-sm font-medium"
                        >
                          {name}
                        </label>
                        {variable.description && (
                          <Tooltip content={variable.description}>
                            <div className="text-xs text-muted-foreground">
                              ?
                            </div>
                          </Tooltip>
                        )}
                      </div>
                      <select
                        id={`var-${name}`}
                        value={variables[name] || variable.default}
                        onChange={(e) => handleVariableChange(name, e.target.value)}
                        className="w-full px-2 py-1 rounded-md border bg-background"
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
                <h4 className="text-sm font-medium mb-2">External Documentation</h4>
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
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

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

    return groups;
  }, [spec]);

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

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(serversByCategory).map(([category, servers]) => (
        servers.length > 0 && (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-accent/50"
            >
              {expandedCategories.has(category) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <h3 className="text-lg font-medium capitalize">
                {category === 'global' ? 'Global Servers' :
                 category === 'paths' ? 'Path-Level Servers' :
                 'Operation-Level Servers'}
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {servers.length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 ml-6">
                {servers.map((server, index) => (
                  <ServerComponent
                    key={index}
                    server={server}
                    isActive={environment?.server === server.url}
                    onSelect={onServerChange ? () => onServerChange(server) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
}; 