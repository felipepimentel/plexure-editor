import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { BaseList } from '../../ui/List';
import { BaseCard } from '../../ui/Card';

interface TeamListProps {
  teams: any[];
  loading?: boolean;
  error?: string;
  darkMode: boolean;
  onSelectTeam: (team: any) => void;
}

export function TeamList({
  teams,
  loading,
  error,
  darkMode,
  onSelectTeam
}: TeamListProps) {
  return (
    <BaseList
      items={teams}
      loading={loading}
      error={error}
      darkMode={darkMode}
      layout="list"
      emptyMessage={
        <div className={`text-center py-12 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>No teams found</p>
          <p className="text-sm mt-1">Create a new team to start collaborating</p>
        </div>
      }
      renderItem={(team) => (
        <BaseCard
          title={team.name}
          subtitle={team.description}
          darkMode={darkMode}
          onSelect={() => onSelectTeam(team)}
          actions={
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Users className="w-3.5 h-3.5" />
                <span>{team.members.length} members</span>
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
              {team.projects.length} projects
            </div>
          }
        />
      )}
      keyExtractor={(team) => team.id}
    />
  );
} 