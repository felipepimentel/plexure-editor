import React, { useState } from 'react';
import { 
  FileJson, 
  Users, 
  Book, 
  Plus, 
  ChevronLeft, 
  Globe, 
  Lock,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import type { Project, ApiContract, StyleGuide } from '../../types/project';

interface ProjectDetailsProps {
  darkMode: boolean;
  project: Project;
  contracts: ApiContract[];
  styleGuides: StyleGuide[];
  onBack: () => void;
  onCreateContract: () => void;
  onSelectContract: (contract: ApiContract) => void;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return darkMode 
          ? 'text-green-400 bg-green-900/20' 
          : 'text-green-700 bg-green-50';
      case 'review':
        return darkMode 
          ? 'text-yellow-400 bg-yellow-900/20' 
          : 'text-yellow-700 bg-yellow-50';
      default:
        return darkMode 
          ? 'text-gray-400 bg-gray-800' 
          : 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'review':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className={`p-1 rounded-lg ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className={`w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </button>
          <div>
            <h2 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {project.name}
            </h2>
            {project.description && (
              <p className={`text-sm mt-0.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            } ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {project.is_public ? (
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
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            } ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Users className="w-3.5 h-3.5" />
              <span>Team Project</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'contracts'
                ? darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>Contracts</span>
          </button>
          <button
            onClick={() => setActiveTab('style-guides')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'style-guides'
                ? darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Book className="w-4 h-4" />
            <span>Style Guides</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'members'
                ? darkMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-900'
                : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members</span>
          </button>
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
              <button
                onClick={onCreateContract}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">New Contract</span>
              </button>
            </div>

            <div className="grid gap-4">
              {contracts.map(contract => (
                <button
                  key={contract.id}
                  onClick={() => onSelectContract(contract)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    darkMode
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {contract.name}
                        </h4>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                          getStatusColor(contract.status)
                        }`}>
                          {getStatusIcon(contract.status)}
                          <span className="capitalize">{contract.status}</span>
                        </div>
                      </div>
                      {contract.description && (
                        <p className={`mt-1 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {contract.description}
                        </p>
                      )}
                      <div className={`mt-2 text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Version {contract.version}
                      </div>
                    </div>
                    <ChevronLeft className={`w-5 h-5 rotate-180 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>
                </button>
              ))}

              {contracts.length === 0 && (
                <div className={`text-center py-12 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <FileJson className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No contracts yet</p>
                  <p className="text-sm mt-1">Create your first API contract to get started</p>
                </div>
              )}
            </div>
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
              <button
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">New Style Guide</span>
              </button>
            </div>

            <div className="grid gap-4">
              {styleGuides.map(guide => (
                <div
                  key={guide.id}
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? 'border-gray-700 bg-gray-800'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {guide.name}
                        </h4>
                        {guide.is_active && (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                            darkMode
                              ? 'bg-green-900/20 text-green-400'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </div>
                        )}
                      </div>
                      {guide.description && (
                        <p className={`mt-1 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {guide.description}
                        </p>
                      )}
                      <div className={`mt-3 text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {guide.rules.length} rules
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {styleGuides.length === 0 && (
                <div className={`text-center py-12 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Book className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>No style guides yet</p>
                  <p className="text-sm mt-1">Create your first style guide to enforce API standards</p>
                </div>
              )}
            </div>
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
              <button
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Member</span>
              </button>
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