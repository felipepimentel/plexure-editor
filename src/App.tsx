import React, { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Editor } from './components/Editor';
import { ShortcutsPanel } from './components/ShortcutsPanel';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectDetails } from './components/projects/ProjectDetails';
import { parseSpecification } from './utils/swagger';
import { storage } from './utils/storage';
import { DEFAULT_SPEC } from './constants';
import { useStyleGuideValidation } from './hooks/useStyleGuideValidation';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { usePreferences } from './hooks/usePreferences';
import { useProjects } from './hooks/useProjects';
import { LoginForm } from './components/auth/LoginForm';
import type { Project, ApiContract } from './types/project';

type AppView = 'projects' | 'project-details' | 'editor';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('projects');
  const [spec, setSpec] = useState(storage.loadSpec() || DEFAULT_SPEC);
  const [parsedSpec, setParsedSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ApiContract | null>(null);

  const { user, loading: authLoading, error: authError, retry: retryAuth } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { preferences, loading: prefsLoading, updatePreference } = usePreferences();
  const { 
    projects,
    selectedProject,
    setSelectedProject,
    contracts,
    styleGuides,
    loading: projectsLoading,
    createContract
  } = useProjects();
  
  const validationResults = useStyleGuideValidation(spec);

  // Event handlers
  const handleSave = () => {
    storage.saveSpec(spec);
  };

  const handleImport = async () => {
    try {
      const importedSpec = await storage.importSpec();
      setSpec(importedSpec);
    } catch (error) {
      console.error('Failed to import specification:', error);
    }
  };

  const handleExport = () => {
    storage.exportSpec(spec);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project-details');
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setCurrentView('projects');
  };

  const handleSelectContract = (contract: ApiContract) => {
    setSelectedContract(contract);
    setSpec(contract.spec);
    setCurrentView('editor');
  };

  const handleCreateContract = async () => {
    if (!selectedProject) return;

    const contract = await createContract(
      selectedProject.id,
      'New API Contract',
      '1.0.0',
      DEFAULT_SPEC,
      'A new API contract'
    );

    if (contract) {
      setSelectedContract(contract);
      setSpec(contract.spec);
      setCurrentView('editor');
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onToggleDarkMode: () => updatePreference('theme', preferences?.theme === 'dark' ? 'light' : 'dark'),
    onToggleShortcuts: () => setShowShortcuts(prev => !prev)
  });

  // Parse specification effect
  useEffect(() => {
    const parseSpec = async () => {
      const result = await parseSpecification(spec);
      setParsedSpec(result.spec);
      setError(result.error);
    };
    parseSpec();
  }, [spec]);

  if (authLoading || profileLoading || prefsLoading || projectsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{authError}</p>
          <button 
            onClick={retryAuth}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoginForm darkMode={preferences?.theme === 'dark'} />
      </div>
    );
  }

  const darkMode = preferences?.theme === 'dark';

  const renderContent = () => {
    switch (currentView) {
      case 'projects':
        return (
          <ProjectList
            darkMode={darkMode}
            onSelectProject={handleSelectProject}
          />
        );
      case 'project-details':
        return selectedProject ? (
          <ProjectDetails
            darkMode={darkMode}
            project={selectedProject}
            contracts={contracts}
            styleGuides={styleGuides}
            onBack={handleBackToProjects}
            onCreateContract={handleCreateContract}
            onSelectContract={handleSelectContract}
          />
        ) : null;
      case 'editor':
        return (
          <MainLayout
            darkMode={darkMode}
            breadcrumbs={preferences?.last_opened_path || ['root']}
            onBreadcrumbClick={path => updatePreference('last_opened_path', path)}
            errorCount={validationResults.filter(r => r.rule.severity === 'error').length}
            warningCount={validationResults.filter(r => r.rule.severity === 'warning').length}
            onDarkModeToggle={() => updatePreference('theme', darkMode ? 'light' : 'dark')}
            onSave={handleSave}
            onImport={handleImport}
            onExport={handleExport}
            spec={parsedSpec}
            validationResults={validationResults}
            userName={profile?.full_name || undefined}
            teamName={profile?.team?.name || undefined}
            userImage={profile?.avatar_url || undefined}
            currentView={preferences?.current_view || 'navigator'}
            onViewChange={view => updatePreference('current_view', view)}
            leftPanelWidth={preferences?.left_panel_width}
            rightPanelWidth={preferences?.right_panel_width}
            leftPanelCollapsed={preferences?.left_panel_collapsed}
            rightPanelCollapsed={preferences?.right_panel_collapsed}
            onPanelCollapse={(side, collapsed) => 
              updatePreference(
                side === 'left' ? 'left_panel_collapsed' : 'right_panel_collapsed',
                collapsed
              )
            }
            onPanelResize={(side, width) =>
              updatePreference(
                side === 'left' ? 'left_panel_width' : 'right_panel_width',
                width
              )
            }
          >
            <Editor
              value={spec}
              onChange={setSpec}
              darkMode={darkMode}
              onShowShortcuts={() => setShowShortcuts(true)}
              validationResults={validationResults}
            />

            {showShortcuts && (
              <ShortcutsPanel
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
                darkMode={darkMode}
              />
            )}
          </MainLayout>
        );
    }
  };

  return (
    <div className="h-screen">
      {renderContent()}
    </div>
  );
}

export default App;