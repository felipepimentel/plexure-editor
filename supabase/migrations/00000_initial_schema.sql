-- Seed data for the database

DO $$
DECLARE
    demo_user_id UUID;
    demo_team_id UUID;
BEGIN
    -- Get demo user
    SELECT id INTO demo_user_id FROM auth.users 
    WHERE email = 'demo@swagger-editor.com';

    -- Create demo team
    INSERT INTO public.teams (name, slug, description)
    VALUES (
        'Demo Team',
        'demo-team',
        'Default team for demo purposes'
    )
    RETURNING id INTO demo_team_id;

    -- Add demo user as team owner
    INSERT INTO public.team_members (team_id, user_id, role)
    VALUES (demo_team_id, demo_user_id, 'owner');

    -- Create sample specifications
    INSERT INTO public.specifications (
        name,
        version,
        content,
        team_id
    ) VALUES 
    -- Pet Store API
    (
        'Pet Store API',
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
        demo_team_id
    ),
    -- E-commerce API
    (
        'E-commerce API',
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
        demo_team_id
    );

    -- Create additional user profiles
    INSERT INTO public.user_profiles (id, full_name, avatar_url, team_id)
    VALUES (
        demo_user_id,
        'Demo User',
        'https://api.dicebear.com/7.x/initials/svg?seed=Demo User',
        demo_team_id
    );
END $$;
