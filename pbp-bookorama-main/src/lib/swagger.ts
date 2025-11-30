export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Bookorama API Documentation',
    version: '1.0.0',
    description: 'Dokumentasi API untuk aplikasi toko buku Bookorama',
  },
  servers: [
    {
      url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'next-auth.session-token',
      },
    },
    schemas: {
      Book: {
        type: 'object',
        properties: {
          isbn: { type: 'string' },
          title: { type: 'string' },
          author: { type: 'string' },
          price: { type: 'number' },
          categoryId: { type: 'integer' },
          adminId: { type: 'integer' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          cart: {
            type: 'array',
            items: { $ref: '#/components/schemas/Book' },
          },
          userId: { type: 'integer' },
        },
      },
    },
  },
  security: [{ cookieAuth: [] }],
  paths: {
    '/api/books': {
      get: {
        summary: 'Get all books',
        tags: ['Books'],
        responses: {
          200: {
            description: 'List of books',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Book' },
                    },
                    status: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/book': {
      post: {
        summary: 'Create a new book',
        tags: ['Books'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Book' },
            },
          },
        },
        responses: {
          200: { description: 'Book created successfully' },
          400: { description: 'Book already exists' },
        },
      },
    },
    '/api/book/{id}': {
      get: {
        summary: 'Get book by ISBN',
        tags: ['Books'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Book details' },
        },
      },
      put: {
        summary: 'Update book',
        tags: ['Books'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Book' },
            },
          },
        },
        responses: {
          200: { description: 'Book updated' },
        },
      },
      delete: {
        summary: 'Delete book',
        tags: ['Books'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Book deleted' },
        },
      },
    },
    '/api/categories': {
      get: {
        summary: 'Get all categories',
        tags: ['Categories'],
        responses: {
          200: { description: 'List of categories' },
        },
      },
    },
    '/api/category': {
      post: {
        summary: 'Create category',
        tags: ['Categories'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Category created' },
        },
      },
    },
    '/api/category/{id}': {
      get: {
        summary: 'Get category by ID',
        tags: ['Categories'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { 200: { description: 'Category details' } },
      },
      put: {
        summary: 'Update category',
        tags: ['Categories'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Category updated' } },
      },
      delete: {
        summary: 'Delete category',
        tags: ['Categories'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { 200: { description: 'Category deleted' } },
      },
    },
    '/api/orders': {
      get: {
        summary: 'Get all orders',
        tags: ['Orders'],
        responses: { 200: { description: 'List of orders' } },
      },
    },
    '/api/order': {
      post: {
        summary: 'Create order',
        tags: ['Orders'],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' },
            },
          },
        },
        responses: { 200: { description: 'Order created' } },
      },
    },
    '/api/order/{id}': {
      get: {
        summary: 'Get order detail',
        tags: ['Orders'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: { 200: { description: 'Order details' } },
      },
    },
    '/api/profile': {
      get: {
        summary: 'Get user profile',
        tags: ['Profile'],
        responses: { 200: { description: 'User profile data' } },
      },
      put: {
        summary: 'Update user profile',
        tags: ['Profile'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
  },
};