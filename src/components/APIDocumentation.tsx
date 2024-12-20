import {
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    Clock,
    Database,
    FileCode,
    Filter,
    Globe,
    Hash,
    Info,
    Search,
    Tag,
    X,
    XCircle
} from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';
import { APIEndpoints } from './APIEndpoints';
import { APISchemas } from './APISchemas';
import { Tooltip } from './ui/TooltipComponent';
import { ValidationPanel } from './ValidationPanel';

interface APIDocumentationProps {
  spec: any;
  environment?: {
    server?: {
      url: string;
    };
  };
  onServerChange?: (url: string) => void;
  validationErrors?: any[];
  className?: string;
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
  const [showServerMenu, setShowServerMenu] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    method: [] as string[],
    tags: [] as string[],
    status: [] as string[],
  });
  
  const serverMenuRef = React.useRef<HTMLDivElement>(null);
  const filterMenuRef = React.useRef<HTMLDivElement>(null);

  // Extract available filters from spec
  const availableFilters = React.useMemo(() => {
    const methods = new Set<string>();
    const tags = new Set<string>();
    const statuses = new Set<string>();

    if (spec?.paths) {
      Object.values(spec.paths).forEach((path: any) => {
        Object.entries(path).forEach(([method, operation]: [string, any]) => {
          methods.add(method.toUpperCase());
          if (operation.tags) {
            operation.tags.forEach((tag: string) => tags.add(tag));
          }
          if (operation.responses) {
            Object.keys(operation.responses).forEach(status => statuses.add(status));
          }
        });
      });
    }

    return {
      methods: Array.from(methods),
      tags: Array.from(tags),
      statuses: Array.from(statuses),
    };
  }, [spec]);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (serverMenuRef.current && !serverMenuRef.current.contains(event.target as Node)) {
        setShowServerMenu(false);
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!spec || !spec.paths) {
    return (
      <div className={cn('flex flex-col h-full max-w-full items-center justify-center bg-[#1e1e1e]', className)}>
        <div className="text-center p-4">
          <div className="w-12 h-12 rounded-full bg-[#2d2d2d] flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-base font-medium mb-2 text-gray-200">No Content to Preview</h2>
          <p className="text-sm text-gray-400">
            The OpenAPI specification is not available or contains errors.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full max-w-full bg-[#1e1e1e] text-gray-300', className)}>
      {/* Compact Header */}
      <div className="flex flex-col border-b border-[#2d2d2d]">
        {/* Title Bar */}
        <div className="flex items-center px-3 py-1.5 gap-2 border-b border-[#2d2d2d] bg-[#252526]">
          <h1 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <span className="truncate">{spec.info?.title || 'API Documentation'}</span>
            <span className="text-xs text-gray-500 font-normal">v{spec.info?.version || '1.0.0'}</span>
          </h1>
          
          {spec.servers && spec.servers.length > 0 && (
            <div className="relative ml-auto" ref={serverMenuRef}>
              <Tooltip content="Select server">
                <button
                  onClick={() => setShowServerMenu(!showServerMenu)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs rounded hover:bg-[#2d2d2d] text-gray-400 hover:text-gray-300"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="font-mono truncate max-w-[120px]">
                    {environment?.server?.url || spec.servers[0].url}
                  </span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showServerMenu && 'rotate-180')} />
                </button>
              </Tooltip>
              {showServerMenu && (
                <div className="absolute right-0 mt-1 w-64 rounded border border-[#2d2d2d] bg-[#1e1e1e] shadow-lg z-50">
                  <div className="p-1">
                    {spec.servers.map((server: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          onServerChange?.(server.url);
                          setShowServerMenu(false);
                        }}
                        className={cn(
                          'flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded text-gray-300 hover:bg-[#2d2d2d] transition-colors',
                          environment?.server?.url === server.url && 'bg-[#2d2d2d]'
                        )}
                      >
                        <Globe className="h-3.5 w-3.5 text-gray-400" />
                        <span className="font-mono truncate">{server.url}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search and Navigation Bar */}
        <div className="flex flex-col gap-2 p-2">
          {/* Quick Actions */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('endpoints')}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors flex-shrink-0',
                activeTab === 'endpoints'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d]'
              )}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Endpoints</span>
              {spec?.paths && (
                <span className={cn(
                  'px-1 rounded text-[10px]',
                  activeTab === 'endpoints' ? 'bg-blue-500/20' : 'bg-[#2d2d2d]'
                )}>{Object.keys(spec.paths).length}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('validation')}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors flex-shrink-0',
                activeTab === 'validation'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d]'
              )}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Validation</span>
              {validationErrors.length > 0 && (
                <span className={cn(
                  'px-1 rounded text-[10px]',
                  activeTab === 'validation' ? 'bg-amber-500/20' : 'bg-[#2d2d2d]'
                )}>{validationErrors.length}</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('schemas')}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 text-xs rounded transition-colors flex-shrink-0',
                activeTab === 'schemas'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d]'
              )}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Schemas</span>
              {spec?.components?.schemas && (
                <span className={cn(
                  'px-1 rounded text-[10px]',
                  activeTab === 'schemas' ? 'bg-purple-500/20' : 'bg-[#2d2d2d]'
                )}>{Object.keys(spec.components.schemas).length}</span>
              )}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-7 pr-8 py-1 text-xs bg-[#252526] border border-transparent rounded placeholder-gray-500 focus:border-[#2d2d2d] focus:outline-none focus:ring-1 focus:ring-[#2d2d2d]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[#2d2d2d] text-gray-400 hover:text-gray-300"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="relative flex-shrink-0" ref={filterMenuRef}>
              <Tooltip content="Filter options">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'p-1 rounded transition-colors',
                    showFilters || Object.values(filters).some(f => f.length > 0)
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d]'
                  )}
                >
                  <Filter className="h-4 w-4" />
                </button>
              </Tooltip>

              {showFilters && (
                <div className="absolute right-0 mt-1 w-64 rounded border border-[#2d2d2d] bg-[#1e1e1e] shadow-lg z-50">
                  <div className="p-2 space-y-3">
                    {/* Methods */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Hash className="h-3.5 w-3.5" />
                        <span>Methods</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {availableFilters.methods.map(method => (
                          <button
                            key={method}
                            onClick={() => setFilters(prev => ({
                              ...prev,
                              method: prev.method.includes(method)
                                ? prev.method.filter(m => m !== method)
                                : [...prev.method, method]
                            }))}
                            className={cn(
                              'px-1.5 py-0.5 text-[10px] rounded border transition-colors',
                              filters.method.includes(method)
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                                : 'text-gray-400 border-[#2d2d2d] hover:bg-[#2d2d2d]'
                            )}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {availableFilters.tags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setFilters(prev => ({
                              ...prev,
                              tags: prev.tags.includes(tag)
                                ? prev.tags.filter(t => t !== tag)
                                : [...prev.tags, tag]
                            }))}
                            className={cn(
                              'px-1.5 py-0.5 text-[10px] rounded border transition-colors',
                              filters.tags.includes(tag)
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/20'
                                : 'text-gray-400 border-[#2d2d2d] hover:bg-[#2d2d2d]'
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status Codes */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Status Codes</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {availableFilters.statuses.map(status => (
                          <button
                            key={status}
                            onClick={() => setFilters(prev => ({
                              ...prev,
                              status: prev.status.includes(status)
                                ? prev.status.filter(s => s !== status)
                                : [...prev.status, status]
                            }))}
                            className={cn(
                              'px-1.5 py-0.5 text-[10px] rounded border transition-colors',
                              filters.status.includes(status)
                                ? status.startsWith('2')
                                  ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                  : status.startsWith('4')
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/20'
                                  : 'bg-red-500/20 text-red-400 border-red-500/20'
                                : 'text-gray-400 border-[#2d2d2d] hover:bg-[#2d2d2d]'
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#2d2d2d]">
                      <button
                        onClick={() => setFilters({ method: [], tags: [], status: [] })}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs rounded text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d]"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Clear all</span>
                      </button>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs rounded text-blue-400 hover:text-blue-300 hover:bg-[#2d2d2d]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Apply filters</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'validation' && (
          <ValidationPanel messages={validationErrors} className="p-4" />
        )}
        {activeTab === 'endpoints' && (
          <APIEndpoints
            spec={spec}
            searchQuery={searchQuery}
            filters={filters}
            className="p-4"
          />
        )}
        {activeTab === 'schemas' && (
          <APISchemas spec={spec} className="p-4" />
        )}
      </div>
    </div>
  );
};

export default APIDocumentation; 