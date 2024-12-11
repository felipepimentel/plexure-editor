export interface Project {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  owner_id: string;
  team_id?: string;
}

export interface ApiContract {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'review' | 'published';
  spec: string;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface StyleGuide {
  id: string;
  name: string;
  description: string;
  rules: StyleGuideRule[];
  project_id: string;
  created_at: string;
  updated_at: string;
}

export interface StyleGuideRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  pattern: string;
  message: string;
  style_guide_id: string;
}

export interface ValidationResult {
  path?: string;
  message?: string;
  rule: {
    severity: 'error' | 'warning' | 'info';
    name: string;
  };
}

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationPanelResult {
  path: string;
  message: string;
  rule: {
    severity: 'error' | 'warning' | 'info';
    name: string;
  };
} 