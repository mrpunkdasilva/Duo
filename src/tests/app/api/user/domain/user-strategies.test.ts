import {
  UpdateProfileStrategy,
  ChangePasswordStrategy,
  validateWithStrategy,
} from "@/app/api/user/domain/strategies/user-strategies";

describe("user-strategies", () => {
  describe("UpdateProfileStrategy", () => {
    const strategy = new UpdateProfileStrategy();

    it("should return error when data is null", () => {
      // Arrange & Act
      const result = strategy.validate(null);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dados inválidos");
    });

    it("should return error when data is not an object", () => {
      // Arrange & Act
      const result = strategy.validate("string");

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dados inválidos");
    });

    it("should return error when name is empty", () => {
      // Arrange & Act
      const result = strategy.validate({ name: "", email: "test@test.com" });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Nome é obrigatório");
    });

    it("should return error when name is only spaces", () => {
      // Arrange & Act
      const result = strategy.validate({ name: "   ", email: "test@test.com" });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Nome é obrigatório");
    });

    it("should return error when email is invalid", () => {
      // Arrange & Act
      const result = strategy.validate({ name: "Test", email: "invalid" });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Email inválido");
    });

    it("should return error when email has no @", () => {
      // Arrange & Act
      const result = strategy.validate({ name: "Test", email: "test.com" });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Email inválido");
    });

    it("should trim name when validation succeeds", () => {
      // Arrange & Act
      const result = strategy.validate({ name: "  Test  ", email: "test@test.com" });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Test");
    });

    it("should lowercase email when validation succeeds", () => {
      // Arrange & Act
      const result = strategy.validate({ name: "Test", email: "TEST@TEST.COM" });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.email).toBe("test@test.com");
    });

    it("should include image when provided as string", () => {
      // Arrange & Act
      const result = strategy.validate({
        name: "Test",
        email: "test@test.com",
        image: "http://image.jpg",
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.image).toBe("http://image.jpg");
    });

    it("should set image as undefined when not a string", () => {
      // Arrange & Act
      const result = strategy.validate({
        name: "Test",
        email: "test@test.com",
        image: 123,
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.image).toBeUndefined();
    });

    it("should include bannerColor when provided as string", () => {
      // Arrange & Act
      const result = strategy.validate({
        name: "Test",
        email: "test@test.com",
        bannerColor: "#ff0000",
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.bannerColor).toBe("#ff0000");
    });
  });

  describe("ChangePasswordStrategy", () => {
    const strategy = new ChangePasswordStrategy();

    it("should return error when data is null", () => {
      // Arrange & Act
      const result = strategy.validate(null);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Dados inválidos");
    });

    it("should return error when currentPassword is missing", () => {
      // Arrange & Act
      const result = strategy.validate({ newPassword: "123456" });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Senha atual é obrigatória");
    });

    it("should return error when newPassword is less than 6 characters", () => {
      // Arrange & Act
      const result = strategy.validate({
        currentPassword: "old",
        newPassword: "12345",
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Nova senha deve ter pelo menos 6 caracteres");
    });

    it("should return success with valid data", () => {
      // Arrange & Act
      const result = strategy.validate({
        currentPassword: "oldpass",
        newPassword: "newpass123",
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.currentPassword).toBe("oldpass");
      expect(result.data?.newPassword).toBe("newpass123");
    });
  });

  describe("validateWithStrategy", () => {
    it("should call strategy validate method", () => {
      // Arrange
      const strategy = new UpdateProfileStrategy();
      const data = { name: "Test", email: "test@test.com" };

      // Act
      const result = validateWithStrategy(strategy, data);

      // Assert
      expect(result.success).toBe(true);
    });
  });
});
