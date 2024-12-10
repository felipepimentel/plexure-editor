import React, { useEffect } from 'react';
import { useTeamStore } from '../../store/teamStore';
import { useSpecificationStore } from '../../store/specificationStore';
import { ChevronDown, Loader2 } from 'lucide-react';

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
      <select
        value={currentTeam?.id || ''}
        onChange={(e) => handleTeamChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg appearance-none ${
          darkMode
            ? 'bg-gray-800 text-white border-gray-700'
            : 'bg-white text-gray-900 border-gray-200'
        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {teams.map(team => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`} />
    </div>
  );
} 