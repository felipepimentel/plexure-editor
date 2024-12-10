import React from 'react';
import { FileJson, Trash2, Edit2, Clock, Tag } from 'lucide-react';
import { Specification } from '../services/specificationService';

interface SpecificationListProps {
  specifications: Specification[];
  currentSpec: Specification | null;
  darkMode: boolean;
  onSelect: (spec: Specification) => void;
  onDelete: (id: string) => void;
  onEdit: (spec: Specification) => void;
}

export function SpecificationList({
  specifications,
  currentSpec,
  darkMode,
  onSelect,
  onDelete,
  onEdit
}: SpecificationListProps) {
  if (specifications.length === 0) {
    return (
      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No specifications found
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-2 p-4">
      {specifications.map(spec => (
        <div
          key={spec.id}
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            currentSpec?.id === spec.id
              ? darkMode
                ? 'bg-gray-700'
                : 'bg-gray-200'
              : darkMode
              ? 'hover:bg-gray-800'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelect(spec)}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-600' : 'bg-gray-100'
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
                    {spec.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Tag className={`w-3.5 h-3.5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        v{spec.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className={`w-3.5 h-3.5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatDate(spec.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(spec);
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
                      onDelete(spec.id);
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}