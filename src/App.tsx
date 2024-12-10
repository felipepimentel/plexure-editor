import React, { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Editor } from './components/Editor';
import { ShortcutsPanel } from './components/ShortcutsPanel';
import { parseSpecification } from './utils/swagger';
import { storage } from './utils/storage';
import { DEFAULT_SPEC } from './constants';
import { useStyleGuideValidation } from './hooks/useStyleGuideValidation';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAuth } from './hooks/useAuth';

function App() {
  const [spec, setSpec] = useState(storage.loadSpec() || DEFAULT_SPEC);
  const [parsedSpec, setParsedSpec] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);

  const { loading: authLoading, error: authError, retry: retryAuth } = useAuth();
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

  const handleNavigate = (path: string[]) => {
    setCurrentPath(path);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onToggleDarkMode: () => setDarkMode(prev => !prev),
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

  if (authLoading) {
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

  return (
    <MainLayout
      darkMode={darkMode}
      breadcrumbs={currentPath}
      onBreadcrumbClick={handleNavigate}
      errorCount={validationResults.filter(r => r.rule.severity === 'error').length}
      warningCount={validationResults.filter(r => r.rule.severity === 'warning').length}
      onDarkModeToggle={() => setDarkMode(prev => !prev)}
      onSave={handleSave}
      onImport={handleImport}
      onExport={handleExport}
      spec={parsedSpec}
      validationResults={validationResults}
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

export default App;