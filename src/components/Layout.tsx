import React from 'react';
import { cn } from '../lib/utils';
import Header from './Header';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Preview from './Preview';
import { parse } from 'yaml';

interface LayoutProps {
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ className }) => {
  const [showPreview, setShowPreview] = React.useState(true);
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [content, setContent] = React.useState('');
  const [parsedSpec, setParsedSpec] = React.useState<any>(null);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    try {
      const parsed = parse(value);
      setParsedSpec(parsed);
      setParseError(null);
    } catch (error) {
      setParseError((error as Error).message);
      setParsedSpec(null);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-background',
        isDarkMode ? 'dark' : '',
        className
      )}
    >
      <Header
        onTogglePreview={() => setShowPreview(!showPreview)}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        showPreview={showPreview}
        showSidebar={showSidebar}
        isDarkMode={isDarkMode}
      />
      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <Sidebar
            className="w-64 border-r"
            onClose={() => setShowSidebar(false)}
          />
        )}
        <div className="flex-1 flex">
          <Editor
            className="flex-1"
            content={content}
            onChange={handleContentChange}
            language="yaml"
          />
          {showPreview && (
            <Preview
              className="w-1/2 border-l"
              spec={parsedSpec}
              error={parseError}
              onClose={() => setShowPreview(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout; 