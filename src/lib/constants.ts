export const DEFAULT_CONTENT = `openapi: 3.0.0
info:
  title: Sample API
  description: A sample API to demonstrate OpenAPI features
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
    description: Production server
paths:
  /hello:
    get:
      summary: Hello World
      description: Returns a greeting message
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Hello, World!`;

export const STORAGE_KEYS = {
  RECENT_FILES: 'swagger-editor-recent-files',
  THEME: 'swagger-editor-theme',
  EDITOR_CONFIG: 'swagger-editor-config'
};
