import { create } from 'zustand';
import { Team, TeamMember, teamService } from '../services/teamService';

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTeams: () => Promise<void>;
  createTeam: (team: Pick<Team, 'name' | 'slug' | 'description'>) => Promise<void>;
  setCurrentTeam: (team: Team | null) => void;
  fetchMembers: (teamId: string) => Promise<void>;
  addMember: (teamId: string, email: string, role: TeamMember['role']) => Promise<void>;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  currentTeam: null,
  members: [],
  loading: false,
  error: null,

  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const teams = await teamService.list();
      set({ teams, loading: false });
      
      // Se não houver time selecionado e houver times disponíveis, seleciona o primeiro
      if (!get().currentTeam && teams.length > 0) {
        set({ currentTeam: teams[0] });
      }
    } catch (error) {
      set({ error: 'Failed to fetch teams', loading: false });
    }
  },

  createTeam: async (team) => {
    set({ loading: true, error: null });
    try {
      const newTeam = await teamService.create(team);
      set(state => ({
        teams: [...state.teams, newTeam],
        currentTeam: newTeam,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create team', loading: false });
    }
  },

  setCurrentTeam: (team) => {
    set({ currentTeam: team });
  },

  fetchMembers: async (teamId) => {
    set({ loading: true, error: null });
    try {
      const members = await teamService.getMembers(teamId);
      set({ members, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch team members', loading: false });
    }
  },

  addMember: async (teamId, email, role) => {
    set({ loading: true, error: null });
    try {
      await teamService.addMember(teamId, email, role);
      await get().fetchMembers(teamId);
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to add team member', loading: false });
    }
  }
})); 