export interface UserPreferences {
  id: string;
  theme: 'dark' | 'light';
  left_panel_width: number;
  right_panel_width: number;
  left_panel_collapsed: boolean;
  right_panel_collapsed: boolean;
  current_view: string;
  last_opened_path: string[];
  created_at: string;
  updated_at: string;
}

export type PreferenceKey = keyof Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>;
export type PreferenceValue = UserPreferences[PreferenceKey]; 