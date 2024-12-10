-- Seed data for the database

DO $$
DECLARE
    demo_user_id UUID;
    demo_team_id UUID;
    demo_project_id UUID;
BEGIN
    -- Verifique se as tabelas necessárias existem antes de continuar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'teams'
          AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'Tabela "teams" não existe. Execute o script inicial do schema antes do seed.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'team_members'
          AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'Tabela "team_members" não existe. Execute o script inicial do schema antes do seed.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'projects'
          AND table_schema = 'public'
    ) THEN
        RAISE EXCEPTION 'Tabela "projects" não existe. Execute o script inicial do schema antes do seed.';
    END IF;

    -- Get demo user
    SELECT id INTO demo_user_id FROM auth.users 
    WHERE email = 'demo@swagger-editor.com';

    IF demo_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário demo não encontrado em auth.users.';
    END IF;

    -- Create demo team
    INSERT INTO public.teams (name, slug, description)
    VALUES (
        'Demo Team',
        'demo-team',
        'Default team for demo purposes'
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO demo_team_id;

    -- Add demo user as team owner
    INSERT INTO public.team_members (team_id, user_id, role)
    VALUES (demo_team_id, demo_user_id, 'owner')
    ON CONFLICT DO NOTHING;

    -- Create a demo project
    INSERT INTO public.projects (name, description, owner_id, team_id, is_public)
    VALUES (
        'Demo Project',
        'This is a project created for demonstration purposes',
        demo_user_id,
        demo_team_id,
        TRUE
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO demo_project_id;

    -- Create sample API contracts
    INSERT INTO public.api_contracts (
        project_id,
        name,
        description,
        version,
        spec,
        status,
        created_by,
        updated_by
    ) VALUES 
    (
        demo_project_id,
        'Pet Store API',
        'API for managing pet store operations',
        '1.0.0',
        '{
            "openapi": "3.0.0",
            "info": {
                "title": "Pet Store API",
                "version": "1.0.0",
                "description": "A sample Pet Store API"
            },
            "paths": {
                "/pets": {
                    "get": {
                        "summary": "List all pets",
                        "responses": {
                            "200": {
                                "description": "List of pets"
                            }
                        }
                    }
                }
            }
        }',
        'draft',
        demo_user_id,
        demo_user_id
    ),
    (
        demo_project_id,
        'E-commerce API',
        'API for managing e-commerce operations',
        '2.0.0',
        '{
            "openapi": "3.0.0",
            "info": {
                "title": "E-commerce API",
                "version": "2.0.0",
                "description": "Sample E-commerce API"
            },
            "paths": {
                "/products": {
                    "get": {
                        "summary": "List products",
                        "responses": {
                            "200": {
                                "description": "List of products"
                            }
                        }
                    }
                }
            }
        }',
        'draft',
        demo_user_id,
        demo_user_id
    );
END $$;
