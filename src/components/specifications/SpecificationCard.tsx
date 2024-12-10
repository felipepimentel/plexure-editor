import React from 'react';
import { FileJson, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { Specification } from '../../services/specificationService';
import { SpecificationStats } from './SpecificationStats';

interface SpecificationCardProps {
  specification: Specification;
  isSelected: boolean;
  darkMode: boolean;
  onSelect: (spec: Specification) => void;
  onEdit: (spec: Specification) => void;
  onDelete: (id: string) => void;
}

export function SpecificationCard({
  specification,
  isSelected,
  darkMode,
  onSelect,
  onEdit,
  onDelete
}: SpecificationCardProps) {
  return (
    <div
      className={`group relative p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? darkMode
            ? 'bg-gray-700 ring-1 ring-blue-500'
            : 'bg-gray-100 ring-1 ring-blue-500'
          : darkMode
          ? 'hover:bg-gray-800'
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect(specification)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg transition-colors ${
          darkMode 
            ? 'bg-gray-600 group-hover:bg-gray-700' 
            : 'bg-gray-100 group-hover:bg-white'
        }`}>
          <FileJson className={`w-5 h-5 ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={`font-medium truncate ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {specification.name}
              </h4>
              <div className={`mt-1 text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Version {specification.version}
              </div>
            </div>
            
            <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(specification);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                }`}
                title="Edit specification"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(specification.id);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400' 
                    : 'hover:bg-gray-200 text-gray-600 hover:text-red-600'
                }`}
                title="Delete specification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <SpecificationStats 
            specification={specification}
            darkMode={darkMode}
          />
        </div>
      </div>

      {isSelected && (
        <div className={`absolute -right-px -top-px p-1.5 rounded-bl-lg rounded-tr-lg ${
          darkMode ? 'bg-blue-500' : 'bg-blue-500'
        }`}>
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </div>
  );
}