import { generateInviteCode, formatDate, slugify } from "@/lib/helpers";

describe("helpers", () => {
  describe("generateInviteCode", () => {
    it("should return a string of 6 characters", () => {
      // Arrange & Act
      const code = generateInviteCode();

      // Assert
      expect(code).toHaveLength(6);
    });

    it("should only contain alphanumeric characters", () => {
      // Arrange & Act
      const code = generateInviteCode();

      // Assert
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it("should generate different codes on multiple calls", () => {
      // Arrange & Act
      const codes = Array.from({ length: 10 }, () => generateInviteCode());

      // Assert
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBeGreaterThan(1);
    });
  });

  describe("formatDate", () => {
    it("should format Date object as dd/mm/yyyy", () => {
      // Arrange
      const date = new Date("2024-03-15T00:00:00");

      // Act
      const result = formatDate(date);

      // Assert
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should format string date as dd/mm/yyyy", () => {
      // Arrange
      const dateStr = "2024-12-25T00:00:00";

      // Act
      const result = formatDate(dateStr);

      // Assert
      expect(result).toContain("25");
      expect(result).toContain("2024");
    });
  });

  describe("slugify", () => {
    it("should convert text to lowercase", () => {
      // Arrange & Act
      const result = slugify("Hello World");

      // Assert
      expect(result).toBe("hello-world");
    });

    it("should remove accents from text", () => {
      // Arrange & Act
      const result = slugify("São Paulo");

      // Assert
      expect(result).toBe("sao-paulo");
    });

    it("should replace spaces with hyphens", () => {
      // Arrange & Act
      const result = slugify("one two three");

      // Assert
      expect(result).toBe("one-two-three");
    });

    it("should replace special characters with hyphens", () => {
      // Arrange & Act
      const result = slugify("hello@world!#$%");

      // Assert
      expect(result).toBe("hello-world");
    });

    it("should trim leading and trailing hyphens", () => {
      // Arrange & Act
      const result = slugify("--hello--");

      // Assert
      expect(result).toBe("hello");
    });
  });
});
