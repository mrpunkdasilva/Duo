const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "API de Usuário",
    description: "API para gerenciamento de perfil de usuário",
    version: "1.0.0",
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    },
  ],
  paths: {
    "/api/user": {
      get: {
        tags: ["User"],
        summary: "Obter perfil do usuário",
        description: "Retorna os dados do perfil do usuário autenticado",
        security: [{ session: [] }],
        responses: {
          "200": {
            description: "Perfil do usuário",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/UserData" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Usuário não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["User"],
        summary: "Atualizar perfil",
        description: "Atualiza os dados do perfil do usuário",
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Perfil atualizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/UserData" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      patch: {
        tags: ["User"],
        summary: "Alterar senha",
        description: "Altera a senha do usuário autenticado",
        security: [{ session: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChangePasswordRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Senha alterada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Erro na validação ou senha incorreta",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Não autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      session: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
      },
    },
    schemas: {
      UserData: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID do usuário" },
          name: { type: "string", description: "Nome do usuário" },
          email: { type: "string", format: "email", description: "Email do usuário" },
          image: {
            type: "string",
            nullable: true,
            description: "URL da imagem de perfil",
          },
          bannerColor: {
            type: "string",
            nullable: true,
            description: "Cor do banner em hexadecimal",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Data de criação",
          },
        },
      },
      UpdateProfileRequest: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", description: "Nome do usuário", minLength: 1 },
          email: { type: "string", format: "email", description: "Email do usuário" },
          image: { type: "string", description: "URL da imagem de perfil" },
          bannerColor: {
            type: "string",
            description: "Cor do banner em hexadecimal",
            pattern: "^#[0-9A-Fa-f]{6}$",
          },
        },
      },
      ChangePasswordRequest: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: {
            type: "string",
            description: "Senha atual",
          },
          newPassword: {
            type: "string",
            description: "Nova senha",
            minLength: 6,
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", description: "Mensagem de erro" },
        },
      },
    },
  },
};

export { openApiDocument };
