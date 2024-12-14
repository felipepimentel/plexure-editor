import React from 'react';
import { 
  HelpCircle, 
  Book, 
  Keyboard, 
  Github, 
  MessageCircle, 
  ExternalLink,
  FileJson,
  Code,
  Video,
  Lightbulb,
  Rocket,
  Search,
  Bookmark,
  Terminal,
  Zap,
  RefreshCw,
  ChevronRight,
  X,
  ArrowUpRight,
  Star
} from 'lucide-react';

interface HelpItem {
  label: string;
  description: string;
  link?: string;
  icon?: React.ElementType;
  onClick?: () => void;
  keywords?: string[];
  badge?: string;
  isNew?: boolean;
  isPinned?: boolean;
}

interface HelpSection {
  title: string;
  icon: React.ElementType;
  items: HelpItem[];
  description?: string;
}

export function Help() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [recentlyViewed, setRecentlyViewed] = React.useState<HelpItem[]>([]);
  const [pinnedItems, setPinnedItems] = React.useState<HelpItem[]>([]);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const sections: HelpSection[] = [
    {
      title: 'Getting Started',
      icon: Rocket,
      description: 'New to OpenAPI? Start here to learn the basics',
      items: [
        {
          label: 'Quick Start Guide',
          description: 'Learn the basics of using the OpenAPI Editor',
          icon: Rocket,
          link: 'https://swagger.io/docs/specification/basic-structure/',
          keywords: ['start', 'begin', 'tutorial', 'introduction', 'guide'],
          isNew: true
        },
        {
          label: 'Video Tutorial',
          description: 'Watch a quick tutorial on OpenAPI specification',
          icon: Video,
          link: 'https://www.youtube.com/watch?v=6kwmW_p_Tig',
          keywords: ['video', 'tutorial', 'watch', 'learn'],
          badge: '5 min'
        },
        {
          label: 'Interactive Tutorial',
          description: 'Learn by doing with our interactive guide',
          icon: Zap,
          onClick: () => {
            // TODO: Launch interactive tutorial
            console.log('Launch tutorial');
          },
          keywords: ['interactive', 'tutorial', 'guide', 'learn'],
          badge: 'Interactive'
        }
      ]
    },
    {
      title: 'OpenAPI Documentation',
      icon: Book,
      items: [
        {
          label: 'OpenAPI 3.0 Specification',
          description: 'Official OpenAPI 3.0 documentation',
          link: 'https://swagger.io/specification/',
          icon: Book,
          keywords: ['openapi', 'spec', 'documentation', 'official']
        },
        {
          label: 'Components & Schemas',
          description: 'Learn about reusable components and data models',
          link: 'https://swagger.io/docs/specification/components/',
          icon: FileJson,
          keywords: ['components', 'schemas', 'models', 'data']
        },
        {
          label: 'API Paths & Operations',
          description: 'Define your API endpoints and methods',
          link: 'https://swagger.io/docs/specification/paths-and-operations/',
          icon: Code,
          keywords: ['paths', 'endpoints', 'operations', 'methods']
        },
        {
          label: 'Authentication & Security',
          description: 'Learn about API security and authentication',
          link: 'https://swagger.io/docs/specification/authentication/',
          icon: Terminal,
          keywords: ['security', 'auth', 'authentication', 'oauth']
        }
      ]
    },
    {
      title: 'Editor Features',
      icon: Keyboard,
      items: [
        {
          label: 'Keyboard Shortcuts',
          description: 'View and customize keyboard shortcuts',
          icon: Keyboard,
          onClick: () => {
            // TODO: Show keyboard shortcuts modal
            console.log('Show keyboard shortcuts');
          },
          keywords: ['keyboard', 'shortcuts', 'hotkeys', 'keybindings']
        },
        {
          label: 'Editor Tips',
          description: 'Learn helpful tips and tricks for the editor',
          icon: Lightbulb,
          onClick: () => {
            // TODO: Show tips modal
            console.log('Show editor tips');
          },
          keywords: ['tips', 'tricks', 'help', 'editor']
        },
        {
          label: 'Code Snippets',
          description: 'Browse and use common OpenAPI code snippets',
          icon: Code,
          onClick: () => {
            // TODO: Show snippets panel
            console.log('Show snippets');
          },
          keywords: ['snippets', 'code', 'templates', 'examples']
        }
      ]
    },
    {
      title: 'Community & Support',
      icon: MessageCircle,
      items: [
        {
          label: 'Example Specifications',
          description: 'Browse example OpenAPI specifications',
          link: 'https://github.com/OAI/OpenAPI-Specification/tree/main/examples',
          icon: Github,
          keywords: ['examples', 'samples', 'specifications']
        },
        {
          label: 'Community Forum',
          description: 'Get help from the Swagger community',
          link: 'https://swagger.io/community/',
          icon: MessageCircle,
          keywords: ['community', 'forum', 'help', 'support']
        },
        {
          label: 'Best Practices',
          description: 'Learn OpenAPI best practices and conventions',
          icon: Bookmark,
          link: 'https://swagger.io/resources/articles/best-practices-in-api-design/',
          keywords: ['best practices', 'conventions', 'guidelines']
        }
      ]
    }
  ];

  // Filter sections based on search query
  const filteredSections = React.useMemo(() => {
    if (!searchQuery) return sections;

    const query = searchQuery.toLowerCase();
    return sections.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.keywords?.some(keyword => keyword.toLowerCase().includes(query))
      )
    })).filter(section => section.items.length > 0);
  }, [sections, searchQuery]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Esc to clear search
      if (e.key === 'Escape' && searchQuery) {
        e.preventDefault();
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Track recently viewed items
  const handleItemClick = (item: HelpItem) => {
    if (item.onClick) {
      item.onClick();
    }
    
    setRecentlyViewed(prev => {
      const newItems = prev.filter(i => i.label !== item.label);
      return [item, ...newItems].slice(0, 3);
    });
  };

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const togglePinned = (item: HelpItem) => {
    setPinnedItems(prev => {
      const isPinned = prev.some(i => i.label === item.label);
      if (isPinned) {
        return prev.filter(i => i.label !== item.label);
      }
      return [...prev, item].slice(0, 5); // Max 5 pinned items
    });
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Help Center</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-300"
            title="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2 border-b border-gray-800">
        <div className="relative group">
          <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles... (Ctrl + K)"
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md pl-9 pr-12 py-1.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 p-1 rounded-md hover:bg-gray-700/50 text-gray-500 hover:text-gray-400 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="absolute right-3 top-2 px-1.5 text-[10px] font-medium text-gray-500 bg-gray-800 rounded border border-gray-700 hidden group-focus-within:block">
            ESC
          </kbd>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-6">
          {/* Pinned Items */}
          {pinnedItems.length > 0 && !searchQuery && (
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <h3 className="text-xs font-medium text-blue-400 mb-3 flex items-center gap-2">
                <Star className="w-3 h-3" />
                Pinned
              </h3>
              <div className="space-y-2">
                {pinnedItems.map((item) => (
                  <HelpItem 
                    key={item.label} 
                    item={item} 
                    onClick={handleItemClick}
                    onPin={togglePinned}
                    isPinned
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && !searchQuery && (
            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-800">
              <h3 className="text-xs font-medium text-gray-400 mb-3 flex items-center gap-2">
                <RefreshCw className="w-3 h-3" />
                Recently Viewed
              </h3>
              <div className="space-y-2">
                {recentlyViewed.map((item) => (
                  <HelpItem 
                    key={item.label} 
                    item={item} 
                    onClick={handleItemClick}
                    onPin={togglePinned}
                    isPinned={pinnedItems.some(i => i.label === item.label)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sections */}
          {filteredSections.map((section) => (
            <div 
              key={section.title} 
              className={`bg-gray-800/30 rounded-lg border border-gray-800 transition-colors ${
                expandedSections[section.title] ? 'bg-gray-800/40' : ''
              }`}
            >
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full p-3 flex items-start gap-2 text-left group"
              >
                <section.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-300 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-300 group-hover:text-white">
                      {section.title}
                    </h3>
                    <ChevronRight 
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        expandedSections[section.title] ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                  {section.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {section.description}
                    </p>
                  )}
                </div>
              </button>
              
              {expandedSections[section.title] && (
                <div className="p-3 pt-0 space-y-2">
                  {section.items.map((item) => (
                    <HelpItem 
                      key={item.label} 
                      item={item} 
                      onClick={handleItemClick}
                      onPin={togglePinned}
                      isPinned={pinnedItems.some(i => i.label === item.label)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* No Results */}
          {searchQuery && filteredSections.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-sm text-gray-400 font-medium">
                No results found for "{searchQuery}"
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try searching with different keywords or{' '}
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none"
                >
                  browse all topics
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Help Item Component
function HelpItem({ 
  item, 
  onClick,
  onPin,
  isPinned = false
}: { 
  item: HelpItem; 
  onClick: (item: HelpItem) => void;
  onPin: (item: HelpItem) => void;
  isPinned?: boolean;
}) {
  const ItemIcon = item.icon || HelpCircle;
  const Component = item.link ? 'a' : 'button';
  
  return (
    <div className="group relative">
      <Component
        className="w-full p-2 flex items-start gap-3 rounded-md bg-gray-800/50 hover:bg-gray-800 text-left transition-colors"
        {...(item.link ? {
          href: item.link,
          target: "_blank",
          rel: "noopener noreferrer",
          onClick: () => onClick(item)
        } : {
          onClick: () => {
            item.onClick?.();
            onClick(item);
          }
        })}
      >
        <ItemIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-300 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 group-hover:text-white truncate">
              {item.label}
            </span>
            {item.isNew && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-500/20 text-blue-400 rounded-full">
                New
              </span>
            )}
            {item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-700 text-gray-400 rounded-full">
                {item.badge}
              </span>
            )}
            {item.link && (
              <ArrowUpRight className="w-3 h-3 text-gray-500 group-hover:text-gray-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 group-hover:text-gray-400 mt-0.5 line-clamp-2">
            {item.description}
          </p>
        </div>
      </Component>

      {/* Pin Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPin(item);
        }}
        className={`absolute right-2 top-2 p-1 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ${
          isPinned 
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
            : 'hover:bg-gray-700/50 text-gray-500 hover:text-gray-400'
        }`}
        title={isPinned ? 'Unpin' : 'Pin'}
      >
        <Star className="w-3 h-3" fill={isPinned ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
} 