import React, { useState } from 'react';
import { Plus, FolderGit2, Users, Globe, Lock, ChevronRight } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types/project';

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
        <button
          onClick={() => setShowNewProjectModal(true)}
          className={`p-2 rounded-lg flex items-center gap-2 ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">New Project</span>
        </button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className={`text-center py-12 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <FolderGit2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No projects yet</p>
            <p className="text-sm mt-1">Create your first project to get started</p>
          </div>
        ) : (
          projects.map(project => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project)}
              className={`w-full p-4 rounded-lg border transition-colors ${
                darkMode
                  ? 'border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 text-left">
                  <h3 className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className={`mt-1 text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
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
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </button>
          ))
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-xl shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Project
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProjectData.name}
                    onChange={e => setNewProjectData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={newProjectData.description}
                    onChange={e => setNewProjectData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
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
              </div>
            </div>
            <div className={`p-4 border-t flex justify-end gap-3 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectData.name.trim()}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                }`}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 