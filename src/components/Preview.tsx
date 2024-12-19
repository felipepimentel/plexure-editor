import React from 'react';
import { cn } from '../lib/utils';
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
  Zap,
  Globe,
  Mail,
  License,
  GitBranch,
  FileCode,
  BookOpen,
  HelpCircle,
  Terminal,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Key,
  Tool,
  Trash,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Loader2,
  FileType,
  Brackets,
  Regex,
  Binary,
  Table,
  Image,
  File,
  Paperclip,
  Maximize2,
  Minimize2,
  Send,
  Play,
  Pause,
  Square,
  RotateCw,
  Download,
  Upload,
  Sliders,
  Crosshair,
  Heading1,
  Heading2,
  ListOrdered,
  ListChecks,
  Fingerprint,
  Cookie,
  Webhook,
  Save,
  X
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface PreviewProps {
  className?: string;
  spec?: any;
  onClose?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface EndpointProps {
  method: string;
  path: string;
  operation: any;
  onToggle?: () => void;
  isExpanded?: boolean;
}

const methodColors: Record<string, string> = {
  get: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  post: 'bg-green-500/10 text-green-500 border-green-500/20',
  put: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  delete: 'bg-red-500/10 text-red-500 border-red-500/20',
  patch: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  options: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  head: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  trace: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const Endpoint: React.FC<EndpointProps> = ({
  method,
  path,
  operation,
  onToggle,
  isExpanded,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <div
        className="flex items-center p-4 bg-muted/30 cursor-pointer"
        onClick={onToggle}
      >
        <div
          className={cn(
            'px-2 py-1 rounded-md border text-xs font-medium uppercase mr-3',
            methodColors[method.toLowerCase()]
          )}
        >
          {method}
        </div>
        <div className="flex-1 font-mono text-sm">{path}</div>
        <div className="flex items-center gap-2">
          <Tooltip content={copied ? 'Copied!' : 'Copy Path'}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 border-t space-y-4">
          {/* Summary */}
          {operation.summary && (
            <div>
              <h3 className="text-sm font-medium mb-1">Summary</h3>
              <p className="text-sm text-muted-foreground">
                {operation.summary}
              </p>
            </div>
          )}

          {/* Description */}
          {operation.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {operation.description}
              </p>
            </div>
          )}

          {/* Parameters */}
          {operation.parameters && operation.parameters.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Parameters</h3>
              <div className="space-y-2">
                {operation.parameters.map((param: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start p-2 rounded-md bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {param.name}
                        </span>
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded-md text-xs',
                            param.required
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {param.required ? 'required' : 'optional'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                          {param.in}
                        </span>
                      </div>
                      {param.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {param.description}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {param.type || param.schema?.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {operation.requestBody && (
            <div>
              <h3 className="text-sm font-medium mb-2">Request Body</h3>
              <div className="space-y-2">
                {Object.entries(
                  operation.requestBody.content || {}
                ).map(([mediaType, content]: [string, any]) => (
                  <div
                    key={mediaType}
                    className="p-2 rounded-md bg-muted/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm">{mediaType}</span>
                      {operation.requestBody.required && (
                        <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 text-xs">
                          required
                        </span>
                      )}
                    </div>
                    {content.schema && (
                      <pre className="text-xs font-mono bg-muted p-2 rounded-md overflow-auto">
                        {JSON.stringify(content.schema, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses */}
          {operation.responses && (
            <div>
              <h3 className="text-sm font-medium mb-2">Responses</h3>
              <div className="space-y-2">
                {Object.entries(operation.responses).map(
                  ([code, response]: [string, any]) => (
                    <div
                      key={code}
                      className="p-2 rounded-md bg-muted/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded-md text-xs font-medium',
                            code.startsWith('2')
                              ? 'bg-green-500/10 text-green-500'
                              : code.startsWith('4') || code.startsWith('5')
                              ? 'bg-red-500/10 text-red-500'
                              : 'bg-yellow-500/10 text-yellow-500'
                          )}
                        >
                          {code}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {response.description}
                        </span>
                      </div>
                      {response.content && (
                        <div className="space-y-2">
                          {Object.entries(response.content).map(
                            ([mediaType, content]: [string, any]) => (
                              <div key={mediaType}>
                                <div className="font-mono text-xs mb-1">
                                  {mediaType}
                                </div>
                                {content.schema && (
                                  <pre className="text-xs font-mono bg-muted p-2 rounded-md overflow-auto">
                                    {JSON.stringify(
                                      content.schema,
                                      null,
                                      2
                                    )}
                                  </pre>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Preview: React.FC<PreviewProps> = ({
  className,
  spec,
  onClose,
  isLoading,
  error,
}) => {
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(
    new Set()
  );

  const togglePath = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  if (isLoading) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading preview...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex-1 flex items-center justify-center p-4',
          className
        )}
      >
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-500" />
          <h3 className="text-lg font-semibold">Preview Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div
        className={cn(
          'flex-1 flex items-center justify-center p-4',
          className
        )}
      >
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <FileJson className="w-8 h-8 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No Preview Available</h3>
          <p className="text-sm text-muted-foreground">
            Start editing your OpenAPI specification to see the preview.
          </p>
        </div>
      </div>
    );
  }

  const paths = Object.entries(spec.paths || {}).filter(
    ([path, pathObj]: [string, any]) => {
      const pathLower = path.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        pathLower.includes(searchLower) ||
        Object.entries(pathObj).some(
          ([method, operation]: [string, any]) =>
            operation.summary?.toLowerCase().includes(searchLower) ||
            operation.description?.toLowerCase().includes(searchLower)
        );

      const hasSelectedTags =
        selectedTags.size === 0 ||
        Object.values(pathObj).some((operation: any) =>
          operation.tags?.some((tag: string) => selectedTags.has(tag))
        );

      return matchesSearch && hasSelectedTags;
    }
  );

  const tags = Array.from(
    new Set(
      Object.values(spec.paths || {}).flatMap((pathObj: any) =>
        Object.values(pathObj).flatMap((operation: any) => operation.tags || [])
      )
    )
  ).sort();

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 text-sm rounded-md bg-background border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Tooltip content="Filter by Tags">
            <button
              onClick={() => {}}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Close Preview">
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Info */}
          {spec.info && (
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{spec.info.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Version {spec.info.version}
                    </span>
                    {spec.info.license && (
                      <a
                        href={spec.info.license.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <License className="w-3 h-3" />
                        {spec.info.license.name}
                      </a>
                    )}
                  </div>
                </div>
                {spec.info.contact && (
                  <a
                    href={`mailto:${spec.info.contact.email}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                )}
              </div>
              {spec.info.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {spec.info.description}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-2 py-1 rounded-md text-xs transition-colors',
                    selectedTags.has(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Paths */}
          {paths.map(([path, pathObj]: [string, any]) =>
            Object.entries(pathObj).map(([method, operation]: [string, any]) => {
              if (
                selectedTags.size > 0 &&
                !operation.tags?.some((tag: string) =>
                  selectedTags.has(tag)
                )
              ) {
                return null;
              }

              return (
                <Endpoint
                  key={`${method}-${path}`}
                  method={method}
                  path={path}
                  operation={operation}
                  isExpanded={expandedPaths.has(`${method}-${path}`)}
                  onToggle={() => togglePath(`${method}-${path}`)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview; 