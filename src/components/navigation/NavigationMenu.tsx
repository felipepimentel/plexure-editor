import React from 'react';
import { 
  FileJson, 
  FolderTree, 
  History, 
  Users, 
  GitBranch,
  Share2,
  Book,
  Menu,
  ChevronRight
} from 'lucide-react';

interface NavigationMenuProps {
  darkMode: boolean;
  collapsed: boolean;
  activeItem: string;
  onItemSelect: (item: string) => void;
  onToggleCollapse: () => void;
}

export function NavigationMenu({
  darkMode,
  collapsed,
  activeItem,
  onItemSelect,
  onToggleCollapse
}: NavigationMenuProps) {
  const menuItems = [
    { 
      id: 'specification',
      label: 'Specification',
      items: [
        { id: 'spec', icon: FileJson, label: 'OpenAPI Spec' },
        { id: 'explorer', icon: FolderTree, label: 'Explorer' }
      ]
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      items: [
        { id: 'history', icon: History, label: 'History' },
        { id: 'team', icon: Users, label: 'Team' },
        { id: 'branches', icon: GitBranch, label: 'Branches' },
        { id: 'sharing', icon: Share2, label: 'Sharing' }
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation',
      items: [
        { id: 'docs', icon: Book, label: 'Documentation' }
      ]
    }
  ];

  return (
    <div className={`h-full flex flex-col overflow-hidden ${
      darkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`h-14 flex items-center justify-between flex-shrink-0 ${
        collapsed ? 'px-2' : 'px-4'
      } border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        {!collapsed && (
          <span className={`text-sm font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Menu
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg transition-colors ${
            darkMode
              ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          } ${collapsed ? 'w-full flex justify-center' : ''}`}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Items */}
      <div className={`flex-1 py-3 overflow-y-auto scrollbar-none ${
        collapsed ? 'px-2' : 'px-3'
      }`}>
        {menuItems.map((section, index) => (
          <div key={section.id} className={`
            ${index !== 0 && collapsed ? 'mt-3 pt-3 border-t ' : 'mb-6 last:mb-0'}
            ${darkMode ? 'border-gray-800' : 'border-gray-200'}
          `}>
            {/* Section Header */}
            {!collapsed && (
              <div className={`mb-2 px-3 flex items-center ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                <ChevronRight className="w-3 h-3" />
                <span className="text-xs font-semibold uppercase tracking-wider ml-1">
                  {section.label}
                </span>
              </div>
            )}

            {/* Section Items */}
            <div className={`space-y-1 ${collapsed ? 'relative' : ''}`}>
              {collapsed && (
                <div className={`
                  absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r
                  ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}
                `} />
              )}
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <div
                    key={item.id}
                    className="relative group"
                  >
                    <div className={`
                      relative flex
                      ${collapsed ? 'justify-center' : ''}
                    `}>
                      {/* Active Item Indicator */}
                      {isActive && (
                        <div className={`absolute ${
                          collapsed ? '-left-2' : 'left-0'
                        } top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${
                          darkMode ? 'bg-blue-500' : 'bg-blue-600'
                        }`} />
                      )}
                      
                      <button
                        onClick={() => onItemSelect(item.id)}
                        className={`
                          relative flex items-center gap-3 rounded-lg transition-all duration-200
                          ${collapsed 
                            ? 'w-10 h-10 justify-center p-2'
                            : 'w-full px-3 py-2'
                          }
                          ${isActive
                            ? darkMode
                              ? 'bg-gray-800 text-blue-400'
                              : 'bg-gray-100 text-blue-600'
                            : darkMode
                              ? 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${
                          isActive ? 'text-current' : ''
                        }`} />
                        
                        {!collapsed && (
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        )}

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                          <div className={`
                            fixed left-[4.5rem] ml-1 px-2.5 py-1.5 rounded-md whitespace-nowrap
                            text-sm font-medium opacity-0 group-hover:opacity-100 z-50
                            pointer-events-none transition-opacity duration-200 select-none
                            ${darkMode
                              ? 'bg-gray-800 text-gray-200 shadow-lg shadow-black/20'
                              : 'bg-white text-gray-900 shadow-lg shadow-black/10'
                            }
                          `}>
                            {item.label}
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 