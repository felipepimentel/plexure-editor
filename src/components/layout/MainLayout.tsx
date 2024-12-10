import React, { useState } from 'react';
import { Header } from '../Header';
import { Breadcrumbs } from '../navigation/Breadcrumbs';
import { ErrorBoundary } from '../error/ErrorBoundary';
import { StatusBar } from './StatusBar';
import { Sidebar } from './Sidebar';
import { NavigatorWidget } from '../widgets/NavigatorWidget';
import { PreviewWidget } from '../widgets/PreviewWidget';
import { StyleGuideWidget } from '../widgets/StyleGuideWidget';
import { SearchWidget } from '../widgets/SearchWidget';
import { SpecificationManager } from '../SpecificationManager';
import { ResizablePanel } from '../common/ResizablePanel';

interface MainLayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  breadcrumbs: string[];
  onBreadcrumbClick: (path: string[]) => void;
  errorCount: number;
  warningCount: number;
  onDarkModeToggle: () => void;
  onSave: () => void;
  onImport: () => void;
  onExport: () => void;
  spec: any;
  validationResults: any[];
}

export function MainLayout({
  children,
  darkMode,
  breadcrumbs,
  onBreadcrumbClick,
  errorCount,
  warningCount,
  onDarkModeToggle,
  onSave,
  onImport,
  onExport,
  spec,
  validationResults
}: MainLayoutProps) {
  const [currentView, setCurrentView] = useState('navigator');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const renderSidePanel = () => {
    switch (currentView) {
      case 'navigator':
        return <NavigatorWidget spec={spec} darkMode={darkMode} onNavigate={onBreadcrumbClick} />;
      case 'search':
        return <SearchWidget darkMode={darkMode} spec={spec} />;
      case 'styleguide':
        return (
          <StyleGuideWidget
            validationResults={validationResults}
            darkMode={darkMode}
            onClose={() => setCurrentView('navigator')}
          />
        );
      case 'specifications':
        return <SpecificationManager darkMode={darkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        darkMode={darkMode}
        onDarkModeToggle={onDarkModeToggle}
        onSave={onSave}
        onImport={onImport}
        onExport={onExport}
        className="h-12 px-4"
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar 
          darkMode={darkMode} 
          onViewChange={setCurrentView}
          currentView={currentView}
        />
        <div className="flex-1 flex min-w-0">
          <ResizablePanel 
            side="left" 
            darkMode={darkMode} 
            defaultWidth={320}
            minWidth={240}
            maxWidth={480}
            isCollapsed={leftPanelCollapsed}
            onCollapse={() => setLeftPanelCollapsed(true)}
            onExpand={() => setLeftPanelCollapsed(false)}
          >
            {renderSidePanel()}
          </ResizablePanel>
          <div className="flex-1 flex flex-col min-w-0">
            <Breadcrumbs 
              path={breadcrumbs} 
              darkMode={darkMode} 
              onNavigate={onBreadcrumbClick} 
            />
            <div className="flex-1 min-h-0">
              <ErrorBoundary>
                <div className="h-full flex">
                  <div className="flex-1 min-w-0">
                    {children}
                  </div>
                  <ResizablePanel 
                    side="right" 
                    darkMode={darkMode} 
                    defaultWidth={480}
                    minWidth={320}
                    maxWidth={720}
                    isCollapsed={rightPanelCollapsed}
                    onCollapse={() => setRightPanelCollapsed(true)}
                    onExpand={() => setRightPanelCollapsed(false)}
                  >
                    <PreviewWidget spec={spec} error={null} darkMode={darkMode} />
                  </ResizablePanel>
                </div>
              </ErrorBoundary>
            </div>
            <StatusBar 
              darkMode={darkMode} 
              errorCount={errorCount} 
              warningCount={warningCount} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}