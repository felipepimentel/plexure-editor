import React from 'react';
import { ChevronRight, ChevronDown, FileJson, Server, Info, Book, Tag, Lock, Database } from 'lucide-react';
import { parse } from 'yaml';

interface ExplorerProps {
  content: string;
  onNavigate: (path: string) => void;
}

interface TreeNode {
  name: string;
  type: 'folder' | 'item';
  icon?: React.ReactNode;
  children?: TreeNode[];
  path?: string;
  method?: string;
}

export function Explorer({ content, onNavigate }: ExplorerProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({
    paths: true,
    components: true,
  });

  const toggleNode = (nodeName: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeName]: !prev[nodeName]
    }));
  };

  const buildTree = (spec: any): TreeNode[] => {
    const tree: TreeNode[] = [];

    // Info Section
    if (spec.info) {
      tree.push({
        name: 'info',
        type: 'folder',
        icon: <Info className="w-4 h-4" />,
        children: [
          { name: 'title', type: 'item', path: 'info.title' },
          { name: 'version', type: 'item', path: 'info.version' },
          { name: 'description', type: 'item', path: 'info.description' },
        ]
      });
    }

    // Servers Section
    if (spec.servers?.length) {
      tree.push({
        name: 'servers',
        type: 'folder',
        icon: <Server className="w-4 h-4" />,
        children: spec.servers.map((server: any, index: number) => ({
          name: server.url,
          type: 'item',
          path: `servers.${index}`
        }))
      });
    }

    // Paths Section
    if (spec.paths) {
      const pathsNode: TreeNode = {
        name: 'paths',
        type: 'folder',
        icon: <Book className="w-4 h-4" />,
        children: []
      };

      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        const pathNode: TreeNode = {
          name: path,
          type: 'folder',
          children: []
        };

        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          pathNode.children?.push({
            name: `${method.toUpperCase()} ${operation.summary || path}`,
            type: 'item',
            path: `paths.${path}.${method}`,
            method
          });
        });

        pathsNode.children?.push(pathNode);
      });

      tree.push(pathsNode);
    }

    // Components Section
    if (spec.components) {
      const componentsNode: TreeNode = {
        name: 'components',
        type: 'folder',
        icon: <Database className="w-4 h-4" />,
        children: []
      };

      if (spec.components.schemas) {
        componentsNode.children?.push({
          name: 'schemas',
          type: 'folder',
          icon: <FileJson className="w-4 h-4" />,
          children: Object.keys(spec.components.schemas).map(schema => ({
            name: schema,
            type: 'item',
            path: `components.schemas.${schema}`
          }))
        });
      }

      if (spec.components.securitySchemes) {
        componentsNode.children?.push({
          name: 'security',
          type: 'folder',
          icon: <Lock className="w-4 h-4" />,
          children: Object.keys(spec.components.securitySchemes).map(scheme => ({
            name: scheme,
            type: 'item',
            path: `components.securitySchemes.${scheme}`
          }))
        });
      }

      tree.push(componentsNode);
    }

    // Tags Section
    if (spec.tags?.length) {
      tree.push({
        name: 'tags',
        type: 'folder',
        icon: <Tag className="w-4 h-4" />,
        children: spec.tags.map((tag: any) => ({
          name: tag.name,
          type: 'item',
          path: `tags.${tag.name}`
        }))
      });
    }

    return tree;
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes[node.path || node.name];
    const hasChildren = node.children && node.children.length > 0;
    const paddingLeft = level * 12;

    return (
      <div key={node.path || node.name}>
        <div
          className={`flex items-center px-2 py-1 hover:bg-gray-800/50 cursor-pointer text-sm ${
            node.type === 'item' ? 'text-gray-300' : 'text-gray-400'
          }`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.path || node.name);
            } else if (node.path) {
              onNavigate(node.path);
            }
          }}
        >
          <div className="flex items-center gap-1 flex-1">
            {hasChildren ? (
              <div className="w-4 h-4 flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </div>
            ) : (
              <div className="w-4" />
            )}
            {node.icon && <div className="w-4 h-4">{node.icon}</div>}
            <span className="truncate">
              {node.method && (
                <span className={`mr-1.5 text-xs ${
                  node.method === 'get' ? 'text-blue-400' :
                  node.method === 'post' ? 'text-green-400' :
                  node.method === 'put' ? 'text-yellow-400' :
                  node.method === 'delete' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {node.method.toUpperCase()}
                </span>
              )}
              {node.name}
            </span>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children?.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = React.useMemo(() => {
    try {
      const spec = parse(content);
      return buildTree(spec);
    } catch {
      return [];
    }
  }, [content]);

  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 overflow-y-auto">
      <div className="p-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search API..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="mt-2">
        {tree.map(node => renderNode(node))}
      </div>
    </div>
  );
} 