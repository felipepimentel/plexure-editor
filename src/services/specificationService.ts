import { supabase } from '../config/supabase';

export interface Specification {
  id: string;
  name: string;
  version: string;
  content: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

export const specificationService = {
  async list(teamId: string): Promise<Specification[]> {
    const { data, error } = await supabase
      .from('specifications')
      .select('*')
      .eq('team_id', teamId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(teamId: string, spec: Omit<Specification, 'id' | 'created_at' | 'updated_at' | 'team_id'>): Promise<Specification> {
    const { data, error } = await supabase
      .from('specifications')
      .insert([{
        ...spec,
        team_id: teamId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Specification>): Promise<Specification> {
    try {
      const { data, error } = await supabase
        .from('specifications')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update specification:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('specifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete specification:', error);
      throw error;
    }
  }
};