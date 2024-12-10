-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable auth schema
CREATE SCHEMA IF NOT EXISTS auth;

-- Create demo user
INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    'demo@swagger-editor.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    NOW(),
    NOW()
);

-- Create teams table
CREATE TABLE public.teams (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(team_id, user_id)
);

-- Create specifications table
CREATE TABLE public.specifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    version text NOT NULL,
    content text NOT NULL,
    team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create style_guides table
CREATE TABLE public.style_guides (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    version text NOT NULL,
    description text,
    rules jsonb NOT NULL DEFAULT '[]',
    metadata jsonb,
    team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_teams_slug ON public.teams(slug);
CREATE INDEX idx_teams_updated_at ON public.teams(updated_at DESC);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_role ON public.team_members(role);
CREATE INDEX idx_specifications_team_id ON public.specifications(team_id);
CREATE INDEX idx_specifications_updated_at ON public.specifications(updated_at DESC);
CREATE INDEX idx_specifications_version ON public.specifications(version);
CREATE INDEX idx_style_guides_team_id ON public.style_guides(team_id);
CREATE INDEX idx_style_guides_updated_at ON public.style_guides(updated_at DESC);
CREATE INDEX idx_style_guides_version ON public.style_guides(version);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_guides ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Team members can view their teams"
    ON public.teams FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = teams.id
        AND team_members.user_id = auth.uid()
    ));

CREATE POLICY "Team owners can manage teams"
    ON public.teams FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = teams.id
        AND team_members.user_id = auth.uid()
        AND team_members.role = 'owner'
    ));

CREATE POLICY "Team members can view other members"
    ON public.team_members FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members my_teams
        WHERE my_teams.team_id = team_members.team_id
        AND my_teams.user_id = auth.uid()
    ));

CREATE POLICY "Team owners and admins can manage members"
    ON public.team_members FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = team_members.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.role IN ('owner', 'admin')
    ));

CREATE POLICY "Team members can read specifications"
    ON public.specifications FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = specifications.team_id
        AND team_members.user_id = auth.uid()
    ));

CREATE POLICY "Team members can manage specifications"
    ON public.specifications FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = specifications.team_id
        AND team_members.user_id = auth.uid()
    ));

CREATE POLICY "Team members can read style guides"
    ON public.style_guides FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = style_guides.team_id
        AND team_members.user_id = auth.uid()
    ));

CREATE POLICY "Team members can manage style guides"
    ON public.style_guides FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = style_guides.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.role IN ('owner', 'admin')
    ));

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;