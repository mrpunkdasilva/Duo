import { generateInviteCode, formatDate, slugify } from "@/lib/helpers";

describe("helpers", () => {
  describe("generateInviteCode", () => {
    it("should return a string of 6 characters", () => {
      const code = generateInviteCode();
      expect(code).toHaveLength(6);
    });

    it("should only contain alphanumeric characters", () => {
      const code = generateInviteCode();
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it("should generate different codes on multiple calls", () => {
      const codes = Array.from({ length: 10 }, () => generateInviteCode());
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBeGreaterThan(1);
    });
  });

  describe("formatDate", () => {
    it("should format Date object as dd/mm/yyyy", () => {
      const date = new Date("2024-03-15T00:00:00");
      const result = formatDate(date);
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should format string date as dd/mm/yyyy", () => {
      const dateStr = "2024-12-25T00:00:00";
      const result = formatDate(dateStr);
      expect(result).toContain("25");
      expect(result).toContain("2024");
    });
  });

  describe("slugify", () => {
    it("should convert text to lowercase", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("should remove accents from text", () => {
      expect(slugify("São Paulo")).toBe("sao-paulo");
    });

    it("should replace spaces with hyphens", () => {
      expect(slugify("one two three")).toBe("one-two-three");
    });

    it("should replace special characters with hyphens", () => {
      expect(slugify("hello@world!#$%")).toBe("hello-world");
    });

    it("should trim leading and trailing hyphens", () => {
      expect(slugify("--hello--")).toBe("hello");
    });
  });
});
