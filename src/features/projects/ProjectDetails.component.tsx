import React, { useState } from 'react';
import { ArrowLeft, Plus, Book, Users, Globe, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BaseButton } from '../../ui/Button';
import { BaseList } from '../../ui/List';
import { BaseCard } from '../../ui/Card';

interface ProjectDetailsProps {
  darkMode: boolean;
  project: {
    id: string;
    name: string;
  };
  contracts: any[];
  styleGuides: any[];
  onBack: () => void;
  onCreateContract: () => void;
  onSelectContract: (contract: any) => void;
}

export function ProjectDetails({
  darkMode,
  project,
  contracts,
  styleGuides,
  onBack,
  onCreateContract,
  onSelectContract
}: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<'contracts' | 'style-guides' | 'members'>('contracts');

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4">
        <BaseButton
          onClick={onBack}
          variant="ghost"
          darkMode={darkMode}
          icon={<ArrowLeft className="w-4 h-4" />}
        />
        <h2 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {project.name}
        </h2>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex items-center gap-2 p-2">
          <BaseButton
            onClick={() => setActiveTab('contracts')}
            variant={activeTab === 'contracts' ? 'secondary' : 'ghost'}
            darkMode={darkMode}
            icon={<FileCode className="w-4 h-4" />}
          >
            Contracts
          </BaseButton>
          <BaseButton
            onClick={() => setActiveTab('style-guides')}
            variant={activeTab === 'style-guides' ? 'secondary' : 'ghost'}
            darkMode={darkMode}
            icon={<Book className="w-4 h-4" />}
          >
            Style Guides
          </BaseButton>
          <BaseButton
            onClick={() => setActiveTab('members')}
            variant={activeTab === 'members' ? 'secondary' : 'ghost'}
            darkMode={darkMode}
            icon={<Users className="w-4 h-4" />}
          >
            Members
          </BaseButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                API Contracts
              </h3>
              <BaseButton
                onClick={onCreateContract}
                darkMode={darkMode}
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                <span className="text-sm">New Contract</span>
              </BaseButton>
            </div>

            <BaseList
              items={contracts}
              darkMode={darkMode}
              layout="list"
              emptyMessage={
                <div className={`text-center py-12 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <FileCode className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No contracts yet</p>
                  <p className="text-sm mt-1">Create your first API contract to get started</p>
                </div>
              }
              renderItem={(contract) => (
                <BaseCard
                  title={contract.name}
                  subtitle={contract.description}
                  darkMode={darkMode}
                  onSelect={() => onSelectContract(contract)}
                  actions={
                    <ChevronRight className={`w-5 h-5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  }
                />
              )}
              keyExtractor={(contract) => contract.id}
            />
          </div>
        )}

        {activeTab === 'style-guides' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Style Guides
              </h3>
              <BaseButton
                darkMode={darkMode}
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                <span className="text-sm">New Guide</span>
              </BaseButton>
            </div>

            <BaseList
              items={styleGuides}
              darkMode={darkMode}
              layout="list"
              emptyMessage={
                <div className={`text-center py-12 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Book className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No style guides yet</p>
                  <p className="text-sm mt-1">Create your first style guide to enforce API standards</p>
                </div>
              }
              renderItem={(guide) => (
                <BaseCard
                  title={guide.name}
                  subtitle={guide.description}
                  darkMode={darkMode}
                  actions={
                    guide.is_active && (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        darkMode
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-green-50 text-green-700'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </div>
                    )
                  }
                  footer={
                    <div className={`mt-3 text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {guide.rules.length} rules
                    </div>
                  }
                />
              )}
              keyExtractor={(guide) => guide.id}
            />
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Team Members
              </h3>
              <BaseButton
                darkMode={darkMode}
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                <span className="text-sm">Add Member</span>
              </BaseButton>
            </div>

            <div className={`text-center py-12 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No members yet</p>
              <p className="text-sm mt-1">Invite team members to collaborate on this project</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 