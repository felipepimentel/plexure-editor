import React from 'react';
import { AlertCircle, XCircle, CheckCircle, Wrench, X, Code, FileCode, Shield } from 'lucide-react';
import { ValidationResult } from '@/types/project';
import { cn } from '@/utils/cn';

interface ValidationPanelProps {
  results: ValidationResult[];
  error: string | null;
  isValidating: boolean;
  onFixIssue: (result: ValidationResult) => void;
  onIgnoreIssue: (result: ValidationResult) => void;
}

// Add validation categories
const VALIDATION_CATEGORIES = {
  SECURITY: 'security',
  SCHEMA: 'schema',
  STYLE: 'style',
  DOCUMENTATION: 'documentation'
} as const;

type ValidationCategory = typeof VALIDATION_CATEGORIES[keyof typeof VALIDATION_CATEGORIES];

interface EnhancedValidationResult extends ValidationResult {
  category: ValidationCategory;
  quickFix?: {
    title: string;
    description: string;
    action: () => void;
  };
}

export function ValidationPanel({
  results,
  error,
  isValidating,
  onFixIssue,
  onIgnoreIssue
}: ValidationPanelProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ValidationCategory | 'all'>('all');
  const [showIgnored, setShowIgnored] = React.useState(false);

  // Group results by category
  const groupedResults = React.useMemo(() => {
    return results.reduce((acc, result) => {
      const category = (result as EnhancedValidationResult).category || 'schema';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    }, {} as Record<string, ValidationResult[]>);
  }, [results]);

  // Filter results based on selected category
  const filteredResults = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return results;
    }
    return groupedResults[selectedCategory] || [];
  }, [results, selectedCategory, groupedResults]);

  // Get category counts
  const categoryCounts = React.useMemo(() => {
    return Object.entries(groupedResults).reduce((acc, [category, items]) => {
      acc[category] = items.length;
      return acc;
    }, {} as Record<string, number>);
  }, [groupedResults]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-200">Validation Results</h3>
            <p className="text-xs text-gray-400 mt-1">
              {isValidating ? 'Validating...' : 
               error ? 'Validation failed' :
               results.length === 0 ? 'No issues found' :
               `${results.length} issue${results.length === 1 ? '' : 's'} found`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIgnored(prev => !prev)}
              className={cn(
                "px-2 py-1 rounded text-xs",
                "transition-colors duration-200",
                showIgnored
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              {showIgnored ? 'Hide Ignored' : 'Show Ignored'}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-2 py-1 rounded text-xs whitespace-nowrap",
              "transition-colors duration-200",
              selectedCategory === 'all'
                ? "bg-blue-500/10 text-blue-400"
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            All ({results.length})
          </button>
          <button
            onClick={() => setSelectedCategory('security')}
            className={cn(
              "px-2 py-1 rounded text-xs whitespace-nowrap",
              "transition-colors duration-200",
              selectedCategory === 'security'
                ? "bg-red-500/10 text-red-400"
                : "text-gray-400 hover:text-gray-300",
              "flex items-center gap-1"
            )}
          >
            <Shield className="w-3 h-3" />
            Security ({categoryCounts.security || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('schema')}
            className={cn(
              "px-2 py-1 rounded text-xs whitespace-nowrap",
              "transition-colors duration-200",
              selectedCategory === 'schema'
                ? "bg-yellow-500/10 text-yellow-400"
                : "text-gray-400 hover:text-gray-300",
              "flex items-center gap-1"
            )}
          >
            <Code className="w-3 h-3" />
            Schema ({categoryCounts.schema || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('style')}
            className={cn(
              "px-2 py-1 rounded text-xs whitespace-nowrap",
              "transition-colors duration-200",
              selectedCategory === 'style'
                ? "bg-purple-500/10 text-purple-400"
                : "text-gray-400 hover:text-gray-300",
              "flex items-center gap-1"
            )}
          >
            <FileCode className="w-3 h-3" />
            Style ({categoryCounts.style || 0})
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="p-4">
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-400 flex-none mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-400">Validation Error</p>
                <p className="text-sm text-gray-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <CheckCircle className="w-8 h-8 mb-2" />
            <p className="text-sm">All validations passed</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredResults.map((result, index) => {
              const enhancedResult = result as EnhancedValidationResult;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    "border transition-colors duration-200",
                    enhancedResult.category === 'security'
                      ? "bg-red-500/10 border-red-500/20"
                      : enhancedResult.category === 'schema'
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : enhancedResult.category === 'style'
                      ? "bg-purple-500/10 border-purple-500/20"
                      : "bg-blue-500/10 border-blue-500/20"
                  )}
                >
                  <AlertCircle 
                    className={cn(
                      "w-5 h-5 flex-none mt-0.5",
                      enhancedResult.category === 'security'
                        ? "text-red-400"
                        : enhancedResult.category === 'schema'
                        ? "text-yellow-400"
                        : enhancedResult.category === 'style'
                        ? "text-purple-400"
                        : "text-blue-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-200">
                          {result.rule.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {enhancedResult.category.charAt(0).toUpperCase() + enhancedResult.category.slice(1)} Issue
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {enhancedResult.quickFix && (
                          <button
                            onClick={() => onFixIssue(result)}
                            className={cn(
                              "p-1 rounded-md",
                              "text-gray-400 hover:text-gray-300",
                              "hover:bg-gray-800",
                              "transition-colors duration-200",
                              "group relative"
                            )}
                          >
                            <Wrench className="w-4 h-4" />
                            <div className={cn(
                              "absolute bottom-full right-0 mb-2",
                              "w-48 p-2 rounded",
                              "bg-gray-800 border border-gray-700",
                              "text-xs text-gray-300",
                              "opacity-0 group-hover:opacity-100",
                              "transition-opacity duration-200",
                              "pointer-events-none"
                            )}>
                              <p className="font-medium">{enhancedResult.quickFix.title}</p>
                              <p className="text-gray-400 mt-1">{enhancedResult.quickFix.description}</p>
                            </div>
                          </button>
                        )}
                        <button
                          onClick={() => onIgnoreIssue(result)}
                          className={cn(
                            "p-1 rounded-md",
                            "text-gray-400 hover:text-gray-300",
                            "hover:bg-gray-800",
                            "transition-colors duration-200"
                          )}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {result.message && (
                      <p className="text-sm text-gray-400 mt-1">
                        {result.message}
                      </p>
                    )}
                    {result.path && (
                      <p className="text-xs font-mono text-gray-500 mt-2">
                        {result.path}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 