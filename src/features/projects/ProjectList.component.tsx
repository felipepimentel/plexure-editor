import React, { useState } from 'react';
import { Plus, FolderGit2, Users, Globe, Lock, ChevronRight } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types/project';
import { BaseButton } from '../../ui/Button';
import { BaseList } from '../../ui/List';
import { BaseCard } from '../../ui/Card';
import { BaseModal, BaseModalActions } from '../../ui/Modal';
import { BaseForm, BaseFormField, BaseFormInput, BaseFormTextArea } from '../../ui/Form';

interface ProjectListProps {
  darkMode: boolean;
  onSelectProject: (project: Project) => void;
}

export function ProjectList({ darkMode, onSelectProject }: ProjectListProps) {
  const { projects, loading, error, createProject } = useProjects();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  const handleCreateProject = async () => {
    const project = await createProject(
      newProjectData.name,
      newProjectData.description,
      newProjectData.isPublic
    );
    if (project) {
      setShowNewProjectModal(false);
      setNewProjectData({ name: '', description: '', isPublic: false });
      onSelectProject(project);
    }
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Projects
        </h2>
        <BaseButton
          onClick={() => setShowNewProjectModal(true)}
          darkMode={darkMode}
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          <span className="text-sm">New Project</span>
        </BaseButton>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-auto p-4">
        <BaseList
          items={projects}
          loading={loading}
          error={error}
          darkMode={darkMode}
          layout="list"
          emptyMessage={
            <div className={`text-center py-12 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FolderGit2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No projects yet</p>
              <p className="text-sm mt-1">Create your first project to get started</p>
            </div>
          }
          renderItem={(project) => (
            <BaseCard
              title={project.name}
              subtitle={project.description}
              darkMode={darkMode}
              onSelect={() => onSelectProject(project)}
              actions={
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
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
                  <div className={`flex items-center gap-1 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Users className="w-3.5 h-3.5" />
                    <span>Team Project</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              }
            />
          )}
          keyExtractor={(project) => project.id}
        />
      </div>

      {/* New Project Modal */}
      <BaseModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        darkMode={darkMode}
        title="Create New Project"
        size="md"
      >
        <BaseForm darkMode={darkMode} spacing="md">
          <BaseFormField label="Project Name" darkMode={darkMode}>
            <BaseFormInput
              type="text"
              value={newProjectData.name}
              onChange={e => setNewProjectData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              placeholder="Enter project name"
              darkMode={darkMode}
            />
          </BaseFormField>

          <BaseFormField label="Description" darkMode={darkMode}>
            <BaseFormTextArea
              value={newProjectData.description}
              onChange={e => setNewProjectData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="Enter project description"
              rows={3}
              darkMode={darkMode}
            />
          </BaseFormField>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={newProjectData.isPublic}
              onChange={e => setNewProjectData(prev => ({
                ...prev,
                isPublic: e.target.checked
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isPublic"
              className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Make project public
            </label>
          </div>

          <BaseModalActions darkMode={darkMode} align="right">
            <BaseButton
              variant="ghost"
              onClick={() => setShowNewProjectModal(false)}
              darkMode={darkMode}
            >
              Cancel
            </BaseButton>
            <BaseButton
              onClick={handleCreateProject}
              disabled={!newProjectData.name.trim()}
              darkMode={darkMode}
            >
              Create Project
            </BaseButton>
          </BaseModalActions>
        </BaseForm>
      </BaseModal>
    </div>
  );
} 