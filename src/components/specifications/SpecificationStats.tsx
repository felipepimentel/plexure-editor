import React from 'react';
import { Hash, GitBranch, Clock } from 'lucide-react';
import { Specification } from '../../services/specificationService';

interface SpecificationStatsProps {
  specification: Specification;
  darkMode: boolean;
}

export function SpecificationStats({ specification, darkMode }: SpecificationStatsProps) {
  const getEndpointCount = (content: string) => {
    try {
      const spec = JSON.parse(content);
      return Object.keys(spec.paths || {}).length;
    } catch {
      return 0;
    }
  };

  return (
    <div className={`mt-2 grid grid-cols-3 gap-2 p-2 rounded-lg ${
      darkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="flex items-center gap-1.5">
        <Hash className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {getEndpointCount(specification.content)} endpoints
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <GitBranch className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          main
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {new Date(specification.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}