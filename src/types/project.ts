export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  team_id: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiContract {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  version: string;
  spec: any; // OpenAPI/Swagger specification
  status: 'draft' | 'review' | 'published';
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}

export interface StyleGuide {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  rules: {
    id: string;
    name: string;
    description: string;
    severity: 'error' | 'warning' | 'info';
    rule: any; // Rule configuration
  }[];
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  contract_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  path: string[]; // JSON path to the specific part of the contract
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

export type ContractValidationResult = {
  contractId: string;
  styleGuideId: string;
  results: {
    ruleId: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    path: string[];
    line?: number;
    column?: number;
  }[];
}; 