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
  async list(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(team: Pick<Team, 'name' | 'slug' | 'description'>): Promise<Team> {
    const { data, error } = await supabase
      .rpc('create_team_with_owner', {
        team_name: team.name,
        team_slug: team.slug,
        team_description: team.description
      });

    if (error) throw error;
    return data;
  },

  async getMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        users:user_id (
          email,
          user_metadata
        )
      `)
      .eq('team_id', teamId);

    if (error) throw error;
    return data || [];
  },

  async addMember(teamId: string, email: string, role: TeamMember['role']): Promise<void> {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) throw userError;

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