export interface UserPreferences {
  theme?: 'light' | 'dark';
  left_panel_collapsed?: boolean;
  right_panel_collapsed?: boolean;
  left_panel_width?: number;
  right_panel_width?: number;
}

export interface EditorPreferences {
  left_panel_collapsed?: boolean;
  right_panel_collapsed?: boolean;
} 