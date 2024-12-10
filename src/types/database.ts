export interface Team {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  team_id: string | null;
  created_at: string;
  updated_at: string;
  team?: Team;
}

export type Tables = {
  teams: Team;
  user_profiles: UserProfile;
}; 