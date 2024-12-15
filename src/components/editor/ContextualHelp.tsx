import React from 'react';
import { cn } from '@/utils/cn';
import { Book, Code, Link } from 'lucide-react';

interface ContextualHelpProps {
  title: string;
  description: string;
  example?: string;
  links?: Array<{ title: string; url: string }>;
  className?: string;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  title,
  description,
  example,
  links,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg',
      'border border-gray-200 dark:border-gray-700',
      'max-w-md',
      className
    )}>
      <div className="flex items-center gap-2">
        <Book className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium">{title}</h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>

      {example && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Code className="w-4 h-4" />
            <span>Example</span>
          </div>
          <pre className="p-2 text-sm bg-gray-100 dark:bg-gray-900 rounded">
            <code>{example}</code>
          </pre>
        </div>
      )}

      {links && links.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link className="w-4 h-4" />
            <span>Learn More</span>
          </div>
          <div className="flex flex-col gap-1">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 