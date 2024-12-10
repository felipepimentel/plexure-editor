import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore';

interface NavigationBreadcrumbProps {
  darkMode: boolean;
}

export function NavigationBreadcrumb({ darkMode }: NavigationBreadcrumbProps) {
  const { selectedPath } = useNavigationStore();

  if (!selectedPath) return null;

  const segments = selectedPath.split('.');

  return (
    <div className={`flex items-center gap-1 px-2 py-1 text-sm ${
      darkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>
      {segments.map((segment, index) => (
        <React.Fragment key={segment}>
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          <span className="hover:underline cursor-pointer">
            {segment}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}