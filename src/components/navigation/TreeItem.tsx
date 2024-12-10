import React from 'react';
import { ChevronRight, ChevronDown, Hash, FileJson, Folder, FolderOpen } from 'lucide-react';
import { MethodBadge } from '../common/MethodBadge';

interface TreeItemProps {
  node: any;
  expanded: boolean;
  onToggle: () => void;
  darkMode: boolean;
  level?: number;
  searchQuery?: string;
  activeFilters?: string[];
}

export function TreeItem({
  node,
  expanded,
  onToggle,
  darkMode,
  level = 0,
  searchQuery = '',
  activeFilters = []
}: TreeItemProps) {
  const matchesSearch = searchQuery
    ? node.label.toLowerCase().includes(searchQuery.toLowerCase())
    : true;

  const matchesFilter = activeFilters.length === 0 || (
    node.type === 'method'
      ? activeFilters.includes(node.label.toUpperCase())
      : node.type === 'schema'
        ? activeFilters.includes('Schemas')
        : true
  );

  if (!matchesSearch || !matchesFilter) return null;

  const getIcon = () => {
    switch (node.type) {
      case 'method':
        return <MethodBadge method={node.label} />;
      case 'schema':
        return <FileJson className="w-4 h-4 text-purple-500" />;
      case 'paths':
        return <Hash className="w-4 h-4 text-blue-500" />;
      default:
        return node.children 
          ? expanded 
            ? <FolderOpen className="w-4 h-4 text-yellow-500" />
            : <Folder className="w-4 h-4 text-yellow-500" />
          : null;
    }
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-900">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer ${
          node.matches
            ? darkMode
              ? 'bg-blue-900 bg-opacity-30'
              : 'bg-blue-50'
            : darkMode
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-100'
        }`}
        onClick={onToggle}
      >
        {node.children && (
          expanded ? (
            <ChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )
        )}
        {getIcon()}
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {getHighlightedText(node.label, searchQuery)}
        </span>
      </div>
      
      {expanded && node.children && (
        <div className="mt-1">
          {node.children.map((child: any) => (
            <TreeItem
              key={child.id}
              node={child}
              expanded={expanded}
              onToggle={onToggle}
              darkMode={darkMode}
              level={level + 1}
              searchQuery={searchQuery}
              activeFilters={activeFilters}
            />
          ))}
        </div>
      )}
    </div>
  );
}