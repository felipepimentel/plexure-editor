import { useState, useCallback } from 'react';
import { OpenAPI } from 'openapi-types';
import yaml from 'js-yaml';

export interface FilterOptions {
  showGet: boolean;
  showPost: boolean;
  showPut: boolean;
  showDelete: boolean;
  showDeprecated: boolean;
  showParameters: boolean;
  showResponses: boolean;
}

export type ViewMode = 'tree' | 'list';
export type Category = 'endpoints' | 'schemas' | 'tags' | 'deprecated';

export function useNavigatorState(initialSpec: string) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [parsedSpec, setParsedSpec] = useState<OpenAPI.Document | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [activeCategory, setActiveCategory] = useState<Category>('endpoints');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    showGet: true,
    showPost: true,
    showPut: true,
    showDelete: true,
    showDeprecated: false,
    showParameters: true,
    showResponses: true
  });

  // Parse spec
  const parseSpec = useCallback((spec: string) => {
    try {
      const parsed = yaml.load(spec) as OpenAPI.Document;
      setParsedSpec(parsed);
      setParseError(null);
      return parsed;
    } catch (error) {
      console.error('Error parsing spec:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to parse specification');
      setParsedSpec(null);
      return null;
    }
  }, []);

  // Filter endpoints based on search and options
  const filterEndpoints = useCallback((spec: OpenAPI.Document | null) => {
    if (!spec?.paths) return spec;

    const filteredPaths: Record<string, any> = {};
    Object.entries(spec.paths).forEach(([path, methods]) => {
      // Filter by search query
      const matchesSearch = !searchQuery || 
        path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.entries(methods || {}).some(([_, operation]) => 
          operation?.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          operation?.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Filter by method options
      const matchesMethodFilters = Object.entries(methods || {}).some(([method, operation]) => {
        const methodName = `show${method.charAt(0).toUpperCase()}${method.slice(1)}`;
        const isMethodEnabled = filterOptions[methodName as keyof FilterOptions];
        const isDeprecated = operation?.deprecated || false;

        return isMethodEnabled && (filterOptions.showDeprecated || !isDeprecated);
      });

      if (matchesSearch && matchesMethodFilters) {
        filteredPaths[path] = methods;
      }
    });

    return { ...spec, paths: filteredPaths };
  }, [searchQuery, filterOptions]);

  // Função auxiliar para coletar todos os IDs de nós da árvore
  const getAllNodeIds = useCallback((spec: OpenAPI.Document | null) => {
    const nodeIds = new Set<string>();
    
    if (!spec?.paths) return nodeIds;

    // Para cada path
    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      nodeIds.add(path); // Adiciona o path
      
      // Para cada método do path
      Object.entries(pathItem || {}).forEach(([method, operation]) => {
        if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) return;
        
        const methodNodeId = `${path}-${method}`;
        nodeIds.add(methodNodeId); // Adiciona o método
        
        // Adiciona parâmetros se existirem
        if (operation?.parameters?.length) {
          nodeIds.add(`${methodNodeId}-parameters`);
          operation.parameters.forEach((param: any) => {
            nodeIds.add(`${methodNodeId}-param-${param.name}`);
          });
        }
        
        // Adiciona respostas se existirem
        if (operation?.responses) {
          nodeIds.add(`${methodNodeId}-responses`);
          Object.keys(operation.responses).forEach(code => {
            nodeIds.add(`${methodNodeId}-response-${code}`);
          });
        }
      });
    });

    // Adiciona schemas se existirem
    if (spec.components?.schemas) {
      nodeIds.add('schemas');
      Object.keys(spec.components.schemas).forEach(schema => {
        nodeIds.add(`schema-${schema}`);
      });
    }

    return nodeIds;
  }, []);

  // Expande todos os nós
  const expandAll = useCallback(() => {
    if (!parsedSpec) return;
    setExpandedNodes(getAllNodeIds(parsedSpec));
  }, [parsedSpec, getAllNodeIds]);

  // Colapsa todos os nós
  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  // Toggle de um nó específico e seus filhos
  const toggleNode = useCallback((nodeId: string, recursive: boolean = false) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      
      if (next.has(nodeId)) {
        // Se está expandido, colapsa este nó e todos os seus filhos
        if (recursive && parsedSpec?.paths) {
          const allIds = Array.from(next);
          allIds.forEach(id => {
            if (id.startsWith(nodeId)) {
              next.delete(id);
            }
          });
        } else {
          next.delete(nodeId);
        }
      } else {
        // Se está colapsado, expande este nó e, se recursivo, todos os seus filhos
        next.add(nodeId);
        
        if (recursive && parsedSpec?.paths) {
          const path = nodeId;
          const pathItem = parsedSpec.paths[path];
          
          if (pathItem) {
            Object.entries(pathItem).forEach(([method, operation]) => {
              if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) return;
              
              const methodNodeId = `${path}-${method}`;
              next.add(methodNodeId);
              
              if (operation?.parameters?.length) {
                next.add(`${methodNodeId}-parameters`);
              }
              
              if (operation?.responses) {
                next.add(`${methodNodeId}-responses`);
              }
            });
          }
        }
      }
      
      return next;
    });
  }, [parsedSpec]);

  // Filter actions
  const toggleFilter = useCallback((key: keyof FilterOptions) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const toggleAllFilters = useCallback((value: boolean) => {
    setFilterOptions(prev => 
      Object.fromEntries(
        Object.keys(prev).map(key => [key, value])
      ) as FilterOptions
    );
  }, []);

  return {
    // State
    searchQuery,
    showFilters,
    parsedSpec,
    parseError,
    expandedNodes,
    viewMode,
    activeCategory,
    filterOptions,

    // Actions
    setSearchQuery,
    setShowFilters,
    parseSpec,
    filterEndpoints,
    expandAll,
    collapseAll,
    toggleNode,
    setViewMode,
    setActiveCategory,
    toggleFilter,
    toggleAllFilters
  };
} 