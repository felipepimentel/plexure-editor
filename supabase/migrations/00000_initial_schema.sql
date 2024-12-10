-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create teams table
create table if not exists public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create user profiles table
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  team_id uuid references public.teams on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create user preferences table
create table if not exists public.user_preferences (
  id uuid references auth.users on delete cascade primary key,
  theme text not null default 'dark',
  left_panel_width integer not null default 320,
  right_panel_width integer not null default 480,
  left_panel_collapsed boolean not null default false,
  right_panel_collapsed boolean not null default false,
  current_view text not null default 'navigator',
  last_opened_path text[] not null default array['root'],
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create team members table
create table if not exists public.team_members (
  team_id uuid references public.teams on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'member', -- owner, admin, member
  created_at timestamptz default now() not null,
  primary key (team_id, user_id)
);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  owner_id uuid references auth.users on delete cascade not null,
  team_id uuid references public.teams on delete set null,
  is_public boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create API contracts table
create table if not exists public.api_contracts (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  description text,
  version text not null,
  spec jsonb not null default '{}'::jsonb,
  status text not null default 'draft', -- draft, review, published
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(project_id, version)
);

-- Create project members table
create table if not exists public.project_members (
  project_id uuid references public.projects on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'viewer', -- owner, editor, viewer
  created_at timestamptz default now() not null,
  primary key (project_id, user_id)
);

-- Create view for projects with user details
create or replace view public.projects_with_users as
select 
  p.*,
  up.full_name as owner_name,
  up.avatar_url as owner_avatar,
  t.name as team_name,
  t.slug as team_slug
from public.projects p
left join public.user_profiles up on up.id = p.owner_id
left join public.teams t on t.id = p.team_id;

-- Create view for project members with user details
create or replace view public.project_members_with_users as
select 
  pm.project_id,
  pm.user_id,
  pm.role,
  pm.created_at,
  up.full_name,
  up.avatar_url,
  up.team_id,
  t.name as team_name,
  t.slug as team_slug
from public.project_members pm
join public.user_profiles up on up.id = pm.user_id
left join public.teams t on t.id = up.team_id;

-- Create view for user profiles with team details
create or replace view public.user_profiles_with_teams as
select 
  up.id,
  up.full_name,
  up.avatar_url,
  up.team_id,
  up.created_at,
  up.updated_at,
  t.name as team_name,
  t.slug as team_slug
from public.user_profiles up
left join public.teams t on t.id = up.team_id;

-- Enable Row Level Security
alter table public.teams enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.api_contracts enable row level security;
alter table public.project_members enable row level security;

-- RLS Policies

-- Teams policies
create policy "Users can view teams they belong to" on public.teams
  for select using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.team_id = teams.id
      and user_profiles.id = auth.uid()
    )
  );

-- User profiles policies
create policy "Users can view their own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.user_profiles
  for update using (auth.uid() = id);

create policy "Users can view public profiles" on public.user_profiles
  for select using (true);

-- User preferences policies
create policy "Users can view their own preferences" on public.user_preferences
  for select using (auth.uid() = id);

create policy "Users can update their own preferences" on public.user_preferences
  for update using (auth.uid() = id);

create policy "Users can insert their own preferences" on public.user_preferences
  for insert with check (auth.uid() = id);

-- Team members policies
create policy "Anyone can view team members" on public.team_members
  for select using (true);

create policy "Team admins can manage members" on public.team_members
  for all using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.team_id = team_members.team_id
    )
  );

-- Projects policies
create policy "Anyone can view public projects" on public.projects
  for select using (is_public = true);

create policy "Project owners can manage their projects" on public.projects
  for all using (owner_id = auth.uid());

create policy "Team members can view team projects" on public.projects
  for select using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid()
    )
  );

-- Project members policies
create policy "Project owners can manage members" on public.project_members
  for all using (
    exists (
      select 1 from public.projects
      where projects.id = project_members.project_id
      and projects.owner_id = auth.uid()
    )
  );

create policy "Users can view their own memberships" on public.project_members
  for select using (user_id = auth.uid());

-- API Contracts policies
create policy "Users can view contracts of accessible projects" on public.api_contracts
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = api_contracts.project_id
      and (
        projects.is_public = true
        or projects.owner_id = auth.uid()
        or exists (
          select 1 from public.project_members
          where project_members.project_id = projects.id
          and project_members.user_id = auth.uid()
        )
      )
    )
  );

-- Functions and triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Create user profile
  insert into public.user_profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'https://api.dicebear.com/7.x/initials/svg?seed=' || new.raw_user_meta_data->>'full_name'
  );
  
  -- Create user preferences
  insert into public.user_preferences (id)
  values (new.id);
  
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers to all relevant tables
create trigger set_teams_updated_at
  before update on public.teams
  for each row execute procedure public.handle_updated_at();

create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute procedure public.handle_updated_at();

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger set_api_contracts_updated_at
  before update on public.api_contracts
  for each row execute procedure public.handle_updated_at();

-- Create style guides table
create table if not exists public.style_guides (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  description text,
  rules jsonb not null default '[]'::jsonb,
  is_active boolean default true,
  created_by uuid references auth.users not null,
  updated_by uuid references auth.users not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create index for style guides
create index if not exists idx_style_guides_project_id on public.style_guides(project_id);

-- Create view for style guides with details
create or replace view public.style_guides_with_details as
select 
  sg.*,
  up_created.full_name as created_by_name,
  up_updated.full_name as updated_by_name
from public.style_guides sg
left join public.user_profiles up_created on up_created.id = sg.created_by
left join public.user_profiles up_updated on up_updated.id = sg.updated_by;

-- Style guides policies
create policy "Project members can view style guides" on public.style_guides
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = style_guides.project_id
      and (
        p.is_public = true
        or p.owner_id = auth.uid()
        or exists (
          select 1 from public.project_members pm
          where pm.project_id = p.id
          and pm.user_id = auth.uid()
        )
      )
    )
  );

create policy "Project editors can manage style guides" on public.style_guides
  for all using (
    exists (
      select 1 from public.projects p
      join public.project_members pm on pm.project_id = p.id
      where p.id = style_guides.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner', 'editor')
    )
  );

-- Add trigger for style guides
create trigger set_style_guides_updated_at
  before update on public.style_guides
  for each row execute procedure public.handle_updated_at();
