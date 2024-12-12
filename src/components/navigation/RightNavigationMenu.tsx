import React from 'react';
import { Eye, AlertCircle } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

interface RightNavigationMenuProps {
  darkMode: boolean;
  collapsed: boolean;
  activeItem: 'preview' | 'validation';
  onItemSelect: (item: 'preview' | 'validation') => void;
  validationCount?: number;
}

export function RightNavigationMenu({
  darkMode,
  collapsed,
  activeItem,
  onItemSelect,
  validationCount = 0
}: RightNavigationMenuProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Navigation Items - Ajustado padding-top para manter alinhamento */}
      <div className="flex flex-col items-center pt-[49px] space-y-3">
        <Tooltip content="Preview" side="left">
          <button
            onClick={() => onItemSelect('preview')}
            className={`
              relative w-10 h-10 flex items-center justify-center rounded-lg
              transition-all duration-200
              ${activeItem === 'preview'
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            <Eye className="w-5 h-5" />
          </button>
        </Tooltip>

        <Tooltip content="Validation" side="left">
          <button
            onClick={() => onItemSelect('validation')}
            className={`
              relative w-10 h-10 flex items-center justify-center rounded-lg
              transition-all duration-200
              ${activeItem === 'validation'
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            <AlertCircle className="w-5 h-5" />
            {validationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                flex items-center justify-center rounded-full text-xs font-medium
                bg-red-500/20 text-red-400"
              >
                {validationCount}
              </span>
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
} 