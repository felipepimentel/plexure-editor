export interface UserPreferences {
  theme?: 'light' | 'dark';
  left_panel_collapsed?: boolean;
  right_panel_collapsed?: boolean;
  left_panel_width?: number;
  right_panel_width?: number;
}

export interface EditorPreferences {
  theme: 'light' | 'dark';
  font_size: number;
  tab_size: number;
  word_wrap: boolean;
  left_panel_collapsed: boolean;
  right_panel_collapsed: boolean;
  left_panel_width: number;
  right_panel_width: number;
} 