import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Lock,
  Server,
  FileJson,
  Code,
  MessageSquare,
  ArrowRight,
  Tag,
  Info,
  List,
  BarChart2
} from 'lucide-react';
import { OpenAPI } from 'openapi-types';
import { EndpointsView } from '../preview/EndpointsView';
import { SchemasView } from '../preview/SchemasView';
import { InfoView } from '../preview/InfoView';

interface PreviewPanelProps {
  darkMode: boolean;
  spec: OpenAPI.Document | null;
  errors: any[];
  collapsed?: boolean;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, darkMode, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 text-sm rounded-t-lg transition-colors
        ${active
          ? darkMode
            ? 'bg-gray-800 text-blue-400'
            : 'bg-white text-blue-600 shadow-sm'
          : darkMode
            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

export function PreviewPanel({ darkMode, spec, errors, collapsed }: PreviewPanelProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [expandedOperations, setExpandedOperations] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'endpoints' | 'schemas' | 'info'>('endpoints');

  const togglePath = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const toggleOperation = (operationId: string) => {
    const newExpanded = new Set(expandedOperations);
    if (newExpanded.has(operationId)) {
      newExpanded.delete(operationId);
    } else {
      newExpanded.add(operationId);
    }
    setExpandedOperations(newExpanded);
  };

  if (!spec) return <EmptyState darkMode={darkMode} />;

  return (
    <div className="h-full flex flex-col">
      {/* Header seguindo o padrão do Navigator */}
      <div className="
        h-14 flex items-center justify-between flex-shrink-0 px-4
        bg-blue-500/10 text-blue-400 border-b border-blue-500/20
      ">
        <span className="text-xs font-medium uppercase tracking-wider">
          Preview
        </span>
        <div className="text-gray-400">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`
                p-1.5 rounded-lg transition-colors hover:bg-gray-800
                ${activeTab === 'endpoints' ? 'bg-gray-800' : ''}
              `}
              title="List View"
            >
              <List className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => setActiveTab('schemas')}
              className={`
                p-1.5 rounded-lg transition-colors hover:bg-gray-800
                ${activeTab === 'schemas' ? 'bg-gray-800' : ''}
              `}
              title="Schema View"
            >
              <BarChart2 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Search e Filtros */}
      <div className="p-3 space-y-3 border-b border-gray-800">
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-md
          ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}
        `}>
          <Search className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search endpoints..."
            className={`
              w-full bg-transparent border-none outline-none text-sm
              ${darkMode ? 'text-gray-200' : 'text-gray-700'}
              placeholder:text-gray-500
            `}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <MethodBadge method="GET" />
          <MethodBadge method="POST" />
          <MethodBadge method="PUT" />
          <MethodBadge method="DELETE" />
          <MethodBadge method="PATCH" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'endpoints' && (
          <EndpointsView
            spec={spec}
            darkMode={darkMode}
            searchQuery={searchQuery}
            expandedPaths={expandedPaths}
            expandedOperations={expandedOperations}
            onTogglePath={togglePath}
            onToggleOperation={toggleOperation}
          />
        )}
        {activeTab === 'schemas' && (
          <SchemasView
            spec={spec}
            darkMode={darkMode}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No API specification loaded
      </p>
    </div>
  );
}

function MethodBadge({ method, variant = 'default' }: { method: string; variant?: 'default' | 'deprecated' }) {
  const colors = {
    GET: 'text-blue-400 bg-blue-500/10',
    POST: 'text-green-400 bg-green-500/10',
    PUT: 'text-yellow-400 bg-yellow-500/10',
    DELETE: 'text-red-400 bg-red-500/10',
    PATCH: 'text-purple-400 bg-purple-500/10',
    DEPRECATED: 'text-gray-400 bg-gray-500/10'
  };

  return (
    <span className={`
      px-2 py-1 rounded text-xs font-medium
      ${variant === 'deprecated' ? colors.DEPRECATED : colors[method]}
    `}>
      {method}
    </span>
  );
} 