import React from 'react';
import { ChevronRight, ChevronDown, FileJson, Globe, Code2, Box, List, ArrowRight } from 'lucide-react';
import { OpenAPI } from 'openapi-types';
import { buildNavigationTree } from '../../utils/openApiUtils';

interface NavigationNode {
  id: string;
  type: 'path' | 'method' | 'schema' | 'response' | 'parameter';
  label: string;
  children?: NavigationNode[];
  method?: string;
  path?: string;
}

interface NavigationTreeProps {
  spec: OpenAPI.Document | null;
  darkMode: boolean;
  selectedPath?: string;
  onSelect: (path: string) => void;
}

export function NavigationTree({
  spec,
  darkMode,
  selectedPath,
  onSelect
}: NavigationTreeProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set(['paths']));
  const nodes = React.useMemo(() => buildNavigationTree(spec), [spec]);

  const getNodeIcon = (type: string, method?: string) => {
    switch (type) {
      case 'path':
        return Globe;
      case 'method':
        return method ? ArrowRight : FileJson;
      case 'schema':
        return Code2;
      case 'parameter':
        return List;
      case 'response':
        return Box;
      default:
        return FileJson;
    }
  };

  const getMethodColor = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'get': return 'text-blue-500';
      case 'post': return 'text-green-500';
      case 'put': return 'text-yellow-500';
      case 'delete': return 'text-red-500';
      case 'patch': return 'text-purple-500';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const renderNode = (node: NavigationNode) => {
    const Icon = getNodeIcon(node.type, node.method);
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = node.id === selectedPath;
    const hasChildren = node.children?.length;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => {
            if (hasChildren) {
              const newExpanded = new Set(expandedNodes);
              if (isExpanded) {
                newExpanded.delete(node.id);
              } else {
                newExpanded.add(node.id);
              }
              setExpandedNodes(newExpanded);
            }
            onSelect(node.id);
          }}
          className={`
            flex items-center px-2 py-1.5 rounded-md cursor-pointer
            ${isSelected
              ? darkMode
                ? 'bg-gray-700 text-blue-400'
                : 'bg-gray-200 text-blue-600'
              : darkMode
                ? 'hover:bg-gray-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }
          `}
        >
          {hasChildren ? (
            <button className="p-0.5 rounded hover:bg-gray-700">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          
          <div className="flex items-center gap-2 ml-1">
            <Icon className={`w-4 h-4 ${getMethodColor(node.method)}`} />
            <span className="text-sm truncate">{node.label}</span>
          </div>
        </div>

        {isExpanded && node.children && (
          <div className="ml-4 mt-1 space-y-1">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  if (!spec) {
    return (
      <div className={`p-4 text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        No specification loaded
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {nodes.map(node => renderNode(node))}
    </div>
  );
}