import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Tag,
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
  Layers,
  Tags,
  Hash,
  Lock,
  Unlock,
  FileJson,
  Database,
  Folder,
  FolderOpen,
  Activity,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APITagsProps {
  spec: any;
  className?: string;
}

interface TagProps {
  name: string;
  tag: any;
  operations: Array<{
    path: string;
    method: string;
    operation: any;
  }>;
}

const TagComponent: React.FC<TagProps> = ({
  name,
  tag,
  operations,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [copiedTag, setCopiedTag] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [expandedOperations, setExpandedOperations] = React.useState<Set<string>>(new Set());

  const handleCopyTag = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(tag, null, 2));
      setCopiedTag(true);
      setTimeout(() => setCopiedTag(false), 2000);
    } catch (error) {
      console.error('Failed to copy tag:', error);
    }
  };

  const toggleOperation = (operationId: string) => {
    setExpandedOperations(prev => {
      const next = new Set(prev);
      if (next.has(operationId)) {
        next.delete(operationId);
      } else {
        next.add(operationId);
      }
      return next;
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return <Eye className="w-3.5 h-3.5" />;
      case 'post':
        return <FileJson className="w-3.5 h-3.5" />;
      case 'put':
        return <ArrowRight className="w-3.5 h-3.5" />;
      case 'delete':
        return <Trash className="w-3.5 h-3.5" />;
      case 'patch':
        return <Tool className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all duration-200",
      isExpanded && "bg-muted/30",
      "hover:shadow-sm"
    )}>
      <div
        className={cn(
          'flex items-center gap-2 p-3 bg-card hover:bg-accent/50 cursor-pointer transition-colors',
          isExpanded && 'bg-accent/50'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0.5 transition-transform duration-200">
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform duration-200",
            isExpanded && "rotate-90"
          )} />
        </button>

        <Tags className="w-4 h-4 text-primary" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{name}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
              {operations.length}
            </span>
          </div>
          {tag.description && (
            <div className="text-sm text-muted-foreground truncate mt-0.5">
              {tag.description}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content={copiedTag ? 'Copied!' : 'Copy tag'}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyTag();
              }}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedTag ? (
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
                  View Schema
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
            {tag.description && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {tag.description}
                </p>
              </div>
            )}

            {/* Operations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Operations
                </h4>
                <div className="flex items-center gap-1">
                  <Tooltip content="Expand all">
                    <button
                      onClick={() => setExpandedOperations(new Set(operations.map(op => `${op.path}-${op.method}`)))}
                      className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Collapse all">
                    <button
                      onClick={() => setExpandedOperations(new Set())}
                      className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Tooltip>
                </div>
              </div>
              {operations.map(({ path, method, operation }) => {
                const operationId = `${path}-${method}`;
                const isOperationExpanded = expandedOperations.has(operationId);
                return (
                  <div
                    key={operationId}
                    className={cn(
                      "border rounded-md overflow-hidden transition-all duration-200",
                      isOperationExpanded && "bg-muted/30"
                    )}
                  >
                    <div
                      className="flex items-center gap-2 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleOperation(operationId)}
                    >
                      <button className="p-0.5 transition-transform duration-200">
                        <ChevronRight className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          isOperationExpanded && "rotate-90"
                        )} />
                      </button>
                      <div className={cn(
                        'flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md uppercase',
                        method === 'get' && 'bg-blue-500/10 text-blue-500',
                        method === 'post' && 'bg-green-500/10 text-green-500',
                        method === 'put' && 'bg-orange-500/10 text-orange-500',
                        method === 'delete' && 'bg-red-500/10 text-red-500',
                        method === 'patch' && 'bg-purple-500/10 text-purple-500',
                      )}>
                        {getMethodIcon(method)}
                        {method}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm truncate">{path}</div>
                        {operation.summary && (
                          <div className="text-sm text-muted-foreground truncate mt-0.5">
                            {operation.summary}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {operation.deprecated && (
                          <Tooltip content="Deprecated">
                            <AlertCircle className="w-4 h-4 text-warning" />
                          </Tooltip>
                        )}
                        {operation.security && operation.security.length > 0 && (
                          <Tooltip content="Requires authentication">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    {isOperationExpanded && (
                      <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-4 mt-2">
                          {/* Operation Description */}
                          {operation.description && (
                            <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                              <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm text-muted-foreground">
                                {operation.description}
                              </p>
                            </div>
                          )}

                          {/* Operation Metadata */}
                          <div className="flex flex-wrap gap-2">
                            {operation.deprecated && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md bg-warning/10 text-warning">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Deprecated
                              </div>
                            )}
                            {operation.security && operation.security.length > 0 && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md bg-primary/10 text-primary">
                                <Lock className="w-3.5 h-3.5" />
                                Requires Auth
                              </div>
                            )}
                            {operation.parameters && operation.parameters.length > 0 && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                                <Settings2 className="w-3.5 h-3.5" />
                                {operation.parameters.length} Parameters
                              </div>
                            )}
                            {operation.requestBody && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                                <FileJson className="w-3.5 h-3.5" />
                                Request Body
                              </div>
                            )}
                            {operation.responses && Object.keys(operation.responses).length > 0 && (
                              <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                                <ArrowRight className="w-3.5 h-3.5" />
                                {Object.keys(operation.responses).length} Responses
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* External Docs */}
            {tag.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  External Documentation
                </h4>
                <a
                  href={tag.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {tag.externalDocs.description || 'Learn more'}
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

export const APITags: React.FC<APITagsProps> = ({
  spec,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set(['other']));
  const [searchTerm, setSearchTerm] = React.useState('');

  // Group tags by category
  const tagsByCategory = React.useMemo(() => {
    const groups: Record<string, Record<string, {
      tag: any;
      operations: Array<{
        path: string;
        method: string;
        operation: any;
      }>;
    }>> = {
      other: {},
    };

    // First, collect all operations by tag
    const operationsByTag: Record<string, Array<{
      path: string;
      method: string;
      operation: any;
    }>> = {};

    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          if (method !== 'parameters' && method !== 'servers') {
            const tags = operation.tags || ['other'];
            tags.forEach((tag: string) => {
              if (!operationsByTag[tag]) {
                operationsByTag[tag] = [];
              }
              operationsByTag[tag].push({ path, method, operation });
            });
          }
        });
      });
    }

    // Then, organize tags into categories
    if (spec.tags) {
      spec.tags.forEach((tag: any) => {
        const category = tag['x-category'] || 'other';
        if (!groups[category]) {
          groups[category] = {};
        }
        groups[category][tag.name] = {
          tag,
          operations: operationsByTag[tag.name] || [],
        };
      });
    }

    // Add any remaining tags from operations
    Object.entries(operationsByTag).forEach(([tagName, operations]) => {
      let found = false;
      Object.values(groups).forEach(categoryTags => {
        if (categoryTags[tagName]) {
          found = true;
        }
      });
      if (!found) {
        groups.other[tagName] = {
          tag: { name: tagName },
          operations,
        };
      }
    });

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      Object.keys(groups).forEach(category => {
        groups[category] = Object.fromEntries(
          Object.entries(groups[category]).filter(([name, { tag, operations }]) =>
            name.toLowerCase().includes(term) ||
            tag.description?.toLowerCase().includes(term) ||
            operations.some(op =>
              op.path.toLowerCase().includes(term) ||
              op.operation.summary?.toLowerCase().includes(term) ||
              op.operation.description?.toLowerCase().includes(term)
            )
          )
        );
      });

      // Remove empty categories
      Object.keys(groups).forEach(category => {
        if (Object.keys(groups[category]).length === 0) {
          delete groups[category];
        }
      });
    }

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

  const totalTags = React.useMemo(() => {
    return Object.values(tagsByCategory).reduce(
      (total, tags) => total + Object.keys(tags).length,
      0
    );
  }, [tagsByCategory]);

  const totalOperations = React.useMemo(() => {
    return Object.values(tagsByCategory).reduce(
      (total, tags) => total + Object.values(tags).reduce(
        (tagTotal, { operations }) => tagTotal + operations.length,
        0
      ),
      0
    );
  }, [tagsByCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core':
        return <Database className="w-4 h-4" />;
      case 'admin':
        return <Settings2 className="w-4 h-4" />;
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'other':
        return <Hash className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Tags className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">API Tags</h2>
            <p className="text-sm text-muted-foreground">
              {totalTags} tag{totalTags !== 1 ? 's' : ''} with {totalOperations} operation{totalOperations !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tags and operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] h-9 pl-8 pr-3 rounded-md border bg-background/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {Object.entries(tagsByCategory).map(([category, tags]) => (
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
                  {category === 'other' ? 'Uncategorized' : category}
                </h3>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {Object.keys(tags).length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 ml-6 animate-in slide-in-from-top-2 duration-200">
                {Object.entries(tags).map(([name, { tag, operations }]) => (
                  <TagComponent
                    key={name}
                    name={name}
                    tag={tag}
                    operations={operations}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {Object.keys(tagsByCategory).length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No tags found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {searchTerm
                ? `No tags or operations match the search term "${searchTerm}"`
                : "This API doesn't have any tags defined in its specification."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default APITags; 