import React from 'react';
import { OpenAPI } from 'openapi-types';
import { NavigationTreeItem } from './NavigationTreeItem';

interface NavigationTreeProps {
  spec: OpenAPI.Document | null;
  darkMode: boolean;
  selectedPath?: string;
  onSelect: (path: string) => void;
  expandedNodes: Set<string>;
  onNodeExpand: (nodeId: string, recursive?: boolean) => void;
  viewMode: 'tree' | 'list';
  filterOptions: {
    showGet: boolean;
    showPost: boolean;
    showPut: boolean;
    showDelete: boolean;
    showDeprecated: boolean;
    showParameters: boolean;
    showResponses: boolean;
  };
}

export function NavigationTree({
  spec,
  darkMode,
  selectedPath,
  onSelect,
  expandedNodes,
  onNodeExpand,
  viewMode,
  filterOptions
}: NavigationTreeProps) {
  if (!spec?.paths) {
    return (
      <div className={`p-4 text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        No paths defined
      </div>
    );
  }

  const renderPath = (path: string, pathItem: OpenAPI.PathItemObject) => {
    const nodeId = path;
    const isExpanded = expandedNodes.has(nodeId);
    const methods = Object.entries(pathItem)
      .filter(([method]) => {
        if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) return false;
        const methodName = `show${method.charAt(0).toUpperCase()}${method.slice(1)}` as keyof typeof filterOptions;
        return filterOptions[methodName];
      });

    return (
      <div key={path}>
        <NavigationTreeItem
          label={path}
          path={path}
          hasChildren={methods.length > 0}
          isExpanded={isExpanded}
          isSelected={selectedPath === path}
          level={0}
          darkMode={darkMode}
          onToggle={(e?: React.MouseEvent) => {
            onNodeExpand(nodeId, e?.shiftKey);
          }}
          onClick={() => onSelect(path)}
        />

        {isExpanded && methods.map(([method, operation]) => {
          if (operation?.deprecated && !filterOptions.showDeprecated) return null;
          
          const methodNodeId = `${path}-${method}`;
          const methodIsExpanded = expandedNodes.has(methodNodeId);

          return (
            <div key={methodNodeId}>
              <NavigationTreeItem
                label={operation?.summary || method.toUpperCase()}
                method={method}
                hasChildren={
                  (filterOptions.showParameters && operation?.parameters?.length) ||
                  (filterOptions.showResponses && operation?.responses)
                }
                isExpanded={methodIsExpanded}
                isSelected={selectedPath === methodNodeId}
                level={1}
                darkMode={darkMode}
                isDeprecated={operation?.deprecated}
                onToggle={() => onNodeExpand(methodNodeId)}
                onClick={() => onSelect(methodNodeId)}
              />

              {methodIsExpanded && (
                <>
                  {filterOptions.showParameters && operation?.parameters?.length > 0 && (
                    <div>
                      {operation.parameters.map((param: any, index: number) => (
                        <NavigationTreeItem
                          key={`${methodNodeId}-param-${index}`}
                          label={param.name}
                          level={2}
                          darkMode={darkMode}
                          onClick={() => onSelect(`${methodNodeId}-param-${param.name}`)}
                        />
                      ))}
                    </div>
                  )}

                  {filterOptions.showResponses && operation?.responses && (
                    <div>
                      {Object.entries(operation.responses).map(([code, response]) => (
                        <NavigationTreeItem
                          key={`${methodNodeId}-response-${code}`}
                          label={`${code} ${(response as any)?.description || ''}`}
                          level={2}
                          darkMode={darkMode}
                          onClick={() => onSelect(`${methodNodeId}-response-${code}`)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-2">
      {Object.entries(spec.paths).map(([path, pathItem]) => renderPath(path, pathItem))}
    </div>
  );
}