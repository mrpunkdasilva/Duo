import { openApiDocument } from "@/lib/openapi";

describe("openapi", () => {
  it("should export a valid OpenAPI document", () => {
    expect(openApiDocument).toBeDefined();
    expect(openApiDocument.openapi).toBe("3.0.3");
  });

  it("should have correct info", () => {
    expect(openApiDocument.info.title).toBe("API de Usuário");
    expect(openApiDocument.info.version).toBe("1.0.0");
  });

  it("should have servers configured", () => {
    expect(openApiDocument.servers).toBeDefined();
    expect(openApiDocument.servers.length).toBeGreaterThan(0);
  });

  it("should have paths for /api/user", () => {
    expect(openApiDocument.paths["/api/user"]).toBeDefined();
    expect(openApiDocument.paths["/api/user"].get).toBeDefined();
    expect(openApiDocument.paths["/api/user"].put).toBeDefined();
    expect(openApiDocument.paths["/api/user"].patch).toBeDefined();
  });

  it("should have components with schemas", () => {
    expect(openApiDocument.components).toBeDefined();
    expect(openApiDocument.components.schemas).toBeDefined();
    expect(openApiDocument.components.schemas.UserData).toBeDefined();
    expect(openApiDocument.components.schemas.UpdateProfileRequest).toBeDefined();
    expect(openApiDocument.components.schemas.ChangePasswordRequest).toBeDefined();
    expect(openApiDocument.components.schemas.ErrorResponse).toBeDefined();
  });

  it("should have security schemes", () => {
    expect(openApiDocument.components.securitySchemes.session).toBeDefined();
  });
});
