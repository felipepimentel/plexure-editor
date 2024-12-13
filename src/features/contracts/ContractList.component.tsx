import React from 'react';
import { FileCode, ChevronRight, Globe, Lock } from 'lucide-react';
import { BaseList } from '../../ui/List';
import { BaseCard } from '../../ui/Card';

interface ContractListProps {
  contracts: any[];
  loading?: boolean;
  error?: string;
  darkMode: boolean;
  onSelectContract: (contract: any) => void;
}

export function ContractList({
  contracts,
  loading,
  error,
  darkMode,
  onSelectContract
}: ContractListProps) {
  return (
    <BaseList
      items={contracts}
      loading={loading}
      error={error}
      darkMode={darkMode}
      layout="list"
      emptyMessage={
        <div className={`text-center py-12 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <FileCode className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>No contracts found</p>
          <p className="text-sm mt-1">Create a new API contract to get started</p>
        </div>
      }
      renderItem={(contract) => (
        <BaseCard
          title={contract.name}
          subtitle={contract.description}
          darkMode={darkMode}
          onSelect={() => onSelectContract(contract)}
          actions={
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {contract.is_public ? (
                  <>
                    <Globe className="w-3.5 h-3.5" />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private</span>
                  </>
                )}
              </div>
              <ChevronRight className={`w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          }
          footer={
            <div className={`mt-3 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Last updated {new Date(contract.updated_at).toLocaleDateString()}
            </div>
          }
        />
      )}
      keyExtractor={(contract) => contract.id}
    />
  );
} 