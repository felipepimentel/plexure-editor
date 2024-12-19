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
  const tabsMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabsMenuRef.current && !tabsMenuRef.current.contains(event.target as Node)) {
        setIsTabsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!spec || !spec.paths) {
    return (
      <div className={cn('flex flex-col h-full max-w-full items-center justify-center', className)}>
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold mb-2">No Content to Preview</h2>
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
    },
    {
      id: 'endpoints',
      label: 'Endpoints',
      icon: <Code2 className="w-4 h-4" />,
      badge: spec?.paths ? Object.keys(spec.paths).length : 0,
    },
    {
      id: 'schemas',
      label: 'Schemas',
      icon: <FileJson className="w-4 h-4" />,
      badge: spec?.components?.schemas ? Object.keys(spec.components.schemas).length : 0,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Lock className="w-4 h-4" />,
      badge: spec?.security ? spec.security.length : 0,
    },
    {
      id: 'servers',
      label: 'Servers',
      icon: <Server className="w-4 h-4" />,
      badge: spec?.servers ? spec.servers.length : 0,
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: <Webhook className="w-4 h-4" />,
      badge: spec?.webhooks ? Object.keys(spec.webhooks).length : 0,
    },
    {
      id: 'tags',
      label: 'Tags',
      icon: <Tag className="w-4 h-4" />,
      badge: spec?.tags ? spec.tags.length : 0,
    },
    {
      id: 'docs',
      label: 'Documentation',
      icon: <Link2 className="w-4 h-4" />,
      badge: spec?.externalDocs ? 1 : 0,
    },
    {
      id: 'examples',
      label: 'Examples',
      icon: <PlayCircle className="w-4 h-4" />,
    },
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn('flex flex-col h-full max-w-full', className)}>
      {/* Header */}
      <div className="border-b bg-card shrink-0">
        {/* API Info */}
        <div className="p-4">
          <h1 className="text-2xl font-bold truncate">
            {spec.info?.title || 'API Documentation'}
          </h1>
          {spec.info?.version && (
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                Version {spec.info.version}
              </span>
            </div>
          )}
          {spec.info?.description && (
            <div className="mt-2 text-muted-foreground text-sm break-words">
              {spec.info.description}
            </div>
          )}
        </div>

        {/* Server Selection */}
        {spec.servers && spec.servers.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Server className="w-4 h-4 shrink-0" />
              <span className="shrink-0">Server:</span>
              <select
                className="flex-1 min-w-0 px-2 py-1 rounded-md border bg-background text-sm"
                value={environment?.server || spec.servers[0].url}
                onChange={(e) => {
                  const server = spec.servers.find((s: any) => s.url === e.target.value);
                  if (server && onServerChange) {
                    onServerChange(server);
                  }
                }}
              >
                {spec.servers.map((server: any, index: number) => (
                  <option key={index} value={server.url} className="truncate">
                    {server.description || server.url}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-muted/30 rounded-lg mx-4 mb-4">
          {tabs.map((tab) => (
            <Tooltip key={tab.id} content={tab.label}>
              <div>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex flex-col items-center justify-center w-full p-2 rounded-md transition-colors text-center gap-1',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <div className="relative">
                    {tab.icon}
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider">
                    {tab.label}
                  </span>
                </button>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto p-4">
        <div className="max-w-full">
          {activeTab === 'validation' && (
            <ValidationPanel errors={validationErrors} />
          )}

          {activeTab === 'endpoints' && (
            <APIEndpoints
              spec={spec}
              onTest={(path, method) => {
                // Handle endpoint testing
                console.log('Test endpoint:', method, path);
              }}
            />
          )}

          {activeTab === 'schemas' && (
            <APISchemas spec={spec} />
          )}

          {activeTab === 'security' && (
            <APISecurity spec={spec} />
          )}

          {activeTab === 'servers' && (
            <APIServers
              spec={spec}
              environment={environment}
              onServerChange={onServerChange}
            />
          )}

          {activeTab === 'webhooks' && (
            <APIWebhooks spec={spec} />
          )}

          {activeTab === 'tags' && (
            <APITags spec={spec} />
          )}

          {activeTab === 'docs' && (
            <APIExternalDocs spec={spec} />
          )}

          {activeTab === 'examples' && (
            <APIExample spec={spec} />
          )}
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation; 