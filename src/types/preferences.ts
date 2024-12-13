export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  left_panel_collapsed: boolean;
  right_panel_collapsed: boolean;
  left_panel_width: number;
  right_panel_width: number;
}

export interface EditorPreferences {
  theme: 'vs-dark' | 'vs-light';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  left_panel_collapsed: boolean;
  right_panel_collapsed: boolean;
  left_panel_width: number;
  right_panel_width: number;
}

export interface EditorState {
  content: string;
  cursorPosition: {
    line: number;
    column: number;
  };
  selection: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  } | null;
  scrollPosition: {
    scrollTop: number;
    scrollLeft: number;
  };
}

export interface ValidationResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  source?: string;
  code?: string;
} 