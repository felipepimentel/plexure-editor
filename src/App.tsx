import yaml from 'js-yaml';
import { OpenAPI } from 'openapi-types';
import { useEffect, useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { EditorLayout } from './components/layout/EditorLayout';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';
import { useNavigation, NavigationItem } from './hooks/useNavigation';
import { usePreferences } from './hooks/usePreferences';
import { useProfile } from './hooks/useProfile';
import { useTheme } from './hooks/useTheme';
import { EditorPreferences } from './types/preferences';
import { ApiContract, Project } from './types/project';

const DEFAULT_SPEC = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API to demonstrate Swagger/OpenAPI specification
paths:
  /users:
    get:
      summary: Get all users
      description: Returns a list of users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string`;

export default function App() {
  // Core state
  const [spec, setSpec] = useState<string>(DEFAULT_SPEC);
  const [parsedSpec, setParsedSpec] = useState<OpenAPI.Document | null>(null);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [activePanel, setActivePanel] = useState<string>('preview');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['root']);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>();
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);

  // Project and contract state
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [contracts, setContracts] = useState<ApiContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<ApiContract | null>(null);

  // Auth and preferences hooks
  const { user, loading: authLoading, error: authError, retry: retryAuth, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { preferences, loading: prefsLoading, updatePreference } = usePreferences();

  // Editor state
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [documentInfo, setDocumentInfo] = useState({
    lineCount: spec.split('\n').length,
    version: '1.0.0',
    format: 'yaml' as const
  });
  const warningCount = validationResults.filter(r => r.rule.severity === 'warning').length;

  // Novo estado para navegação
  const [activeNavigationItem, setActiveNavigationItem] = useState('spec');
  const [navigationCollapsed, setNavigationCollapsed] = useState(true);

  const { darkMode, toggleDarkMode } = useTheme();

  // Substituir os estados de navegação existentes pelo hook
  const {
    activeSection,
    activeItem,
    handleItemSelect
  } = useNavigation(parsedSpec);

  // Atualizar o parsedSpec quando o spec mudar
  useEffect(() => {
    try {
      const parsed = yaml.load(spec) as OpenAPI.Document;
      setParsedSpec(parsed);
    } catch (error) {
      console.error('Error parsing spec:', error);
      setParsedSpec(null);
    }
  }, [spec]);

  // Loading state
  if (authLoading || profileLoading || prefsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1B1F2A]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (authError) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#1B1F2A]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to authenticate</p>
          <button
            onClick={retryAuth}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <LoginForm darkMode={darkMode} />;
  }

  const errorCount = validationResults.filter(r => r.rule.severity === 'error').length;

  // Event handlers
  const handleDarkModeToggle = () => {
    updatePreference('theme', darkMode ? 'light' : 'dark');
  };

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Save clicked');
  };

  const handleImport = async () => {
    // TODO: Implement import functionality
    console.log('Import clicked');
  };

  const handleExport = async () => {
    // TODO: Implement export functionality
    console.log('Export clicked');
  };

  const handleCreateProject = (data: { name: string; description: string; isPublic: boolean }) => {
    // TODO: Implement project creation
    console.log('Create project:', data);
  };

  const handleCreateContract = () => {
    // TODO: Implement contract creation
    console.log('Create contract clicked');
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSelectContract = (contract: ApiContract) => {
    setSelectedContract(contract);
  };

  const handlePanelCollapse = (side: 'left' | 'right', collapsed: boolean) => {
    updatePreference(
      side === 'left' ? 'left_panel_collapsed' : 'right_panel_collapsed',
      collapsed
    );
  };

  const handlePanelResize = (side: 'left' | 'right', width: number) => {
    updatePreference(
      side === 'left' ? 'left_panel_width' : 'right_panel_width',
      width
    );
  };

  const handleBreadcrumbClick = (path: string[]) => {
    setBreadcrumbs(path);
  };

  // Event handlers for editor actions
  const handleUndo = () => {
    // TODO: Implement undo functionality
    console.log('Undo clicked');
  };

  const handleRedo = () => {
    // TODO: Implement redo functionality
    console.log('Redo clicked');
  };

  const handleFormat = () => {
    // TODO: Implement format functionality
    console.log('Format clicked');
  };

  const handlePathSelect = (path: string) => {
    setSelectedPath(path);
    // TODO: Implement path selection logic
    console.log('Selected path:', path);
  };

  // Create a safe preferences object for the editor
  const editorPreferences: EditorPreferences = {
    left_panel_collapsed: preferences?.left_panel_collapsed || false,
    right_panel_collapsed: preferences?.right_panel_collapsed || false
  };

  // Event handlers para as novas funcionalidades
  const handleShare = () => {
    // TODO: Implementar compartilhamento
    console.log('Share clicked');
  };

  const handleHistory = () => {
    setActiveNavigationItem('history');
    // TODO: Implementar visualização do histórico
    console.log('History clicked');
  };

  const handleSettings = () => {
    setActiveNavigationItem('settings');
    // TODO: Implementar configurações
    console.log('Settings clicked');
  };

  const handleProfile = () => {
    // TODO: Implementar perfil
    console.log('Profile clicked');
  };

  const handleNavigationItemSelect = (item: string) => {
    handleItemSelect(item as NavigationItem);
    
    // Implementar comportamentos específicos para cada item
    switch (item) {
      case 'spec':
        // Mostrar o editor principal
        break;
      case 'explorer':
        // Mostrar o explorador de API
        break;
      case 'history':
        // Mostrar histórico de alterações
        break;
      case 'team':
        // Mostrar configurações de equipe
        break;
      case 'branches':
        // Mostrar gerenciamento de branches
        break;
      case 'sharing':
        // Mostrar opções de compartilhamento
        break;
      case 'docs':
        // Mostrar documentação
        break;
    }
  };

  return (
    <MainLayout
      darkMode={darkMode}
      onDarkModeToggle={toggleDarkMode}
      userName={user.email}
      projectName={selectedProject?.name}
      errorCount={errorCount}
      isEditorMaximized={isEditorMaximized}
      isPanelLeftCollapsed={preferences?.left_panel_collapsed || false}
      isPanelRightCollapsed={preferences?.right_panel_collapsed || false}
      onToggleEditorMaximize={() => setIsEditorMaximized(!isEditorMaximized)}
      onToggleLeftPanel={() => handlePanelCollapse('left', !preferences?.left_panel_collapsed)}
      onToggleRightPanel={() => handlePanelCollapse('right', !preferences?.right_panel_collapsed)}
      navigationCollapsed={navigationCollapsed}
      activeNavigationItem={activeItem}
      onNavigationItemSelect={handleNavigationItemSelect}
      onNavigationCollapse={() => setNavigationCollapsed(!navigationCollapsed)}
    >
      {/* Renderização condicional baseada no item ativo */}
      {activeItem === 'spec' ? (
        <EditorLayout
          darkMode={darkMode}
          spec={spec}
          parsedSpec={parsedSpec}
          validationResults={validationResults}
          preferences={editorPreferences}
          onSpecChange={setSpec}
          onShowShortcuts={() => setShowShortcuts(true)}
          onSave={handleSave}
          onImport={handleImport}
          onExport={handleExport}
          onFormat={handleFormat}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          selectedPath={selectedPath}
          onPathSelect={handlePathSelect}
          cursorPosition={cursorPosition}
          documentInfo={documentInfo}
          errorCount={errorCount}
          warningCount={warningCount}
          onPanelCollapse={handlePanelCollapse}
        />
      ) : activeItem === 'explorer' ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">API Explorer (Em desenvolvimento)</p>
        </div>
      ) : activeItem === 'history' ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">History View (Em desenvolvimento)</p>
        </div>
      ) : activeItem === 'team' ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Team Management (Em desenvolvimento)</p>
        </div>
      ) : activeItem === 'branches' ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Branch Management (Em desenvolvimento)</p>
        </div>
      ) : activeItem === 'sharing' ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Sharing Options (Em desenvolvimento)</p>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Documentation (Em desenvolvimento)</p>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <KeyboardShortcuts
          darkMode={darkMode}
          onClose={() => setShowShortcuts(false)}
        />
      )}
    </MainLayout>
  );
}