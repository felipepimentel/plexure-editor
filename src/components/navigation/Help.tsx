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
  Search,
  ChevronRight
} from 'lucide-react';

interface HelpItem {
  label: string;
  description: string;
  link?: string;
  icon?: React.ElementType;
  onClick?: () => void;
}

interface HelpSection {
  title: string;
  icon: React.ElementType;
  items: HelpItem[];
}

export function Help() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const sections: HelpSection[] = [
    {
      title: 'Documentation',
      icon: Book,
      items: [
        {
          label: 'OpenAPI Structure',
          description: 'Learn about the OpenAPI Specification format',
          icon: FileJson,
          link: 'https://swagger.io/specification/'
        },
        {
          label: 'API Endpoints',
          description: 'How to define API paths and operations',
          icon: Code,
          link: 'https://swagger.io/docs/specification/paths-and-operations/'
        }
      ]
    },
    {
      title: 'Editor',
      icon: Code,
      items: [
        {
          label: 'Keyboard Shortcuts',
          description: 'View editor shortcuts',
          icon: Keyboard,
          onClick: () => {
            console.log('Show keyboard shortcuts');
          }
        },
        {
          label: 'Code Snippets',
          description: 'Common OpenAPI snippets',
          icon: Code,
          onClick: () => {
            console.log('Show snippets');
          }
        }
      ]
    },
    {
      title: 'Resources',
      icon: Lightbulb,
      items: [
        {
          label: 'Examples',
          description: 'OpenAPI examples',
          icon: FileJson,
          link: 'https://github.com/OAI/OpenAPI-Specification/tree/main/examples'
        },
        {
          label: 'Community',
          description: 'Get help from the community',
          icon: MessageCircle,
          link: 'https://swagger.io/community/'
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
        item.description.toLowerCase().includes(query)
      )
    })).filter(section => section.items.length > 0);
  }, [sections, searchQuery]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Search Bar */}
      <div className="p-2 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-500" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="py-2">
          {filteredSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-2 py-1.5 flex items-center gap-2 text-left hover:bg-gray-800/50 group"
              >
                <ChevronRight 
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    expandedSections[section.title] ? 'rotate-90' : ''
                  }`} 
                />
                <section.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  {section.title}
                </span>
              </button>
              
              {expandedSections[section.title] && (
                <div className="ml-4 py-1 space-y-0.5">
                  {section.items.map((item) => (
                    <HelpItem key={item.label} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {searchQuery && filteredSections.length === 0 && (
            <div className="px-4 py-3 text-center">
              <p className="text-sm text-gray-400">
                No results found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HelpItem({ item }: { item: HelpItem }) {
  const ItemIcon = item.icon || HelpCircle;
  const Component = item.link ? 'a' : 'button';
  
  return (
    <Component
      className="w-full px-2 py-1.5 flex items-center gap-2 rounded hover:bg-gray-800/50 text-left group"
      {...(item.link ? {
        href: item.link,
        target: "_blank",
        rel: "noopener noreferrer"
      } : {
        onClick: item.onClick
      })}
    >
      <ItemIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-300 group-hover:text-white truncate">
            {item.label}
          </span>
          {item.link && (
            <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-gray-400" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">
          {item.description}
        </p>
      </div>
    </Component>
  );
} 