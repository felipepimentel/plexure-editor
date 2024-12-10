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
  async getSpecifications(teamId: string): Promise<Specification[]> {
    const { data, error } = await supabase
      .from('specifications')
      .select('*')
      .eq('team_id', teamId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(spec: Omit<Specification, 'id' | 'created_at' | 'updated_at'>): Promise<Specification> {
    const { data, error } = await supabase
      .from('specifications')
      .insert(spec)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Specification>): Promise<Specification> {
    const { data, error } = await supabase
      .from('specifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('specifications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};