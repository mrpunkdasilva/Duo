import {
  UpdateProfileStrategy,
  ChangePasswordStrategy,
  validateWithStrategy,
} from "@/app/api/user/domain/strategies/user-strategies";

describe("user-strategies", () => {
  describe("UpdateProfileStrategy", () => {
    const strategy = new UpdateProfileStrategy();

    it("should return error when data is null", () => {
      const result = strategy.validate(null);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dados inválidos");
    });

    it("should return error when data is not an object", () => {
      const result = strategy.validate("string");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dados inválidos");
    });

    it("should return error when name is empty", () => {
      const result = strategy.validate({ name: "", email: "test@test.com" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Nome é obrigatório");
    });

    it("should return error when name is only spaces", () => {
      const result = strategy.validate({ name: "   ", email: "test@test.com" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Nome é obrigatório");
    });

    it("should return error when email is invalid", () => {
      const result = strategy.validate({ name: "Test", email: "invalid" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Email inválido");
    });

    it("should return error when email has no @", () => {
      const result = strategy.validate({ name: "Test", email: "test.com" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Email inválido");
    });

    it("should trim name when validation succeeds", () => {
      const result = strategy.validate({ name: "  Test  ", email: "test@test.com" });
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Test");
    });

    it("should lowercase email when validation succeeds", () => {
      const result = strategy.validate({ name: "Test", email: "TEST@TEST.COM" });
      expect(result.success).toBe(true);
      expect(result.data?.email).toBe("test@test.com");
    });

    it("should include image when provided as string", () => {
      const result = strategy.validate({
        name: "Test",
        email: "test@test.com",
        image: "http://image.jpg",
      });
      expect(result.success).toBe(true);
      expect(result.data?.image).toBe("http://image.jpg");
    });

    it("should set image as undefined when not a string", () => {
      const result = strategy.validate({
        name: "Test",
        email: "test@test.com",
        image: 123,
      });
      expect(result.success).toBe(true);
      expect(result.data?.image).toBeUndefined();
    });

    it("should include bannerColor when provided as string", () => {
      const result = strategy.validate({
        name: "Test",
        email: "test@test.com",
        bannerColor: "#ff0000",
      });
      expect(result.success).toBe(true);
      expect(result.data?.bannerColor).toBe("#ff0000");
    });
  });

  describe("ChangePasswordStrategy", () => {
    const strategy = new ChangePasswordStrategy();

    it("should return error when data is null", () => {
      const result = strategy.validate(null);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dados inválidos");
    });

    it("should return error when currentPassword is missing", () => {
      const result = strategy.validate({ newPassword: "123456" });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Senha atual é obrigatória");
    });

    it("should return error when newPassword is less than 6 characters", () => {
      const result = strategy.validate({
        currentPassword: "old",
        newPassword: "12345",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Nova senha deve ter pelo menos 6 caracteres");
    });

    it("should return success with valid data", () => {
      const result = strategy.validate({
        currentPassword: "oldpass",
        newPassword: "newpass123",
      });
      expect(result.success).toBe(true);
      expect(result.data?.currentPassword).toBe("oldpass");
      expect(result.data?.newPassword).toBe("newpass123");
    });
  });

  describe("validateWithStrategy", () => {
    it("should call strategy validate method", () => {
      const strategy = new UpdateProfileStrategy();
      const result = validateWithStrategy(strategy, { name: "Test", email: "test@test.com" });
      expect(result.success).toBe(true);
    });
  });
});
