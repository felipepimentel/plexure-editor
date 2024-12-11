import React, { useState, useMemo } from 'react';
import { OpenAPI } from 'openapi-types';
import { 
  Code2, 
  FileJson, 
  Info, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Copy, 
  ExternalLink,
  AlertCircle,
  User,
  Shield,
  Tag,
  XCircle,
  AlertTriangle,
  ArrowRight,
  AlertOctagon,
  Eye
} from 'lucide-react';

interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface PreviewPanelProps {
  spec: OpenAPI.Document | null;
  darkMode: boolean;
  errors: ValidationError[];
  collapsed?: boolean;
}

export function PreviewPanel({
  spec,
  darkMode,
  errors,
  collapsed = false
}: PreviewPanelProps) {
  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button className="p-2 rounded-lg hover:bg-gray-800">
          <Eye className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <h2 className={`font-medium ${
          darkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          Preview
        </h2>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        {spec ? (
          <div className={`h-full overflow-auto ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{spec.info?.title || 'API Documentation'}</h1>
              <p className="text-sm mb-6">{spec.info?.description}</p>
              
              {/* API Endpoints */}
              <div className="space-y-6">
                {Object.entries(spec.paths || {}).map(([path, methods]: [string, any]) => (
                  <div key={path} className="space-y-2">
                    {Object.entries(methods).map(([method, details]: [string, any]) => (
                      <div
                        key={`${path}-${method}`}
                        className={`p-4 rounded-lg ${
                          darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                            method === 'get' ? 'bg-blue-500/10 text-blue-500' :
                            method === 'post' ? 'bg-green-500/10 text-green-500' :
                            method === 'put' ? 'bg-yellow-500/10 text-yellow-500' :
                            method === 'delete' ? 'bg-red-500/10 text-red-500' :
                            'bg-gray-500/10 text-gray-500'
                          }`}>
                            {method}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-medium">{path}</h3>
                            <p className="text-sm mt-1 text-gray-400">{details.summary}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Info className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No API specification loaded
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Please load a valid OpenAPI specification
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 