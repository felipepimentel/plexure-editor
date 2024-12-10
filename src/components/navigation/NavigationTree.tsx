import React from 'react';
import { TreeItem } from './TreeItem';
import { useNavigationStore } from '../../store/navigationStore';
import { OpenAPI } from 'openapi-types';

interface NavigationTreeProps {
  spec: OpenAPI.Document | null;
  darkMode: boolean;
  searchQuery?: string;
  activeFilters?: string[];
}

export function NavigationTree({ spec, darkMode, searchQuery = '', activeFilters = [] }: NavigationTreeProps) {
  const { expandedPaths, togglePath } = useNavigationStore();

  const buildTree = (obj: any, path: string[] = []): any[] => {
    if (!obj || typeof obj !== 'object') {
      return [];
    }

    return Object.entries(obj).map(([key, value]: [string, any]) => {
      const currentPath = [...path, key];
      const isExpandable = typeof value === 'object' && value !== null;
      
      return {
        id: currentPath.join('.'),
        label: key,
        children: isExpandable ? buildTree(value, currentPath) : undefined,
        type: getNodeType(key, value),
        data: value,
        path: currentPath
      };
    });
  };

  const getNodeType = (key: string, value: any): string => {
    if (key === 'paths') return 'paths';
    if (key === 'schemas') return 'schemas';
    if (['get', 'post', 'put', 'delete', 'patch'].includes(key)) return 'method';
    if (typeof value === 'object' && value?.type === 'object') return 'schema';
    return 'default';
  };

  const filterTree = (nodes: any[], query: string): any[] => {
    return nodes.map(node => {
      const matches = node.label.toLowerCase().includes(query.toLowerCase());
      const children = node.children ? filterTree(node.children, query) : undefined;
      
      if (matches || (children && children.length > 0)) {
        return {
          ...node,
          children,
          matches
        };
      }
      return null;
    }).filter(Boolean);
  };

  if (!spec) {
    return (
      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No specification loaded
      </div>
    );
  }

  const tree = buildTree(spec);
  const filteredTree = searchQuery ? filterTree(tree, searchQuery) : tree;

  return (
    <div className="space-y-1 p-2">
      {filteredTree.map(node => (
        <TreeItem
          key={node.id}
          node={node}
          expanded={expandedPaths.includes(node.id)}
          onToggle={() => togglePath(node.id)}
          darkMode={darkMode}
          searchQuery={searchQuery}
          activeFilters={activeFilters}
        />
      ))}
    </div>
  );
}