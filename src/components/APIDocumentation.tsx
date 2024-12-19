import React from 'react';
import { cn } from '../lib/utils';
import { APIEndpoints } from './APIEndpoints';
import { APISchemas } from './APISchemas';
import { APISecurity } from './APISecurity';
import { APIExample } from './APIExample';
import { APIServers } from './APIServers';
import { APIWebhooks } from './APIWebhooks';
import { APITags } from './APITags';
import { APIExternalDocs } from './APIExternalDocs';
import { ValidationPanel } from './ValidationPanel';
import { Tooltip } from './ui/TooltipComponent';
import {
  Code2,
  FileJson,
  Link2,
  Lock,
  PlayCircle,
  Search,
  Server,
  Shield,
  Tag,
  Webhook,
  ChevronDown,
  AlertTriangle,
  Globe,
  Info,
  Loader2,
  X,
  ChevronRight,
  ExternalLink,
  Copy,
  ArrowRight,
  FileCode,
  Settings2,
  Share2,
  Check,
  MoreVertical,
  Braces,
  FileText,
  Book,
  Sparkles,
  Lightbulb,
  Layers,
  GitBranch,
  Boxes
} from 'lucide-react';

interface APIDocumentationProps {
  spec: any;
  environment?: any;
  onServerChange?: (server: any) => void;
  validationErrors?: Array<{
    type: 'error' | 'warning';
    message: string;
    path?: string;
    line?: number;
    column?: number;
  }>;
  className?: string;
}

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  description?: string;
}

