import React, { useState } from 'react';
import { 
  Search, 
  History, 
  Settings, 
  HelpCircle, 
  Plus,
  Filter,
  RefreshCw,
  ChevronDown,
  FolderOpen,
  File,
  ChevronRight,
  X,
  ExternalLink,
  BookOpen,
  Github,
  LifeBuoy
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarManagerProps {
  activity: 'explorer' | 'search' | 'history' | 'settings' | 'help';
  content: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
}

interface SidebarSection {
  title: string;
  content: React.ReactNode;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  badge?: number;
  icon?: React.ReactNode;
}

export function SidebarManager({ activity, content, onNavigate, isCollapsed }: SidebarManagerProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  if (isCollapsed) return null;

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const renderSectionHeader = (section: SidebarSection) => (
    <button
      onClick={() => section.isCollapsible && toggleSection(section.title)}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-1.5",
        section.isCollapsible && "cursor-pointer hover:bg-gray-800/30",
        "group transition-colors duration-200"
      )}
    >
      {section.isCollapsible && (
        <ChevronRight 
          className={cn(
            "w-4 h-4 text-gray-500",
            "transition-transform duration-200",
            expandedSections[section.title] && "rotate-90"
          )} 
        />
      )}
      {section.icon && (
        <div className="text-gray-400 group-hover:text-gray-300">
          {section.icon}
        </div>
      )}
      <span className="text-xs font-medium text-gray-500 group-hover:text-gray-400">
        {section.title}
      </span>
      {section.badge && (
        <span className="ml-auto px-1.5 py-0.5 text-xs font-medium text-gray-400 bg-gray-800 rounded-full">
          {section.badge}
        </span>
      )}
    </button>
  );

  const renderSearchBar = () => (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search in files..."
        className={cn(
          'w-full px-3 py-1.5 pl-9',
          'text-sm bg-gray-800 text-gray-200',
          'border border-gray-700',
          'rounded-md',
          'placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-all duration-200'
        )}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-700"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
      )}
    </div>
  );

  const renderFilterBar = () => (
    <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-2">
      {['Files', 'Symbols', 'Commits', 'Changes'].map(filter => (
        <button
          key={filter}
          onClick={() => {
            setSelectedFilters(prev => 
              prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
            );
          }}
          className={cn(
            'px-2 py-1 text-xs rounded-full',
            'transition-all duration-200',
            selectedFilters.includes(filter)
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );

  const renderExplorer = () => {
    const sections: SidebarSection[] = [
      {
        title: 'OPEN EDITORS',
        isCollapsible: true,
        defaultExpanded: true,
        badge: 2,
        icon: <File className="w-4 h-4" />,
        content: (
          <div className="text-sm text-gray-400 py-1 px-4">
            No editors open
          </div>
        )
      },
      {
        title: 'PROJECT',
        isCollapsible: true,
        defaultExpanded: true,
        icon: <FolderOpen className="w-4 h-4" />,
        content: (
          <div className="space-y-1 py-1">
            <button className="w-full flex items-center gap-2 px-4 py-1 text-sm text-gray-300 hover:bg-gray-800/50">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              <span>src</span>
            </button>
            <button className="w-full flex items-center gap-2 px-6 py-1 text-sm text-gray-300 hover:bg-gray-800/50">
              <File className="w-4 h-4 text-gray-400" />
              <span>swagger.yaml</span>
            </button>
          </div>
        )
      }
    ];

    return sections.map((section, index) => (
      <div key={index} className="py-2">
        {renderSectionHeader(section)}
        {(expandedSections[section.title] ?? section.defaultExpanded) && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            {section.content}
          </div>
        )}
      </div>
    ));
  };

  const renderHelp = () => {
    const sections: SidebarSection[] = [
      {
        title: 'GETTING STARTED',
        isCollapsible: true,
        defaultExpanded: true,
        icon: <BookOpen className="w-4 h-4" />,
        content: (
          <div className="space-y-2 p-4">
            <a 
              href="#" 
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 group"
            >
              Introduction
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 group"
            >
              Keyboard Shortcuts
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        )
      },
      {
        title: 'RESOURCES',
        isCollapsible: true,
        defaultExpanded: true,
        icon: <LifeBuoy className="w-4 h-4" />,
        content: (
          <div className="space-y-2 p-4">
            <a 
              href="#" 
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 group"
            >
              <Github className="w-4 h-4" />
              GitHub Repository
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 group"
            >
              <BookOpen className="w-4 h-4" />
              Documentation
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        )
      }
    ];

    return sections.map((section, index) => (
      <div key={index} className="py-2">
        {renderSectionHeader(section)}
        {(expandedSections[section.title] ?? section.defaultExpanded) && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            {section.content}
          </div>
        )}
      </div>
    ));
  };

  const renderContent = () => {
    switch (activity) {
      case 'explorer':
        return renderExplorer();
      case 'search':
        return (
          <div className="p-4 space-y-4">
            {renderSearchBar()}
            {renderFilterBar()}
            <div className="text-sm text-gray-400">
              {searchQuery ? 'No results found' : 'Type to start searching'}
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-sm font-medium text-gray-300">Today</div>
                <div className="mt-2 text-sm text-gray-400">
                  No changes today
                </div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-sm font-medium text-gray-300">Yesterday</div>
                <div className="mt-2 text-sm text-gray-400">
                  No changes yesterday
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Theme</label>
              <select className="w-full px-3 py-1.5 text-sm bg-gray-800 text-gray-200 border border-gray-700 rounded-md">
                <option>Dark</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Font Size</label>
              <input 
                type="range" 
                min="12" 
                max="24" 
                className="w-full"
              />
            </div>
          </div>
        );
      case 'help':
        return renderHelp();
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderContent()}
    </div>
  );
} 