import React from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { ActivityBar } from './ActivityBar';
import { Explorer } from './Explorer';
import { EditorLayout } from '../editor/EditorLayout';
import { RightSidebarManager } from '../sidebar/RightSidebarManager';
import { StatusBar } from '../statusbar/StatusBar';
import { Header } from '../layout/Header';
import { CommandPalette } from '../ui/CommandPalette';
import { NotificationCenter } from '../ui/NotificationCenter';
import { FloatingCommandCenter } from '../ui/FloatingCommandCenter';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { TabBar } from './TabBar';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isExplorerOpen, setIsExplorerOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(true);
  const [activePanel, setActivePanel] = React.useState<'explorer' | 'search' | 'extensions'>('explorer');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = React.useState(false);

  // Project state
  const [project, setProject] = React.useState({
    name: 'API Project',
    branch: 'main',
    lastSaved: '2 mins ago',
    collaborators: 3,
    hasChanges: true
  });

  // Contract state
  const [contract, setContract] = React.useState({
    name: 'OpenAPI v3',
    version: '1.0.0',
    isValid: true,
    lastValidated: '5 mins ago'
  });

  // Style Guide state
  const [styleGuide, setStyleGuide] = React.useState({
    name: 'Default Guide',
    rulesCount: 15,
    enabled: true
  });

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <Header
        project={project}
        contract={contract}
        styleGuide={styleGuide}
        onProjectChange={(id) => console.log('Change project:', id)}
        onContractChange={(id) => console.log('Change contract:', id)}
        onStyleGuideChange={(id) => console.log('Change style guide:', id)}
        onPublish={() => console.log('Publish')}
        onSave={() => console.log('Save')}
        onShare={() => console.log('Share')}
        onSettings={() => console.log('Settings')}
        onHistory={() => console.log('History')}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <ActivityBar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
          onExplorerToggle={() => setIsExplorerOpen(prev => !prev)}
          onRightSidebarToggle={() => setIsRightSidebarOpen(prev => !prev)}
          onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)}
          onNotificationCenterOpen={() => setIsNotificationCenterOpen(true)}
        />

        {/* Resizable Layout */}
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar */}
          <AnimatePresence>
            {isExplorerOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-64 border-r border-gray-800"
              >
                <ResizablePanel
                  defaultSize={20}
                  minSize={15}
                  maxSize={30}
                  className="h-full"
                >
                  <Explorer activePanel={activePanel} />
                </ResizablePanel>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor Area */}
          <ResizablePanel defaultSize={60} minSize={30} className="h-full">
            <div className="h-full flex flex-col">
              {/* Navigation */}
              <div className="flex-none border-b border-gray-800">
                <div className="flex items-center">
                  <BreadcrumbNavigation />
                  <TabBar />
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-hidden">
                <EditorLayout />
              </div>
            </div>
          </ResizablePanel>

          {/* Right Sidebar */}
          <AnimatePresence>
            {isRightSidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-80 border-l border-gray-800"
              >
                <ResizablePanel
                  defaultSize={20}
                  minSize={15}
                  maxSize={40}
                  className="h-full"
                >
                  <RightSidebarManager />
                </ResizablePanel>
              </motion.div>
            )}
          </AnimatePresence>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <StatusBar
        project={project}
        contract={contract}
        onNotificationCenterOpen={() => setIsNotificationCenterOpen(true)}
      />

      {/* Overlays */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNotificationCenterOpen && (
          <NotificationCenter onClose={() => setIsNotificationCenterOpen(false)} />
        )}
      </AnimatePresence>

      <FloatingCommandCenter />
    </div>
  );
} 