export const APIDocumentation: React.FC<APIDocumentationProps> = ({
  spec,
  environment,
  onServerChange,
  validationErrors = [],
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState('endpoints');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isTabsMenuOpen, setIsTabsMenuOpen] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);
  const [showServerMenu, setShowServerMenu] = React.useState(false);
  const tabsMenuRef = React.useRef<HTMLDivElement>(null);
  const serverMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabsMenuRef.current && !tabsMenuRef.current.contains(event.target as Node)) {
        setIsTabsMenuOpen(false);
      }
      if (serverMenuRef.current && !serverMenuRef.current.contains(event.target as Node)) {
        setShowServerMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyServerUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy server URL:', error);
    }
  };

  if (!spec || !spec.paths) {
    return (
      <div className={cn('flex flex-col h-full max-w-full items-center justify-center', className)}>
        <div className="text-center p-4">
          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium mb-2">No Content to Preview</h2>
          <p className="text-sm text-muted-foreground">
            The OpenAPI specification is not available or contains errors.
          </p>
        </div>
      </div>
    );
  }

  const tabs: TabProps[] = [
    {
      id: 'validation',
      label: 'Validation',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: validationErrors?.length || 0,
      description: 'View and fix validation errors in your API specification',
    },
    {
      id: 'endpoints',
      label: 'Endpoints',
      icon: <Code2 className="w-4 h-4" />,
      badge: spec?.paths ? Object.keys(spec.paths).length : 0,
      description: 'Browse and test API endpoints',
    },
    {
      id: 'schemas',
      label: 'Schemas',
      icon: <Boxes className="w-4 h-4" />,
      badge: spec?.components?.schemas ? Object.keys(spec.components.schemas).length : 0,
      description: 'View data models and type definitions',
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Lock className="w-4 h-4" />,
      badge: spec?.security ? spec.security.length : 0,
      description: 'Configure authentication and authorization',
    },
    {
      id: 'servers',
      label: 'Servers',
      icon: <Server className="w-4 h-4" />,
      badge: spec?.servers ? spec.servers.length : 0,
      description: 'Manage API server configurations',
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: <Webhook className="w-4 h-4" />,
      badge: spec?.webhooks ? Object.keys(spec.webhooks).length : 0,
      description: 'Configure webhook endpoints',
    },
    {
      id: 'tags',
      label: 'Tags',
      icon: <Tag className="w-4 h-4" />,
      badge: spec?.tags ? spec.tags.length : 0,
      description: 'Organize API endpoints with tags',
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: <Book className="w-4 h-4" />,
      badge: spec?.externalDocs ? 1 : 0,
      description: 'View external documentation',
    },
    {
      id: 'examples',
      label: 'Examples',
      icon: <PlayCircle className="w-4 h-4" />,
      description: 'Explore API usage examples',
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn('flex flex-col h-full max-w-full', className)}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* API Info */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">
                {spec.info?.title || 'API Documentation'}
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                {spec.info?.version && (
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">
                      v{spec.info.version}
                    </span>
                  </div>
                )}
                {spec.info?.license && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <a
                      href={spec.info.license.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground truncate"
                    >
                      {spec.info.license.name}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content="Settings">
                <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <Settings2 className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content="Share API">
                <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </Tooltip>
              {spec.externalDocs?.url && (
                <Tooltip content="View Documentation">
                  <a
                    href={spec.externalDocs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
          {spec.info?.description && (
            <div className="mt-3 text-muted-foreground text-sm break-words line-clamp-2">
              {spec.info.description}
            </div>
          )}
        </div>

        {/* Server Selection */}
        {spec.servers && spec.servers.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative" ref={serverMenuRef}>
                <button
                  onClick={() => setShowServerMenu(!showServerMenu)}
                  className="w-full flex items-center gap-2 h-9 px-3 rounded-md border bg-background/50 text-sm hover:bg-muted/50 transition-colors"
                >
                  <Server className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate text-left">
                    {environment?.server?.description || environment?.server?.url || spec.servers[0].description || spec.servers[0].url}
                  </span>
                  <ChevronDown className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform duration-200',
                    showServerMenu && 'rotate-180'
                  )} />
                </button>
                {showServerMenu && (
                  <div className="absolute left-0 right-0 mt-1 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                    {spec.servers.map((server: any, index: number) => (
                      <div
                        key={index}
                        className="group relative"
                      >
                        <button
                          onClick={() => {
                            if (onServerChange) {
                              onServerChange(server);
                            }
                            setShowServerMenu(false);
                          }}
                          className={cn(
                            'w-full flex items-start gap-2 p-2 rounded-sm text-sm hover:bg-muted/80 transition-colors',
                            environment?.server?.url === server.url && 'bg-muted/50'
                          )}
                        >
                          <Server className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="font-medium truncate">
                              {server.description || server.url}
                            </div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              {server.url}
                            </div>
                          </div>
                        </button>
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip content={copiedUrl === server.url ? 'Copied!' : 'Copy URL'}>
                            <button
                              onClick={() => copyServerUrl(server.url)}
                              className="p-1 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {copiedUrl === server.url ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pb-4">
          {tabs.map((tab) => (
            <Tooltip key={tab.id} content={tab.description}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200',
                  'text-sm hover:shadow-sm',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground animate-in fade-in-0 zoom-in-75 duration-200">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="font-medium">
                  {tab.label}
                </span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'validation' && (
          <ValidationPanel messages={validationErrors} className="p-4" />
        )}
        {activeTab === 'endpoints' && (
          <APIEndpoints spec={spec} searchQuery={searchQuery} className="p-4" />
        )}
        {activeTab === 'schemas' && (
          <APISchemas spec={spec} className="p-4" />
        )}
        {activeTab === 'security' && (
          <APISecurity spec={spec} className="p-4" />
        )}
        {activeTab === 'servers' && (
          <APIServers spec={spec} className="p-4" />
        )}
        {activeTab === 'webhooks' && (
          <APIWebhooks spec={spec} className="p-4" />
        )}
        {activeTab === 'tags' && (
          <APITags spec={spec} className="p-4" />
        )}
        {activeTab === 'docs' && (
          <APIExternalDocs spec={spec} className="p-4" />
        )}
        {activeTab === 'examples' && (
          <APIExample spec={spec} className="p-4" />
        )}
      </div>
    </div>
  );
};

export default APIDocumentation; 