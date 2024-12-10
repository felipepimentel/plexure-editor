import { supabase } from '../config/supabase';

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export const teamService = {
  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTeam(team: Pick<Team, 'name' | 'slug' | 'description'>): Promise<Team> {
    const { data, error } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);

    if (error) throw error;
    return data;
  },

  async addMember(teamId: string, email: string, role: TeamMember['role']): Promise<void> {
    // Primeiro busca o usuário pelo email
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('User not found');

    const { error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: userData.id,
        role
      });

    if (error) throw error;
  }
}; 