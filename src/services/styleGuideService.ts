import { supabase } from '../config/supabase';
import { StyleGuide } from '../types/styleGuide';

export const styleGuideService = {
  async list() {
    const { data, error } = await supabase
      .from('style_guides')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async get(id: string) {
    const { data, error } = await supabase
      .from('style_guides')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(guide: Omit<StyleGuide, 'id'>) {
    const { data, error } = await supabase
      .from('style_guides')
      .insert([guide])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<StyleGuide>) {
    const { data, error } = await supabase
      .from('style_guides')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('style_guides')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};