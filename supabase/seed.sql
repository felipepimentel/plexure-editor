-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to create seed data
CREATE OR REPLACE FUNCTION seed_data()
RETURNS void AS $$
DECLARE
    demo_user_id UUID;
    demo_team_id UUID;
BEGIN
    -- Get demo user id (created in initial_schema)
    SELECT id INTO demo_user_id
    FROM auth.users
    WHERE email = 'demo@swagger-editor.com';

    -- Create demo team
    INSERT INTO public.teams (id, name, slug, description)
    VALUES (
        uuid_generate_v4(),
        'Demo Team',
        'demo-team',
        'Default team for demo and testing purposes'
    )
    RETURNING id INTO demo_team_id;

    -- Add demo user as team owner
    INSERT INTO public.team_members (team_id, user_id, role)
    VALUES (demo_team_id, demo_user_id, 'owner');

    -- Seed specifications
    INSERT INTO public.specifications (
        name,
        version,
        content,
        team_id,
        created_at,
        updated_at
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
        demo_team_id,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '1 day'
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
        demo_team_id,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '3 days'
    );

    -- Seed style guides
    INSERT INTO public.style_guides (
        name,
        version,
        description,
        rules,
        metadata,
        team_id,
        created_at,
        updated_at
    ) VALUES
    (
        'OpenAPI Best Practices',
        '1.0.0',
        'Default style guide with common best practices for OpenAPI specifications',
        '[
            {
                "id": "use-semantic-versioning",
                "name": "Use Semantic Versioning",
                "description": "API versions should follow semantic versioning (MAJOR.MINOR.PATCH)",
                "severity": "error"
            },
            {
                "id": "require-description",
                "name": "Require Description",
                "description": "All endpoints should have a description",
                "severity": "warning"
            },
            {
                "id": "use-https",
                "name": "Use HTTPS",
                "description": "All servers should use HTTPS protocol",
                "severity": "error"
            },
            {
                "id": "consistent-response-format",
                "name": "Consistent Response Format",
                "description": "Response formats should be consistent across endpoints",
                "severity": "warning"
            }
        ]'::jsonb,
        '{
            "author": "Demo Team",
            "tags": ["best-practices", "openapi", "recommended"],
            "version_history": [
                {
                    "version": "1.0.0",
                    "date": "2024-01-09",
                    "description": "Initial version"
                }
            ]
        }'::jsonb,
        demo_team_id,
        NOW(),
        NOW()
    );

    -- Log success
    RAISE NOTICE 'Seed data created successfully';
END;
$$ LANGUAGE plpgsql;

-- Execute the seed function
SELECT seed_data();

-- Clean up
DROP FUNCTION IF EXISTS seed_data();