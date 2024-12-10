import React, { useEffect, useState, useCallback } from 'react';
import { useSpecificationStore } from '../../store/specificationStore';
import { Specification } from '../../services/specificationService';
import { EmptyState } from './EmptyState';
import { SpecificationHeader } from './SpecificationHeader';
import { SpecificationCard } from './SpecificationCard';
import { Loader2 } from 'lucide-react';

interface SpecificationsProps {
  darkMode: boolean;
}

export function Specifications({ darkMode }: SpecificationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState<Specification | null>(null);
  
  const { 
    specifications,
    loading,
    error,
    fetchSpecifications,
    createSpecification,
    updateSpecification,
    deleteSpecification,
    setCurrentSpec
  } = useSpecificationStore();

  useEffect(() => {
    fetchSpecifications();
  }, [fetchSpecifications]);

  const filteredSpecifications = specifications.filter(spec => 
    spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = useCallback(async () => {
    const newSpec = {
      name: 'New API Specification',
      version: '1.0.0',
      content: JSON.stringify({
        openapi: '3.0.0',
        info: {
          title: 'New API',
          version: '1.0.0'
        },
        paths: {}
      }, null, 2)
    };

    await createSpecification(newSpec);
  }, [createSpecification]);

  const handleEdit = useCallback((spec: Specification) => {
    setCurrentSpec(spec);
  }, [setCurrentSpec]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this specification?')) {
      await deleteSpecification(id);
      if (selectedSpec?.id === id) {
        setSelectedSpec(null);
      }
    }
  }, [deleteSpecification, selectedSpec]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className={`w-8 h-8 animate-spin ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className={`text-lg font-medium mb-2 ${
            darkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            Failed to load specifications
          </p>
          <button
            onClick={() => fetchSpecifications()}
            className={`px-4 py-2 rounded-lg transition-colors ${
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

  if (specifications.length === 0) {
    return <EmptyState darkMode={darkMode} onCreateNew={handleCreateNew} />;
  }

  return (
    <div className="h-full flex flex-col">
      <SpecificationHeader
        darkMode={darkMode}
        onCreateNew={handleCreateNew}
        onSearch={setSearchQuery}
        specCount={specifications.length}
      />
      
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {filteredSpecifications.map(spec => (
            <SpecificationCard
              key={spec.id}
              specification={spec}
              isSelected={selectedSpec?.id === spec.id}
              darkMode={darkMode}
              onSelect={(spec) => {
                setSelectedSpec(spec);
                setCurrentSpec(spec);
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 