export const DEFAULT_CONTENT = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API specification
paths:
  /hello:
    get:
      summary: Hello World
      description: Returns a greeting message
      operationId: getHello
      tags:
        - greetings
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                required:
                  - message
                properties:
                  message:
                    type: string
                    example: "Hello, World!"
`;
