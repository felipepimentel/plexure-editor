import React, { useState } from 'react';
import { useSpecificationStore } from '../store/specificationStore';
import { SpecificationHeader } from './specifications/SpecificationHeader';
import { SpecificationCard } from './specifications/SpecificationCard';
import { SpecificationEditor } from './SpecificationEditor';
import { EmptyState } from './specifications/EmptyState';
import { Widget } from './widgets/Widget';

interface SpecificationManagerProps {
  darkMode: boolean;
}

export function SpecificationManager({ darkMode }: SpecificationManagerProps) {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    specifications,
    currentSpec,
    loading,
    error,
    createSpecification,
    updateSpecification,
    deleteSpecification,
    setCurrentSpec
  } = useSpecificationStore();

  const filteredSpecs = specifications.filter(spec => 
    spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (values: any) => {
    await createSpecification(values);
    setMode('list');
  };

  const handleUpdate = async (values: any) => {
    if (currentSpec) {
      await updateSpecification(currentSpec.id, values);
      setMode('list');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this specification?')) {
      await deleteSpecification(id);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={`h-full flex items-center justify-center ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="flex flex-col items-center gap-3">
            <div className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`} />
            <span className="text-sm">Loading specifications...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`px-4 py-2 rounded-lg text-sm ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (mode === 'list') {
      if (specifications.length === 0) {
        return <EmptyState darkMode={darkMode} onCreateNew={() => setMode('create')} />;
      }

      return (
        <>
          <SpecificationHeader
            darkMode={darkMode}
            onCreateNew={() => setMode('create')}
            onSearch={setSearchQuery}
            specCount={specifications.length}
          />
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-3">
              {filteredSpecs.length === 0 ? (
                <div className={`text-center py-12 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <p className="text-sm">No specifications found matching your search</p>
                </div>
              ) : (
                filteredSpecs.map(spec => (
                  <SpecificationCard
                    key={spec.id}
                    specification={spec}
                    isSelected={currentSpec?.id === spec.id}
                    darkMode={darkMode}
                    onSelect={setCurrentSpec}
                    onEdit={(spec) => {
                      setCurrentSpec(spec);
                      setMode('edit');
                    }}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </>
      );
    }

    return (
      <SpecificationEditor
        initialValues={mode === 'edit' ? currentSpec : undefined}
        darkMode={darkMode}
        onSave={mode === 'create' ? handleCreate : handleUpdate}
        onCancel={() => setMode('list')}
      />
    );
  };

  return (
    <Widget title="Specifications" darkMode={darkMode}>
      <div className="h-full flex flex-col">
        {renderContent()}
      </div>
    </Widget>
  );
}