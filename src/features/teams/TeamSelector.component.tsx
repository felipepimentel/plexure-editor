import React, { useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { BaseFormSelect } from '../ui/Form';
import { useTeamStore } from '../../stores/teamStore';
import { useSpecificationStore } from '../../stores/specificationStore';

interface TeamSelectorProps {
  darkMode: boolean;
}

export function TeamSelector({ darkMode }: TeamSelectorProps) {
  const { 
    teams, 
    currentTeam, 
    loading, 
    error,
    fetchTeams, 
    setCurrentTeam 
  } = useTeamStore();

  const { fetchSpecifications } = useSpecificationStore();

  useEffect(() => {
    fetchTeams().then(() => {
      // Se não houver time selecionado e houver times disponíveis,
      // seleciona o primeiro time
      if (!currentTeam && teams.length > 0) {
        handleTeamChange(teams[0].id);
      }
    });
  }, [fetchTeams]);

  const handleTeamChange = async (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      await fetchSpecifications();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading teams...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 px-3 py-2">
        Failed to load teams
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-gray-500 px-3 py-2">
        No teams available
      </div>
    );
  }

  return (
    <div className="relative">
      <BaseFormSelect
        value={currentTeam?.id || ''}
        onChange={(e) => handleTeamChange(e.target.value)}
        darkMode={darkMode}
      >
        {teams.map(team => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </BaseFormSelect>
      <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`} />
    </div>
  );
} 