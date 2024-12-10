import { DEFAULT_SPEC } from '../constants';

export const sampleSpecifications = [
  {
    name: 'Pet Store API',
    version: '1.0.0',
    content: `openapi: 3.0.0
info:
  title: Pet Store API
  version: 1.0.0
  description: A sample Pet Store API demonstrating OpenAPI capabilities
paths:
  /pets:
    get:
      summary: List all pets
      description: Returns a list of pets in the store
      parameters:
        - name: limit
          in: query
          description: Maximum number of pets to return
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: A list of pets
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
    post:
      summary: Add a new pet
      description: Creates a new pet in the store
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewPet'
      responses:
        '201':
          description: Pet created successfully
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
        tag:
          type: string
        status:
          type: string
          enum: [available, pending, sold]
    NewPet:
      type: object
      required:
        - name
      properties:
        name:
          type: string
        tag:
          type: string`
  },
  {
    name: 'E-commerce API',
    version: '2.0.0',
    content: `openapi: 3.0.0
info:
  title: E-commerce API
  version: 2.0.0
  description: Modern e-commerce platform API
paths:
  /products:
    get:
      summary: List products
      description: Returns a paginated list of products
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: category
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of products
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
    post:
      summary: Create product
      description: Creates a new product
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NewProduct'
      responses:
        '201':
          description: Product created successfully
components:
  schemas:
    Product:
      type: object
      required:
        - id
        - name
        - price
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        description:
          type: string
        price:
          type: number
          format: float
        category:
          type: string
        inStock:
          type: boolean
    NewProduct:
      type: object
      required:
        - name
        - price
      properties:
        name:
          type: string
        description:
          type: string
        price:
          type: number
        category:
          type: string
    PaginationMeta:
      type: object
      properties:
        currentPage:
          type: integer
        totalPages:
          type: integer
        totalItems:
          type: integer
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer`
  },
  {
    name: 'Default Template',
    version: '1.0.0',
    content: DEFAULT_SPEC
  }
];