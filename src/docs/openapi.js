// Hand-authored OpenAPI 3.0 spec, served via swagger-ui-express at /api-docs
// (see app.js). Kept as a plain object instead of YAML/JSDoc comments so it
// stays in one place and doesn't drift from routes silently.

const bearerAuth = { bearerAuth: [] };

const simpleError = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
};

const appError = {
  type: "object",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string" },
  },
};

const validationError = {
  type: "object",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string", example: "Validation failed" },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          field: { type: "string", example: "title" },
          message: { type: "string", example: "Title is required" },
        },
      },
    },
  },
};

const project = {
  type: "object",
  properties: {
    _id: { type: "string", example: "6620f1a2b6e4a1a1a1a1a1a1" },
    title: { type: "string", example: "Portfolio Website" },
    description: { type: "string", example: "This very site — React, Vite, and GSAP scroll animation." },
    techStack: { type: "array", items: { type: "string" }, example: ["React", "GSAP", "CSS"] },
    githubUrl: { type: "string", format: "uri", example: "https://github.com/example/repo" },
    liveUrl: { type: "string", format: "uri", example: "https://example.com" },
    imageUrl: { type: "string", format: "uri", example: "https://res.cloudinary.com/.../portfolio/abc123.jpg" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const projectInput = {
  type: "object",
  required: ["title", "description"],
  properties: {
    title: { type: "string", example: "Portfolio Website" },
    description: { type: "string", example: "This very site — React, Vite, and GSAP scroll animation." },
    techStack: { type: "array", items: { type: "string" }, example: ["React", "GSAP", "CSS"] },
    githubUrl: { type: "string", example: "https://github.com/example/repo" },
    liveUrl: { type: "string", example: "https://example.com" },
    imageUrl: { type: "string", example: "https://res.cloudinary.com/.../portfolio/abc123.jpg" },
  },
};

const vlog = {
  type: "object",
  properties: {
    _id: { type: "string", example: "6620f1a2b6e4a1a1a1a1a1a2" },
    title: { type: "string", example: "Finding Student Accommodation in Melbourne" },
    content: { type: "string", example: "What to look for in a lease, typical suburbs near universities..." },
    tags: { type: "array", items: { type: "string" }, example: ["housing", "melbourne"] },
    category: { type: "string", example: "Housing" },
    imageUrl: { type: "string", format: "uri" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
};

const vlogInput = {
  type: "object",
  required: ["title", "content"],
  properties: {
    title: { type: "string", example: "Finding Student Accommodation in Melbourne" },
    content: { type: "string", example: "What to look for in a lease, typical suburbs near universities..." },
    tags: { type: "array", items: { type: "string" }, example: ["housing", "melbourne"] },
    category: { type: "string", example: "Housing" },
    imageUrl: { type: "string", example: "https://res.cloudinary.com/.../portfolio/def456.jpg" },
  },
};

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "API Portfolio",
    version: "1.0.0",
    description:
      "REST API backing Sebastian's portfolio site. Reads (Projects, Guide posts) are public. " +
      "Writes and image uploads require a JWT with an `admin` role — obtained from `/auth/login`. " +
      "Endpoints with a padlock icon below require `Authorization: Bearer <token>`.",
  },
  servers: [
    { url: "https://personal-zebbian-portfolio-api.onrender.com/api/v1", description: "Production (Render)" },
    { url: "http://localhost:4000/api/v1", description: "Local development" },
  ],
  tags: [
    { name: "Auth", description: "Admin sign-in" },
    { name: "Projects", description: "Portfolio projects — public reads, admin writes" },
    { name: "Vlogs", description: "Guide / blog posts — public reads, admin writes" },
    { name: "Upload", description: "Image upload, proxied to Cloudinary" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token returned by POST /auth/login. Must belong to a user with role \"admin\".",
      },
    },
    schemas: {
      SimpleError: simpleError,
      AppError: appError,
      ValidationError: validationError,
      Project: project,
      ProjectInput: projectInput,
      ProjectUpdateInput: { ...projectInput, required: [] },
      Vlog: vlog,
      VlogInput: vlogInput,
      VlogUpdateInput: { ...vlogInput, required: [] },
      LoginInput: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "zebbian_admin" },
          password: { type: "string", format: "password", example: "••••••••" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        },
      },
      UploadResponse: {
        type: "object",
        properties: {
          url: { type: "string", format: "uri", example: "https://res.cloudinary.com/.../portfolio/abc123.jpg" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing or invalid bearer token.",
        content: { "application/json": { schema: simpleError, example: { message: "No token provided" } } },
      },
      Forbidden: {
        description: "Valid token, but not an admin.",
        content: { "application/json": { schema: simpleError, example: { message: "Admin access required" } } },
      },
      NotFound: {
        description: "No document with that id.",
        content: { "application/json": { schema: simpleError } },
      },
      ValidationFailed: {
        description: "Request body failed schema validation.",
        content: { "application/json": { schema: validationError } },
      },
      TooManyRequests: {
        description: "Rate limit exceeded.",
        content: { "application/json": { schema: appError } },
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in",
        description: "Public. Rate-limited to 10 requests per 15 minutes per IP.",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } },
        },
        responses: {
          200: {
            description: "Login succeeded.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } },
          },
          400: { $ref: "#/components/responses/ValidationFailed" },
          401: {
            description: "Wrong username or password.",
            content: { "application/json": { schema: simpleError, example: { message: "Invalid credentials" } } },
          },
          429: { $ref: "#/components/responses/TooManyRequests" },
        },
      },
    },
    "/projects": {
      get: {
        tags: ["Projects"],
        summary: "List all projects",
        description: "Public. Sorted newest first.",
        security: [],
        responses: {
          200: {
            description: "Array of projects.",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Project" } } } },
          },
        },
      },
      post: {
        tags: ["Projects"],
        summary: "Create a project",
        description: "Admin only.",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectInput" } } },
        },
        responses: {
          201: {
            description: "Project created.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Project" } } },
          },
          400: { $ref: "#/components/responses/ValidationFailed" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/projects/{id}": {
      put: {
        tags: ["Projects"],
        summary: "Update a project",
        description: "Admin only. Partial updates supported — send only the fields to change.",
        security: [bearerAuth],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectUpdateInput" } } },
        },
        responses: {
          200: {
            description: "Updated project.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Project" } } },
          },
          400: { $ref: "#/components/responses/ValidationFailed" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete a project",
        description: "Admin only.",
        security: [bearerAuth],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Deleted." },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/vlogs": {
      get: {
        tags: ["Vlogs"],
        summary: "List guide posts",
        description: "Public. Sorted newest first.",
        security: [],
        parameters: [
          { name: "tag", in: "query", schema: { type: "string" }, description: "Filter by a single tag." },
          { name: "category", in: "query", schema: { type: "string" }, description: "Filter by category." },
        ],
        responses: {
          200: {
            description: "Array of guide posts.",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Vlog" } } } },
          },
        },
      },
      post: {
        tags: ["Vlogs"],
        summary: "Create a guide post",
        description: "Admin only.",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VlogInput" } } },
        },
        responses: {
          201: {
            description: "Guide post created.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Vlog" } } },
          },
          400: { $ref: "#/components/responses/ValidationFailed" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/vlogs/{id}": {
      put: {
        tags: ["Vlogs"],
        summary: "Update a guide post",
        description: "Admin only. Partial updates supported — send only the fields to change.",
        security: [bearerAuth],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VlogUpdateInput" } } },
        },
        responses: {
          200: {
            description: "Updated guide post.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Vlog" } } },
          },
          400: { $ref: "#/components/responses/ValidationFailed" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Vlogs"],
        summary: "Delete a guide post",
        description: "Admin only.",
        security: [bearerAuth],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Deleted." },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/upload": {
      post: {
        tags: ["Upload"],
        summary: "Upload an image",
        description:
          "Admin only. Multipart form with a single `image` field. Max 5MB, image MIME types only. " +
          "Returns the Cloudinary-hosted URL to store on a project's or guide post's `imageUrl` field.",
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Upload succeeded.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UploadResponse" } } },
          },
          400: {
            description: "No file provided, wrong file type, or file too large.",
            content: { "application/json": { schema: simpleError } },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
  },
};
