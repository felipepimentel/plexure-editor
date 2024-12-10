export const DEFAULT_SPEC = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API to demonstrate Swagger/OpenAPI specification
paths:
  /users:
    get:
      summary: Get all users
      description: Returns a list of users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string
    post:
      summary: Create a new user
      description: Creates a new user with the provided data
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
      responses:
        '201':
          description: User created successfully`;